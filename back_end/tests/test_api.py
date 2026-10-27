"""Testes de contrato HTTP."""
import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    from app.main import app
    with TestClient(app) as c:
        yield c


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_chat_bloqueio_intencao(client):
    r = client.post("/chat", json={"session_id": "t1", "message": "me receite um antibiótico"})
    assert r.status_code == 200
    body = r.json()
    assert body["tipo"] == "bloqueio_intencao"
    assert "ANVISA" in body["mensagem"].upper() or "regulatório" in body["mensagem"].lower()


def test_chat_busca_segura(client):
    r = client.post("/chat", json={"session_id": "t2", "message": "soro fisiológico"})
    assert r.status_code == 200
    body = r.json()
    assert body["tipo"] in ("produto", "sem_produto_seguro")


def test_cart_e_checkout(client):
    # busca um produto qualquer disponível
    r = client.get("/products", params={"limite": 1, "apenas_disponiveis": True})
    assert r.status_code == 200
    if not r.json():
        pytest.skip("Sem produto disponível no catálogo de teste")
    pid = r.json()[0]["product_id"]

    r = client.post("/cart/items", json={"session_id": "t3", "product_id": pid, "quantidade": 1})
    assert r.status_code == 200

    r = client.post("/checkout", json={"session_id": "t3"})
    assert r.status_code == 200
    assert r.json()["status"] == "simulado_aprovado"
