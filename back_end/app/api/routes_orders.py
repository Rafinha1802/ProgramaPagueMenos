"""Rotas de Histórico de Pedidos e Compras Protegidas."""
from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query

from app.repositories.order_repo import OrderRepository
from app.repositories.user_repo import UserRepository
from app.schemas.models import OrderOut

router = APIRouter(prefix="/orders", tags=["orders"])


def get_order_repo() -> OrderRepository:
    from app.main import _order_repo
    if _order_repo is None:
        raise HTTPException(status_code=503, detail="Repositório de pedidos não inicializado")
    return _order_repo


def get_user_repo() -> UserRepository:
    from app.main import _user_repo
    if _user_repo is None:
        raise HTTPException(status_code=503, detail="Repositório de usuários não inicializado")
    return _user_repo


@router.get("", response_model=List[OrderOut])
def list_orders(
    user_id: Optional[str] = Query(None, description="Filtro opcional legado (exige token correspondente)"),
    session_id: Optional[str] = Query(None, description="Filtro de sessão anônima"),
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_auth_token: Optional[str] = Header(None, alias="X-Auth-Token"),
    user_repo: UserRepository = Depends(get_user_repo),
    repo: OrderRepository = Depends(get_order_repo),
):
    """Lista histórico de pedidos com autenticação obrigatória para pedidos de usuários."""
    token = authorization or x_auth_token
    auth_user = user_repo.get_user_by_token(token) if token else None

    # Se um user_id foi solicitado explicitamente
    if user_id:
        if not auth_user or auth_user["id"] != user_id:
            raise HTTPException(
                status_code=401 if not auth_user else 403,
                detail="Acesso não autorizado. Para consultar pedidos de usuários é obrigatório enviar o cabeçalho 'Authorization: Bearer <token>' do próprio titular.",
            )
        orders = repo.list_orders(user_id=auth_user["id"])
        return [OrderOut(**o) for o in orders]


    # Se o usuário está autenticado com token (sem passar user_id na query)
    if auth_user:
        orders = repo.list_orders(user_id=auth_user["id"])
        return [OrderOut(**o) for o in orders]

    # Se for uma sessão anônima
    if session_id:
        orders = repo.list_orders(session_id=session_id)
        return [OrderOut(**o) for o in orders]

    return []



@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: str,
    session_id: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_auth_token: Optional[str] = Header(None, alias="X-Auth-Token"),
    user_repo: UserRepository = Depends(get_user_repo),
    repo: OrderRepository = Depends(get_order_repo),
):
    """Retorna detalhes de um pedido específico com controle estrito de permissão."""
    token = authorization or x_auth_token
    auth_user = user_repo.get_user_by_token(token) if token else None
    uid = auth_user["id"] if auth_user else None

    order = repo.get_by_id(order_id, user_id=uid, session_id=session_id)
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Pedido não encontrado ou você não possui permissão para visualizá-lo.",
        )
    return OrderOut(**order)
