"""Rotas do Carrinho de Compras com Adição, Atualização e Remoção Sincronizadas."""
from fastapi import APIRouter, Depends, HTTPException, Query

from app.repositories.cart_repo import CartRepository
from app.repositories.product_repo import ProductRepository
from app.schemas.models import CartItemIn, CartItemUpdateIn, CartResponse

router = APIRouter(prefix="/cart", tags=["cart"])


def get_cart() -> CartRepository:
    from app.main import _cart_repo
    return _cart_repo


def get_products() -> ProductRepository:
    from app.main import _product_repo
    return _product_repo


@router.post("/items", response_model=CartResponse)
def adicionar(
    item: CartItemIn,
    cart: CartRepository = Depends(get_cart),
    products: ProductRepository = Depends(get_products),
):
    prod = products.get_by_id(item.product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    if not prod.get("is_available", True):
        raise HTTPException(status_code=400, detail="Produto indisponível")
    if prod.get("is_prescription", False):
        raise HTTPException(
            status_code=403,
            detail="Produto exige receita médica e não pode ser vendido por este canal",
        )
    return cart.add_item(
        session_id=item.session_id,
        product_id=str(prod["product_id"]),
        nome=prod["product_name"],
        preco=float(prod["price"]),
        quantidade=item.quantidade,
    )


@router.put("/items/{product_id}", response_model=CartResponse)
def atualizar_quantidade(
    product_id: str,
    payload: CartItemUpdateIn,
    cart: CartRepository = Depends(get_cart),
):
    """Atualiza a quantidade de um item no carrinho ou remove se quantidade == 0."""
    try:
        return cart.update_quantity(
            session_id=payload.session_id,
            product_id=str(product_id),
            quantidade=payload.quantidade,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/items/{product_id}", response_model=CartResponse)
def remover(
    product_id: str,
    session_id: str = Query(..., description="ID da sessão do usuário"),
    cart: CartRepository = Depends(get_cart),
):
    """Remove um item específico do carrinho da sessão."""
    return cart.remove_item(session_id=session_id, product_id=str(product_id))


@router.get("", response_model=CartResponse)
def consultar(session_id: str, cart: CartRepository = Depends(get_cart)):
    return cart.get(session_id)
