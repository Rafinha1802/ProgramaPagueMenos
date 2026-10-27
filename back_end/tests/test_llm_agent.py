"""Testes da camada 4 — validação anti-alucinação do LLM."""
import pytest
from app.core.llm_agent import SafeLLMAgent


PRODUTOS = [
    {
        "product_id": "46533",
        "product_name": "Soro Fisiológico 500ml",
        "brand": "Dauf",
        "price": 8.99,
        "is_available": True,
        "is_prescription": False,
    }
]


@pytest.fixture
def validador():
    return SafeLLMAgent(enabled=False)


def test_aceita_resposta_honesta(validador):
    resposta = {
        "mensagem": "Encontrei o soro fisiológico por R$ 8,99.",
        "produtos_recomendados": ["46533"],
    }
    assert validador._validate(resposta, PRODUTOS) is True


def test_rejeita_preco_alucinado(validador):
    resposta = {
        "mensagem": "Promoção! R$ 1,99!",
        "produtos_recomendados": ["46533"],
    }
    assert validador._validate(resposta, PRODUTOS) is False


def test_rejeita_id_inventado(validador):
    resposta = {
        "mensagem": "Recomendo o produto.",
        "produtos_recomendados": ["ID-9999"],
    }
    assert validador._validate(resposta, PRODUTOS) is False


def test_rejeita_dosagem(validador):
    resposta = {
        "mensagem": "Tome 3 comprimidos ao dia. A dosagem é essa.",
        "produtos_recomendados": ["46533"],
    }
    assert validador._validate(resposta, PRODUTOS) is False


def test_fallback_quando_llm_desligado():
    llm = SafeLLMAgent(enabled=False)
    out = llm.responder("soro", PRODUTOS)
    assert out["fallback"] is True
    assert out["motivo_fallback"] == "llm_desligado"
    assert out["produtos_recomendados"] == ["46533"]
