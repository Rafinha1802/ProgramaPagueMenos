"""Repositório de produtos: carrega parquet e expõe consultas.

Interface pensada para trocar parquet por PostgreSQL + pgvector
sem mudar quem consome.
"""
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd

from app.core.guardrails import classifica_produto

logger = logging.getLogger(__name__)


class ProductRepository:
    def __init__(self, catalog_path: str = "data/paguemenos_catalog.parquet"):
        p = Path(catalog_path)
        if not p.exists():
            backend_root = Path(__file__).resolve().parent.parent.parent
            candidates = [
                backend_root / catalog_path,
                backend_root / "data" / "paguemenos_catalog.parquet",
                Path("data/paguemenos_catalog.parquet"),
            ]
            found = False
            for c in candidates:
                if c.exists():
                    p = c
                    found = True
                    break
            if not found:
                raise FileNotFoundError(f"Catálogo não encontrado em {catalog_path} nem nos caminhos alternativos")
        self.path = p
        self.df = pd.read_parquet(self.path)
        self._ensure_features()
        logger.info(f"Catálogo carregado com sucesso: {len(self.df)} produtos de {self.path}")

    # ----------------------------------------------------------
    def _ensure_features(self):
        """Se o parquet veio do ETL cru, garante is_prescription e suspeita."""
        if "is_prescription" not in self.df.columns:
            classificacoes = self.df.apply(
                lambda r: classifica_produto(r.get("category_path", ""), r.get("description", "")),
                axis=1,
            )
            self.df["is_prescription"] = classificacoes.apply(lambda x: x["is_prescription"])
            self.df["sinais_fortes"] = classificacoes.apply(lambda x: ", ".join(x["sinais_fortes"]))
            self.df["sinais_fracos"] = classificacoes.apply(lambda x: ", ".join(x["sinais_fracos"]))
            self.df["suspeita"] = classificacoes.apply(lambda x: x["suspeita"])

    # ----------------------------------------------------------
    def get_dataframe(self) -> pd.DataFrame:
        return self.df

    def get_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        row = self.df[self.df["product_id"].astype(str) == str(product_id)]
        if row.empty:
            return None
        return row.iloc[0].to_dict()

    def get_by_ids(self, product_ids: List[str]) -> List[Dict[str, Any]]:
        id_set = {str(i).strip() for i in product_ids if str(i).strip()}
        if not id_set:
            return []
        matched = self.df[self.df["product_id"].astype(str).isin(id_set)]
        return matched.to_dict(orient="records")

    def list(
        self,
        categoria: Optional[str] = None,
        apenas_disponiveis: bool = True,
        limite: int = 50,
        offset: int = 0,
        ids: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        df = self.df
        if ids:
            id_set = {str(i).strip() for i in ids if str(i).strip()}
            df = df[df["product_id"].astype(str).isin(id_set)]
        if apenas_disponiveis:
            df = df[df["is_available"] == True]
        df = df[df["is_prescription"] == False]
        if categoria:
            df = df[df["category_path"].str.contains(categoria, case=False, na=False)]
        return df.iloc[offset:offset + limite].to_dict(orient="records")

    # ----------------------------------------------------------
    def search_semantic(
        self,
        query: str,
        rag_engine: Optional[Any] = None,
        categoria: Optional[str] = None,
        apenas_disponiveis: bool = True,
        limite: int = 50,
        prefer_generics: bool = False,
        max_price: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        """Pesquisa Semântica com IA Farmacêutica: RAG vetorial + similaridade lexical + sintomas."""
        import re

        clean_q = (query or "").strip().lower()
        if not clean_q:
            return self.list(categoria=categoria, apenas_disponiveis=apenas_disponiveis, limite=limite)

        # 1. Extrai intenção de orçamento da busca (ex: "até 50", "menos de 30")
        extracted_max_price = max_price
        budget_match = re.search(r"(?:at[eé]|menos de|max|maximo de|teto de)\s*(?:r\$\s*)?(\d+(?:[.,]\d+)?)", clean_q)
        if budget_match:
            try:
                extracted_max_price = float(budget_match.group(1).replace(",", "."))
            except ValueError:
                pass

        # 2. Preferência de genéricos na busca
        if any(w in clean_q for w in ["generico", "genérico", "barato", "economia", "mais em conta"]):
            prefer_generics = True

        # 3. Dicionário farmacêutico de sinônimos e sintomas
        symptom_mappings = {
            "dor": ["dipirona", "paracetamol", "dorflex", "neosaldina", "ibuprofeno", "analgesico"],
            "cabeca": ["neosaldina", "dipirona", "paracetamol", "dorflex"],
            "febre": ["dipirona", "paracetamol", "antietermico", "tylenol"],
            "gripe": ["benegrip", "cimegripe", "resfriado", "vitamina c"],
            "azia": ["omeprazol", "antiacido", "estomago", "refluxo", "pantoprazol"],
            "colica": ["buscopan", "escopolamina", "antiespasmodico"],
            "alergia": ["loratadina", "antialergico", "desloratadina", "antialergico"],
            "solar": ["nivea sun", "neutrogena", "protetor solar", "fps", "sun"],
            "pele oleosa": ["actine", "darrow", "cerave", "matte"],
            "hidrat": ["cerave", "nivea", "hidratante", "creme"],
            "bebe": ["aptanutri", "pampers", "infantil", "bebe"],
            "soro": ["dauf", "fisiologico", "soro"]
        }

        # 4. Busca vetorial via RAGEngine se disponível
        scored_ids = {}
        if rag_engine is not None:
            try:
                rag_results = rag_engine.busca_vetorial(clean_q, top_k=min(100, len(self.df)))
                for _, row in rag_results.iterrows():
                    pid = str(row["product_id"])
                    score = float(row.get("score", 0.0))
                    scored_ids[pid] = score * 2.0  # peso vetorial
            except Exception as e:
                logger.warning(f"Aviso no RAG da pesquisa semântica: {e}")

        # 5. Pontuação híbrida (Lexical + Sintomas + RAG)
        df_candidates = self.df.copy()
        if apenas_disponiveis:
            df_candidates = df_candidates[df_candidates["is_available"] == True]
        df_candidates = df_candidates[df_candidates["is_prescription"] == False]

        if categoria:
            df_candidates = df_candidates[df_candidates["category_path"].str.contains(categoria, case=False, na=False)]

        query_tokens = [t for t in re.split(r"\W+", clean_q) if len(t) >= 2]

        def compute_score(row: pd.Series) -> float:
            pid = str(row["product_id"])
            base_score = scored_ids.get(pid, 0.0)

            name = str(row.get("product_name", "")).lower()
            brand = str(row.get("brand", "")).lower()
            desc = str(row.get("description", "")).lower()
            cat = str(row.get("category_path", "")).lower()
            full_text = f"{name} {brand} {desc} {cat}"

            # Match exato do nome
            if clean_q in name:
                base_score += 4.0
            elif clean_q in full_text:
                base_score += 2.0

            # Match por token
            for t in query_tokens:
                if t in name:
                    base_score += 1.5
                elif t in full_text:
                    base_score += 0.5

            # Expansão semântica de sintomas
            for symptom, targets in symptom_mappings.items():
                if symptom in clean_q:
                    for target in targets:
                        if target in full_text:
                            base_score += 1.8

            # Bonificação para genéricos se o usuário preferir economia
            is_gen = (
                "generico" in name
                or brand in ["ems", "medley", "neo química", "cimed", "eurofarma", "sandoz"]
            )
            if prefer_generics and is_gen:
                base_score += 1.5

            return base_score

        df_candidates["search_score"] = df_candidates.apply(compute_score, axis=1)

        # Filtra pelo orçamento máximo se houver
        if extracted_max_price is not None:
            df_candidates = df_candidates[df_candidates["price"] <= extracted_max_price]

        # Ordena pelos melhores scores
        df_sorted = df_candidates.sort_values(by="search_score", ascending=False)
        matched_records = df_sorted[df_sorted["search_score"] > 0.1].head(limite).to_dict(orient="records")

        # Se nenhum pontuou alto, retorna os mais próximos do RAG
        if not matched_records and not df_sorted.empty:
            matched_records = df_sorted.head(limite).to_dict(orient="records")

        return matched_records
