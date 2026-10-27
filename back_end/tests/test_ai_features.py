"""Testes dos recursos de IA Real: Chatbot Dinâmico, Pesquisa Semântica e Visão da Câmera."""
import pytest
from fastapi.testclient import TestClient

from app.schemas.models import CameraAnalyzeIn


@pytest.fixture
def client():
    from app.main import app
    with TestClient(app) as c:
        yield c


def test_camera_analyze_medication(client):
    """Testa análise visual da câmera identificando medicamento e genérico equivalente."""
    payload = {
        "filename": "dorflex_embalagem.jpg",
        "ocr_text": "Dorflex Sanofi analgésico e relaxante muscular 36 comprimidos",
        "intent": "generic"
    }
    r = client.post("/camera/analyze", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["identified"] is True
    assert "Dorflex" in data["detected_medication"] or "Dipirona" in data["detected_medication"]
    assert data["savings_pct"] is not None and data["savings_pct"] > 0
    assert len(data["matched_products"]) > 0


def test_camera_analyze_prescription(client):
    """Testa análise visual da câmera identificando receituário médico oficial."""
    payload = {
        "filename": "receita_digital.jpg",
        "ocr_text": "Receituário Médico Oficial Dr. Fernando Silva CRM/SP 192844 Losartana 50mg 30 comp uso diário",
        "intent": "prescription"
    }
    r = client.post("/camera/analyze", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["identified"] is True
    assert data["requires_prescription"] is True
    assert "CRM" in (data["crm"] or "")
    assert len(data["matched_products"]) > 0


def test_camera_analyze_unrecognized_image(client):
    """Testa foto sem relação farmacêutica — deve retornar identified=False com orientações."""
    payload = {
        "filename": "foto_paisagem.jpg",
        "ocr_text": "árvore no gramado parque público domingo",
        "intent": "generic"
    }
    r = client.post("/camera/analyze", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["identified"] is False
    assert len(data["suggestions"]) > 0


def test_products_search_semantic(client):
    """Testa endpoint GET /products/search por sintoma e linguagem natural."""
    r = client.get("/products/search", params={"q": "dor de cabeça e febre", "limite": 3})
    assert r.status_code == 200
    prods = r.json()
    assert len(prods) > 0
    # Verifica que retornou produtos relevantes (analgésicos / antitérmicos)
    names = " ".join([p["nome"].lower() for p in prods])
    assert any(term in names for term in ["dorflex", "dipirona", "paracetamol", "analgésico", "relaxante"])


def test_products_search_budget_filter(client):
    """Testa busca semântica respeitando teto de preço (orçamento)."""
    r = client.get("/products/search", params={"q": "protetor solar", "max_price": 65.0, "limite": 5})
    assert r.status_code == 200
    prods = r.json()
    assert len(prods) > 0
    for p in prods:
        assert p["preco"] <= 65.0


def test_chatbot_dynamic_response_not_canned(client):
    """Testa se o chatbot gera resposta farmacêutica dinâmica e NÃO a resposta estática pronta."""
    r = client.post("/chat", json={"session_id": "test_ai_session", "message": "estou com sintomas de azia e queimação no estômago"})
    assert r.status_code == 200
    data = r.json()
    assert data["tipo"] == "produto"
    msg = data["mensagem"]
    # Garante que não é apenas a frase pronta antiga
    assert msg != "Encontrei estes produtos disponíveis e sem exigência de receita:"
    assert len(data["produtos"]) > 0
