"""Testes completos de autenticação segura, isolamento de pedidos, validações de carrinho e privacidade de receitas."""
import base64
import json
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

from app.api import routes_auth, routes_camera, routes_cart, routes_checkout, routes_orders
from app.main import app, get_main_camera_repo, get_main_user_repo, get_uploads_dir
from app.repositories.camera_repo import CameraRepository
from app.repositories.cart_repo import CartRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.user_repo import UserRepository


@pytest.fixture
def test_env(tmp_path):
    """Cria repositórios isolados em diretório temporário para garantir que nenhum teste modifique data/."""
    users_file = tmp_path / "users.json"
    orders_file = tmp_path / "orders.json"
    captures_file = tmp_path / "captures.json"
    uploads_dir = tmp_path / "camera_uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)

    user_repo = UserRepository(str(users_file))
    order_repo = OrderRepository(str(orders_file))
    camera_repo = CameraRepository(str(captures_file), str(uploads_dir))
    cart_repo = CartRepository()

    # Sobrescreve as injeções de dependência do FastAPI
    app.dependency_overrides[routes_auth.get_user_repo] = lambda: user_repo
    app.dependency_overrides[routes_camera.get_camera_repo] = lambda: camera_repo
    app.dependency_overrides[routes_camera.get_user_repo] = lambda: user_repo
    app.dependency_overrides[routes_checkout.get_cart] = lambda: cart_repo
    app.dependency_overrides[routes_checkout.get_order_repo] = lambda: order_repo
    app.dependency_overrides[routes_checkout.get_user_repo] = lambda: user_repo
    app.dependency_overrides[routes_orders.get_order_repo] = lambda: order_repo
    app.dependency_overrides[routes_orders.get_user_repo] = lambda: user_repo
    app.dependency_overrides[routes_cart.get_cart] = lambda: cart_repo
    app.dependency_overrides[get_main_user_repo] = lambda: user_repo
    app.dependency_overrides[get_main_camera_repo] = lambda: camera_repo
    app.dependency_overrides[get_uploads_dir] = lambda: uploads_dir

    with TestClient(app) as client:
        yield {
            "client": client,
            "user_repo": user_repo,
            "order_repo": order_repo,
            "camera_repo": camera_repo,
            "cart_repo": cart_repo,
            "uploads_dir": uploads_dir,
            "tmp_path": tmp_path,
        }

    app.dependency_overrides.clear()


