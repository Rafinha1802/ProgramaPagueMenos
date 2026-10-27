"""Testes do motor de busca — provam relevância mínima."""
import pytest
from app.core.rag_engine import RAGEngine
from app.repositories.product_repo import ProductRepository
from app.config import get_settings


@pytest.fixture(scope="module")
def rag():
    s = get_settings()
    repo = ProductRepository(s.catalog_path)
    return RAGEngine(repo.get_dataframe(), backend="tfidf")


def test_busca_soro(rag):
    top = rag.busca_vetorial("soro fisiológico", top_k=3)
    assert any("soro" in n.lower() for n in top["product_name"])


def test_score_decrescente(rag):
    top = rag.busca_vetorial("dipirona", top_k=5)
    assert list(top["score"]) == sorted(top["score"], reverse=True)
