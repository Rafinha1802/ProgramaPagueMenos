"""POST /checkout — simulação de pagamento e criação de pedido registrado."""
import re
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException

from app.repositories.cart_repo import CartRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.user_repo import UserRepository
from app.schemas.models import CheckoutRequest, CheckoutResponse, OrderItem, OrderOut

router = APIRouter(prefix="/checkout", tags=["checkout"])


def get_cart() -> CartRepository:
    from app.main import _cart_repo
    return _cart_repo


def get_order_repo() -> OrderRepository:
    from app.main import _order_repo
    return _order_repo


def get_products() -> ProductRepository:
    from app.main import _product_repo
    return _product_repo


def get_user_repo() -> UserRepository:
    from app.main import _user_repo
    return _user_repo


def get_optional_user(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    user_repo: UserRepository = Depends(get_user_repo),
) -> Optional[dict]:
    if authorization:
        return user_repo.get_user_by_token(authorization)
    return None


def resolve_product_image_url(name: str, brand: str = "") -> str:
    """Mapeia produto para imagem oficial existente ou placeholder neutro usando regex seguro."""
    text = f"{name} {brand}".lower()

    # 1. Buscopan
    if re.search(r"\bbuscopan\b", text):
        return "/products/buscopan.jpg"

    # 2. Nivea
    if re.search(r"\bnivea\b", text):
        if re.search(r"\b(sun|protetor|solar|bronzeador)\b", text):
            if re.search(r"\b(fps\s*50|50\s*fps|fps50|\b50\b)", text) and not re.search(r"\b150\b|\b150g\b|\b250\b", text):
                return "/products/nivea-sun-fps50.jpg"
            return "/products/nivea-sun.jpg"
        if re.search(r"\b(men|deep|barba)\b", text):
            return "/products/nivea-men.jpg"

    # 3. Neutrogena
    if re.search(r"\bneutrogena\b", text):
        if re.search(r"\bkit\b", text):
            return "/products/neutrogena-kit.png"
        if re.search(r"\b(facial|matte|oleosa)\b", text):
            return "/products/neutrogena-sunfresh-facial.png"
        if re.search(r"\bfps\s*90\b|\b90\s*fps\b", text) or (re.search(r"\b90\b", text) and not re.search(r"\b90g\b|\b90ml\b", text)):
            return "/products/neutrogena-sunfresh-fps90.png"
        if re.search(r"\bfps\s*60\b|\b60\s*fps\b", text) or (re.search(r"\b60\b", text) and not re.search(r"\b60g\b|\b60ml\b", text)):
            return "/products/neutrogena-sunfresh-fps60.png"
        if re.search(r"\b(sun|sunfresh|protetor)\b", text):
            return "/products/neutrogena-sunfresh-fps70.png"

    # 4. Pantene
    if re.search(r"\bpantene\b", text):
        return "/products/pantene-kit.jpg"

    # 5. Dauf
    if re.search(r"\bdauf\b", text):
        if re.search(r"\b(soro|fisiol|solu)\b", text):
            return "/products/soro-dauf.jpg"
        if re.search(r"\b(labial|labios|protetor labial)\b", text):
            return "/products/protetor-labial-dauf.jpg"

    # 6. Medicamentos e dermocosméticos específicos
    if re.search(r"\bdorflex\b", text):
        return "/products/dorflex.jpg"
    if re.search(r"\bdipirona\b", text) and re.search(r"\bems\b", text):
        return "/products/dipirona-ems.jpg"
    if re.search(r"\bbenegrip\b", text):
        return "/products/benegrip.jpg"
    if re.search(r"\bneosaldina\b", text):
        return "/products/neosaldina.jpg"
    if re.search(r"\bsecret\b", text) and re.search(r"\b(clinical|desodorante|antitranspirante)\b", text):
        return "/products/secret-clinical.jpg"
    if re.search(r"\bcerave\b", text):
        return "/products/cerave.jpg"
    if re.search(r"\b(darrow|actine)\b", text):
        return "/products/darrow-actine.jpg"
    if re.search(r"\baptanutri\b", text):
        return "/products/aptanutri.jpg"
    if re.search(r"\bcewin\b", text) or (re.search(r"\bvitamina\s*c\b", text) and re.search(r"\bpague\s*menos\b", text)):
        return "/products/vitamina-c-pm.jpg"
    if re.search(r"\bozempic\b", text):
        return "/products/ozempic.jpg"

    return "/products/neutral-product-placeholder.svg"


