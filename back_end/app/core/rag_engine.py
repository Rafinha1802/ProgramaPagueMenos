"""Motor de busca vetorial com fallback TF-IDF.

Carrega embeddings uma vez e expõe `busca_vetorial(query, k)`.
Se sentence-transformers não puder ser baixado, cai para TF-IDF
sem quebrar o servidor.
"""
import logging
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


class RAGEngine:
    def __init__(self, df: pd.DataFrame, backend: str = "auto", model_name: str = "all-MiniLM-L6-v2"):
        self.df = df.reset_index(drop=True)
        self.backend = backend
        self.model_name = model_name
        self.embedder = None
        self.vectors: Optional[np.ndarray] = None
        self._build()

    # ----------------------------------------------------------
    def _build(self):
        if self.backend in ("auto", "sentence"):
            try:
                from sentence_transformers import SentenceTransformer
                self.embedder = SentenceTransformer(self.model_name)
                self.vectors = self.embedder.encode(
                    self.df["text_for_embedding"].tolist(),
                    normalize_embeddings=True,
                    show_progress_bar=False,
                )
                self.backend = f"sentence-transformers/{self.model_name}"
                logger.info(f"RAG pronto com {self.backend} | shape={self.vectors.shape}")
                return
            except Exception as e:
                if self.backend == "sentence":
                    raise
                logger.warning(f"sentence-transformers indisponível ({e}). Caindo para TF-IDF.")

        # fallback TF-IDF
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.embedder = TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_features=5000)
        self.vectors = self.embedder.fit_transform(
            self.df["text_for_embedding"].tolist()
        ).toarray()
        self.backend = "tfidf-sklearn"
        logger.info(f"RAG pronto com {self.backend} | shape={self.vectors.shape}")

    # ----------------------------------------------------------
    def _embed_query(self, query: str) -> np.ndarray:
        if self.backend.startswith("sentence"):
            return self.embedder.encode([query], normalize_embeddings=True)[0]
        return self.embedder.transform([query]).toarray()[0]

    def busca_vetorial(self, query: str, top_k: int = 10) -> pd.DataFrame:
        """Retorna DataFrame com coluna 'score' (cosseno)."""
        q = self._embed_query(query)
        qn = q / (np.linalg.norm(q) + 1e-12)
        cn = self.vectors / (np.linalg.norm(self.vectors, axis=1, keepdims=True) + 1e-12)
        sims = cn @ qn
        idx = np.argsort(-sims)[:top_k]
        out = self.df.iloc[idx].copy()
        out["score"] = sims[idx].round(4)
        return out

    # ----------------------------------------------------------
    def info(self) -> Dict[str, Any]:
        return {
            "backend": self.backend,
            "n_documentos": int(len(self.df)),
            "dimensao_vetor": int(self.vectors.shape[1]) if self.vectors is not None else 0,
        }