def test_health_check(test_env):
    client = test_env["client"]
    r = client.get("/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["catalog_loaded"] is True


def test_products_route_not_blocked_by_static_mount(test_env):
    """Garante que GET /products/{id} funciona e não é capturado pelo mount estático."""
    client = test_env["client"]

    # 1. Busca primeiro produto válido no catálogo
    r_list = client.get("/products", params={"limite": 1})
    assert r_list.status_code == 200
    prods = r_list.json()
    assert len(prods) > 0
    valid_id = str(prods[0]["product_id"])

    # 2. GET /products/{id} deve retornar 200 com os dados do produto (e não 404 de static files)
    r = client.get(f"/products/{valid_id}")
    assert r.status_code == 200
    item = r.json()
    assert str(item["product_id"]) == valid_id
    assert "nome" in item

    # 3. Produto inexistente retorna 404
    r_not_found = client.get("/products/99999999999")
    assert r_not_found.status_code == 404


def test_auth_security_and_login_protection(test_env):
    client = test_env["client"]
    user_repo = test_env["user_repo"]

    # 1. Tentativa de login sem senha ou com senha vazia deve falhar
    r = client.post("/auth/login", json={"identifier": "rafaella.guedes@email.com", "password": ""})
    assert r.status_code in (200, 422)
    if r.status_code == 200:
        assert r.json()["success"] is False

    # 2. Senha incorreta deve ser rejeitada
    r = client.post("/auth/login", json={"identifier": "rafaella.guedes@email.com", "password": "SenhaErrada@123"})
    assert r.status_code == 200
    assert r.json()["success"] is False

    # 3. Login com senha padrão PBKDF2 deve suceder e emitir token seguro
    r = client.post("/auth/login", json={"identifier": "rafaella.guedes@email.com", "password": "PagueMenos@2026"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert "user" in data
    token = data["user"]["token"]
    assert token and len(token) >= 32  # token_urlsafe(32)

    # 4. Rota pública /auth/users NÃO deve existir (não deve vazar CPFs)
    r = client.get("/auth/users")
    assert r.status_code in (404, 405)

    # 5. /auth/me sem token deve retornar 401
    r = client.get("/auth/me")
    assert r.status_code == 401

    # 6. /auth/me com token via query param (?token=) deve ser rejeitado (401) para não vazar em logs
    r = client.get(f"/auth/me?token={token}")
    assert r.status_code == 401

    # 7. /auth/me com token no cabeçalho Authorization: Bearer deve funcionar
    headers = {"Authorization": f"Bearer {token}"}
    r = client.get("/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["email"] == "rafaella.guedes@email.com"

    # 8. /auth/profile atualiza dados do próprio usuário autenticado
    r = client.put(
        "/auth/profile",
        headers=headers,
        json={"phone": "(11) 99999-8888", "address": "Av. Brasil, 500"},
    )
    assert r.status_code == 200
    assert r.json()["phone"] == "(11) 99999-8888"

    # 9. Cadastro de novo usuário armazena hash PBKDF2 (nunca senha em texto puro)
    new_user_payload = {
        "name": "Maria Silva",
        "email": "maria.silva@exemplo.com",
        "cpf": "123.456.789-00",
        "phone": "(85) 98888-7777",
        "password": "SenhaSegura@2026",
    }
    r = client.post("/auth/register", json=new_user_payload)
    assert r.status_code == 200
    assert r.json()["success"] is True

    # Verifica no arquivo físico do storage que a senha NÃO está em texto puro
    with open(user_repo.path, "r", encoding="utf-8") as f:
        saved_users = json.load(f)
    maria = next((u for u in saved_users if u["email"] == "maria.silva@exemplo.com"), None)
    assert maria is not None
    assert "password" not in maria
    assert maria["password_hash"].startswith("pbkdf2_sha256:")

    # 10. Logout invalida o token
    r = client.post("/auth/logout", headers=headers)
    assert r.status_code == 200
    r = client.get("/auth/me", headers=headers)
    assert r.status_code == 401


def test_cart_limits_and_sync(test_env):
    client = test_env["client"]

    # 1. Obter um produto válido do catálogo
    r = client.get("/products", params={"limite": 1, "apenas_disponiveis": True})
    assert r.status_code == 200
    products = r.json()
    assert len(products) > 0
    pid = products[0]["product_id"]

    sess_id = "cart_test_sess_01"

    # 2. Adicionar item com quantidade inválida (> 99) deve falhar validação (422)
    r = client.post("/cart/items", json={"session_id": sess_id, "product_id": pid, "quantidade": 150})
    assert r.status_code == 422

    # 3. Adicionar item com quantidade 0 deve falhar (422)
    r = client.post("/cart/items", json={"session_id": sess_id, "product_id": pid, "quantidade": 0})
    assert r.status_code == 422

    # 4. Adicionar item válido
    r = client.post("/cart/items", json={"session_id": sess_id, "product_id": pid, "quantidade": 2})
    assert r.status_code == 200
    cart_data = r.json()
    assert len(cart_data["itens"]) == 1
    assert cart_data["itens"][0]["quantidade"] == 2

    # 5. Atualizar quantidade de produto que NÃO está no carrinho deve retornar 404
    r = client.put(
        "/cart/items/99999999",
        json={"session_id": sess_id, "quantidade": 3},
    )
    assert r.status_code == 404

    # 6. Atualizar quantidade do produto existente para 5
    r = client.put(
        f"/cart/items/{pid}",
        json={"session_id": sess_id, "quantidade": 5},
    )
    assert r.status_code == 200
    assert r.json()["itens"][0]["quantidade"] == 5

    # 7. Remover item do carrinho
    r = client.delete(f"/cart/items/{pid}", params={"session_id": sess_id})
    assert r.status_code == 200
    assert len(r.json()["itens"]) == 0
    assert r.json()["total"] == 0.0


def test_order_isolation_and_data_coherence(test_env):
    client = test_env["client"]
    order_repo = test_env["order_repo"]

    # 1. Coerência dos pedidos seed
    orders = order_repo.list_orders(user_id="user_1")
    assert len(orders) >= 2

    # Pedido FV-98421: matemática coerente (total = subtotal - desconto)
    fv_98421 = next((o for o in orders if o["id"] == "FV-98421"), None)
    assert fv_98421 is not None
    calculated_subtotal = sum(i["price"] * i["quantity"] for i in fv_98421["items"])
    assert round(calculated_subtotal, 2) == round(fv_98421["subtotal"], 2)
    assert round(fv_98421["total"], 2) == round(fv_98421["subtotal"] - fv_98421["discount"] + fv_98421["freight"], 2)

    # Pedido FV-84192: preço unitário do Secret Clinical R$ 14.99
    fv_84192 = next((o for o in orders if o["id"] == "FV-84192"), None)
    assert fv_84192 is not None
    secret_item = next(i for i in fv_84192["items"] if "Secret" in i["name"])
    assert round(secret_item["price"], 2) == 14.99

    # 2. Isolamento de pedidos: busca anônima sem filtros deve retornar lista vazia
    r = client.get("/orders")
    assert r.status_code == 200
    assert r.json() == []

    # 3. GET /orders?user_id=user_1 SEM token deve falhar com 401 (não vaza pedidos de terceiros)
    r_unauth = client.get("/orders", params={"user_id": "user_1"})
    assert r_unauth.status_code in (401, 403)

    # 4. GET /orders/{order_id} de usuário sem token retorna 404/401 (não expõe dados do pedido)
    r_order_unauth = client.get("/orders/FV-98421")
    assert r_order_unauth.status_code in (401, 404)

    # 5. GET /orders/{order_id} com token do titular autenticado tem sucesso
    login_res = client.post("/auth/login", json={"identifier": "rafaella.guedes@email.com", "password": "PagueMenos@2026"})
    token = login_res.json()["user"]["token"]
    headers = {"Authorization": f"Bearer {token}"}

    r_auth_order = client.get("/orders/FV-98421", headers=headers)
    assert r_auth_order.status_code == 200
    assert r_auth_order.json()["id"] == "FV-98421"

    # 6. Checkout anônimo NÃO vincula ao user_1
    r_prods = client.get("/products", params={"limite": 1, "apenas_disponiveis": True})
    pid = r_prods.json()[0]["product_id"]
    anon_session = "anon_checkout_session"
    client.post("/cart/items", json={"session_id": anon_session, "product_id": pid, "quantidade": 1})

    r = client.post("/checkout", json={"session_id": anon_session})
    assert r.status_code == 200
    checkout_data = r.json()
    assert checkout_data["pedido"]["user_id"] is None  # Não foi associado a user_1!


def test_camera_prescription_privacy_and_role_validation(test_env):
    client = test_env["client"]
    uploads_dir = test_env["uploads_dir"]
    camera_repo = test_env["camera_repo"]

    # 1. /camera/captures sem parâmetros retorna lista vazia (não vaza receitas)
    r = client.get("/camera/captures")
    assert r.status_code == 200
    assert r.json() == []

    # 2. GET /camera/captures?user_id=user_1 SEM token retorna 401/403
    r = client.get("/camera/captures", params={"user_id": "user_1"})
    assert r.status_code in (401, 403)

    # 3. GET /camera/prescriptions?user_id=user_1 SEM token retorna 401/403
    r = client.get("/camera/prescriptions", params={"user_id": "user_1"})
    assert r.status_code in (401, 403)

    # 4. DELETE /camera/captures/cap_presc_01 SEM token ou sessão retorna 401
    r = client.delete("/camera/captures/cap_presc_01")
    assert r.status_code == 401

    # 5. Salva captura vinculada ao user_1
    sample_filename = "receita_user1_confidencial.jpg"
    secret_file = uploads_dir / sample_filename
    secret_file.write_bytes(b"IMAGEM_RECEITA_MEDICA_CRF_SIGILOSO")

    camera_repo.save_capture({
        "id": "cap_user1_test",
        "user_id": "user_1",
        "name": sample_filename,
        "preview_url": f"/static/uploads/{sample_filename}",
        "type": "prescription",
        "requires_prescription": True,
    })

    # 6. Tentativa de download sem token retorna 401
    r = client.get(f"/static/uploads/{sample_filename}")
    assert r.status_code == 401

    # 7. Usuário 2 (não titular) tentando baixar arquivo do user_1 deve receber 403 Forbidden!
    r_reg = client.post("/auth/register", json={
        "name": "Outro Paciente",
        "email": "outro.paciente@exemplo.com",
        "cpf": "999.888.777-66",
        "password": "SenhaSegura@2026",
    })
    token_user2 = r_reg.json()["user"]["token"]
    headers_user2 = {"Authorization": f"Bearer {token_user2}"}

    r_forbidden = client.get(f"/static/uploads/{sample_filename}", headers=headers_user2)
    assert r_forbidden.status_code == 403

    # 8. Usuário 1 (titular) baixando o próprio arquivo tem sucesso (200)
    login_user1 = client.post("/auth/login", json={"identifier": "rafaella.guedes@email.com", "password": "PagueMenos@2026"})
    token_user1 = login_user1.json()["user"]["token"]
    headers_user1 = {"Authorization": f"Bearer {token_user1}"}

    r_owner = client.get(f"/static/uploads/{sample_filename}", headers=headers_user1)
    assert r_owner.status_code == 200
    assert r_owner.content == b"IMAGEM_RECEITA_MEDICA_CRF_SIGILOSO"

    # 9. Farmacêutico baixando arquivo de qualquer paciente tem sucesso para conferência
    login_pharm = client.post("/auth/login", json={"identifier": "farmaceutico@paguemenos.com.br", "password": "PagueMenos@2026"})
    token_pharm = login_pharm.json()["user"]["token"]
    headers_pharm = {"Authorization": f"Bearer {token_pharm}"}

    r_pharm_dl = client.get(f"/static/uploads/{sample_filename}", headers=headers_pharm)
    assert r_pharm_dl.status_code == 200

    # 10. Validação de receita:
    # 10a. Sem autenticação -> 401
    r_val_unauth = client.post("/camera/captures/cap_presc_01/validate")
    assert r_val_unauth.status_code == 401

    # 10b. Usuário comum tentando validar receita -> 403 Forbidden!
    r_val_cust = client.post("/camera/captures/cap_presc_01/validate", headers=headers_user1)
    assert r_val_cust.status_code == 403

    # 10c. Farmacêutico autenticado valida a receita com sucesso -> 200
    r_val_ok = client.post("/camera/captures/cap_presc_01/validate", headers=headers_pharm)
    assert r_val_ok.status_code == 200
    val_data = r_val_ok.json()
    assert val_data["success"] is True
    assert val_data["capture"]["status"] == "validado"
    assert "CRF" in (val_data["capture"]["crf"] or "")
