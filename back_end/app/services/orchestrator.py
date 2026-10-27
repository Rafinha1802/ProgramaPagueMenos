"""Orquestrador: guardrails -> RAG -> LLM -> resposta.

Este é o único ponto que precisa conhecer todas as camadas.
Qualquer mudança em guardrail, RAG ou LLM passa por aqui.
"""
import logging
from typing import Any, Dict

from app.core.guardrails import (
    AVISO_RODAPE,
    camada_1_intencao,
    camada_2_conteudo,
    camada_3_estoque,
    mensagem_bloqueio_intencao,
)
from app.core.llm_agent import SafeLLMAgent
from app.core.rag_engine import RAGEngine

logger = logging.getLogger(__name__)


class OrquestradorIA:
    def __init__(self, rag: RAGEngine, llm: SafeLLMAgent, top_k: int = 10):
        self.rag = rag
        self.llm = llm
        self.top_k = top_k

    # ----------------------------------------------------------
    def processar(self, session_id: str, mensagem: str) -> Dict[str, Any]:
        # CAMADA 1
        c1 = camada_1_intencao(mensagem)
        if not c1["safe"]:
            logger.info(f"[guardrail:1] session={session_id} cat={c1['categoria']}")
            return {
                "tipo": "bloqueio_intencao",
                "mensagem": mensagem_bloqueio_intencao(c1["categoria"], c1["gatilho"]),
                "produtos": [],
                "guardrail_acionado": f"1_{c1['categoria']}",
                "fontes": [],
                "fallback_llm": False,
            }

        # 1.1 Detecção de Saudação / Smalltalk puro (sem solicitação de produtos ou sintomas)
        import re
        cleaned_msg = re.sub(r"[^\w\s]", "", mensagem.lower()).strip()
        words = cleaned_msg.split()
        greeting_words = {
            "ola", "olá", "oi", "oie", "oii", "bom", "dia", "boa", "tarde", "noite",
            "tudo", "bem", "como", "vai", "opa", "eae", "eai", "ajuda", "obrigado", "obrigada",
            "valeu", "quem", "e", "voce", "você", "sofia"
        }
        if words and len(words) <= 5 and all(w in greeting_words for w in words):
            logger.info(f"[orchestrator] Saudacao detectada: '{mensagem}'")
            return {
                "tipo": "saudacao",
                "mensagem": (
                    "Olá! Tudo bem? Seja muito bem-vindo(a) à Pague Menos! 💊\n\n"
                    "Sou a **Dra. Sofia**, sua Farmacêutica Virtual 24h. "
                    "Estou aqui para orientar você com total segurança, tirar dúvidas sobre medicamentos e ajudar a encontrar o melhor tratamento com a máxima economia de genéricos.\n\n"
                    "Como posso te ajudar hoje? Você pode me descrever seus sintomas (ex: *'estou com dor de cabeça e febre'*, *'azia e queimação'*), pedir um medicamento ou tirar dúvidas de saúde!"
                    + AVISO_RODAPE
                ),
                "produtos": [],
                "guardrail_acionado": None,
                "fontes": ["atendimento_farmaceutico"],
                "fallback_llm": False,
            }

        # RAG
        candidatos = self.rag.busca_vetorial(mensagem, top_k=self.top_k)
        seguros = []
        bloqueados_receita = 0
        bloqueados_estoque = 0
        for _, row in candidatos.iterrows():
            p = row.to_dict()
            if not camada_2_conteudo(p)["safe"]:
                bloqueados_receita += 1
                continue
            if not camada_3_estoque(p)["safe"]:
                bloqueados_estoque += 1
                continue
            seguros.append(p)

        if not seguros:
            logger.info(
                f"[rag:info] session={session_id} nenhum produto estritamente seguro/isento encontrado. "
                f"Consultando IA para orientação farmacêutica adequada."
            )
            # Permite que a IA responda dúvidas gerais, orientações de loja ou explique com clareza
            conversa = self.llm.responder(mensagem, [])
            return {
                "tipo": "orientacao_farmaceutica",
                "mensagem": conversa.get("mensagem", "Olá! Para essa necessidade específica ou para medicamentos controlados, recomendo falar diretamente com um de nossos farmacêuticos em loja.") + AVISO_RODAPE,
                "produtos": [],
                "guardrail_acionado": None,
                "fontes": ["catalogo_paguemenos", "anvisa_regras"],
                "fallback_llm": bool(conversa.get("fallback", False)),
            }

        # CAMADA 4 — Resposta do Agente de IA com produtos recuperados
        out = self.llm.responder(mensagem, seguros)
        rec_ids = set(str(pid) for pid in out.get("produtos_recomendados", []))

        # Se a IA não listou explicitamente os IDs, usa os primeiros mais relevantes de 'seguros'
        if not rec_ids:
            rec_ids = {str(p["product_id"]) for p in seguros[:3]}

        produtos_filtrados = [
            {
                "product_id": str(p["product_id"]),
                "nome": p["product_name"],
                "marca": p.get("brand", "Pague Menos"),
                "preco": float(p["price"]),
                "disponivel": bool(p.get("is_available", True)),
                "categoria": p.get("category_path", ""),
                "motivo_recomendacao": (
                    "Genérico com máxima economia e eficácia ANVISA."
                    if ("generico" in p.get("product_name", "").lower() or p.get("brand", "").lower() in ["ems", "medley", "neo química", "cimed"])
                    else "Disponível no catálogo oficial para pronta entrega."
                ),
                "is_prescription": bool(p.get("is_prescription", False)),
            }
            for p in seguros
            if str(p["product_id"]) in rec_ids
        ]

        return {
            "tipo": "produto",
            "mensagem": out["mensagem"] + AVISO_RODAPE,
            "produtos": produtos_filtrados,
            "guardrail_acionado": None,
            "fontes": ["catalogo_paguemenos", "anvisa_regras"],
            "fallback_llm": bool(out.get("fallback", False)),
        }
