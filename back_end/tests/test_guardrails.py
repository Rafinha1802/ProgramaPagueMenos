"""Testes da camada 1, 2, 3 — provam que o guardrail funciona."""
from app.core.guardrails import camada_1_intencao, camada_2_conteudo, camada_3_estoque


def test_bloqueia_diagnostico():
    assert camada_1_intencao("o que eu tenho se minha garganta dói")["safe"] is False


def test_bloqueia_dosagem():
    assert camada_1_intencao("quantas gotas de dipirona para bebê")["safe"] is False


def test_bloqueia_prescricao():
    assert camada_1_intencao("me receite um antibiótico")["safe"] is False


def test_libera_busca_produto():
    assert camada_1_intencao("soro fisiológico")["safe"] is True


def test_bloqueia_produto_receita():
    assert camada_2_conteudo({"is_prescription": True})["safe"] is False


def test_libera_produto_sem_receita():
    assert camada_2_conteudo({"is_prescription": False})["safe"] is True


def test_bloqueia_sem_estoque():
    assert camada_3_estoque({"is_available": False})["safe"] is False


def test_libera_com_estoque():
    assert camada_3_estoque({"is_available": True})["safe"] is True