@router.post("", response_model=CheckoutResponse)
def finalizar(
    req: CheckoutRequest,
    cart: CartRepository = Depends(get_cart),
    order_repo: OrderRepository = Depends(get_order_repo),
    products: ProductRepository = Depends(get_products),
    auth_user: Optional[dict] = Depends(get_optional_user),
):
    import random
    effective_session_id = req.session_id or "default_session"
    effective_user_id = auth_user["id"] if auth_user else (req.user_id if req.user_id else None)

    # 1. Se itens foram enviados diretamente pelo front (checkout de alta fidelidade)
    if req.items and len(req.items) > 0:
        order_items = []
        computed_subtotal = 0.0
        for it in req.items:
            brand = it.brand
            if not brand and products:
                prod_meta = products.get_by_id(str(it.id))
                if prod_meta:
                    brand = prod_meta.get("brand", "")
            img = it.image or resolve_product_image_url(it.name, brand or "")
            qty = max(1, int(it.quantity))
            price = float(it.price)
            order_items.append(
                OrderItem(
                    id=str(it.id),
                    name=it.name,
                    brand=brand,
                    quantity=qty,
                    price=price,
                    image=img,
                )
            )
            computed_subtotal += price * qty

        final_total = req.total if req.total is not None else computed_subtotal
        final_subtotal = req.subtotal if req.subtotal is not None else computed_subtotal
        final_discount = req.discount if req.discount is not None else (req.savings or 0.0)
        pedido_id = f"FV-{random.randint(100000, 999999)}"

        # Limpa o carrinho da sessão se houver
        if cart and req.session_id:
            cart.clear(req.session_id)
    else:
        # 2. Fallback para itens registrados no CartRepository em memória
        try:
            out = cart.checkout(effective_session_id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        order_items = []
        for item in out.get("itens", []):
            pid = str(item["product_id"])
            prod_meta = products.get_by_id(pid) if products else None
            brand = prod_meta.get("brand", "") if prod_meta else ""
            item_img = resolve_product_image_url(item["nome"], brand)
            order_items.append(
                OrderItem(
                    id=pid,
                    name=item["nome"],
                    brand=brand,
                    quantity=item["quantidade"],
                    price=item["preco"],
                    image=item_img,
                )
            )
        pedido_id = out["pedido_id"]
        final_total = out["total"]
        final_subtotal = out["total"]
        final_discount = 0.0

    now = datetime.now()
    date_str = now.strftime("%d/%m/%Y")
    time_str = now.strftime("%H:%M")

    order_data = {
        "id": pedido_id,
        "session_id": effective_session_id,
        "user_id": effective_user_id,
        "date": date_str,
        "time": time_str,
        "status": "Em Separação",
        "statusColor": "#2563EB",
        "statusBg": "#EFF6FF",
        "deliveryType": req.delivery_type or "Entrega Turbo Express (45 min)",
        "paymentMethod": req.payment_method or "Pix à Vista",
        "address": req.address or "Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP",
        "total": round(final_total, 2),
        "discount": round(final_discount, 2),
        "subtotal": round(final_subtotal, 2),
        "freight": round(req.freight or 0.0, 2),
        "items": [item.model_dump() for item in order_items],
    }

    if order_repo:
        order_repo.create_order(order_data)

    return CheckoutResponse(
        pedido_id=pedido_id,
        status="simulado_aprovado",
        total=round(final_total, 2),
        mensagem="Pedido registrado e aprovado com sucesso no backend da Pague Menos!",
        pedido=OrderOut(**order_data),
    )


