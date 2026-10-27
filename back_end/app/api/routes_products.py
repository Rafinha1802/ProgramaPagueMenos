"""GET /products — catálogo com filtros, busca por lote de IDs e Pesquisa Semântica com IA."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.repositories.product_repo import ProductRepository
from app.schemas.models import ProdutoRecomendado

router = APIRouter(prefix="/products", tags=["products"])


def get_repo() -> ProductRepository:
    from app.main import _product_repo
    if _product_repo is None:
        raise HTTPException(status_code=503, detail="Catálogo não carregado")
    return _product_repo


def get_rag():
    from app.main import _rag
    return _rag


@router.get("/search", response_model=List[ProdutoRecomendado])
def search_products(
    q: Optional[str] = Query(None, description="Consulta em linguagem natural, sintoma ou medicamento"),
    busca: Optional[str] = Query(None),
    categoria: Optional[str] = None,
    apenas_disponiveis: bool = True,
    limite: int = Query(50, ge=1, le=200),
    prefer_generics: bool = Query(False),
    max_price: Optional[float] = Query(None),
    repo: ProductRepository = Depends(get_repo),
    rag=Depends(get_rag),
):
    """Busca Semântica Farmacêutica com IA (RAG vetorial + similaridade de sintomas)."""
    query_text = (q or busca or "").strip()
    rows = repo.search_semantic(
        query=query_text,
        rag_engine=rag,
        categoria=categoria,
        apenas_disponiveis=apenas_disponiveis,
        limite=limite,
        prefer_generics=prefer_generics,
        max_price=max_price,
    )
    return [
        ProdutoRecomendado(
            product_id=str(r["product_id"]),
            nome=r["product_name"],
            marca=r.get("brand", "Pague Menos"),
            preco=float(r["price"]),
            disponivel=bool(r.get("is_available", True)),
            categoria=r.get("category_path", ""),
            motivo_recomendacao=(
                "Genérico com máxima economia e eficácia ANVISA."
                if ("generico" in r.get("product_name", "").lower() or r.get("brand", "").lower() in ["ems", "medley", "neo química", "cimed"])
                else "Produto selecionado com base na sua busca."
            ),
            is_prescription=bool(r.get("is_prescription", False)),
        )
        for r in rows
    ]


@router.get("", response_model=List[ProdutoRecomendado])
def listar(
    categoria: Optional[str] = None,
    apenas_disponiveis: bool = True,
    limite: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    ids: Optional[str] = Query(None, description="Lista de IDs separados por vírgula (ex: 57259,183582,138889)"),
    q: Optional[str] = Query(None, description="Termo de busca opcional"),
    busca: Optional[str] = Query(None, description="Termo de busca opcional"),
    repo: ProductRepository = Depends(get_repo),
    rag=Depends(get_rag),
):
    query_text = (q or busca or "").strip()
    # Se houver busca informada, usa a busca semântica com IA
    if query_text:
        rows = repo.search_semantic(
            query=query_text,
            rag_engine=rag,
            categoria=categoria,
            apenas_disponiveis=apenas_disponiveis,
            limite=limite,
        )
    else:
        id_list = [i.strip() for i in ids.split(",") if i.strip()] if ids else None
        rows = repo.list(
            categoria=categoria,
            apenas_disponiveis=apenas_disponiveis,
            limite=limite,
            offset=offset,
            ids=id_list,
        )

    return [
        ProdutoRecomendado(
            product_id=str(r["product_id"]),
            nome=r["product_name"],
            marca=r.get("brand", "Pague Menos"),
            preco=float(r["price"]),
            disponivel=bool(r.get("is_available", True)),
            categoria=r.get("category_path", ""),
            motivo_recomendacao="Produto disponível e sem exigência de receita.",
            is_prescription=bool(r.get("is_prescription", False)),
        )
        for r in rows
    ]


@router.get("/{product_id}", response_model=ProdutoRecomendado)
def detalhe(product_id: str, repo: ProductRepository = Depends(get_repo)):
    r = repo.get_by_id(product_id)
    if not r:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return ProdutoRecomendado(
        product_id=str(r["product_id"]),
        nome=r["product_name"],
        marca=r.get("brand", "Pague Menos"),
        preco=float(r["price"]),
        disponivel=bool(r.get("is_available", True)),
        categoria=r.get("category_path", ""),
        is_prescription=bool(r.get("is_prescription", False)),
    )
