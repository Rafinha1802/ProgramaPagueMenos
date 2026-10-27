"""POST /chat — orquestrador protegido por guardrails."""
from fastapi import APIRouter, Depends, HTTPException

from app.schemas.models import ChatRequest, ChatResponse
from app.services.orchestrator import OrquestradorIA

router = APIRouter(prefix="/chat", tags=["chat"])


def get_orquestrador() -> OrquestradorIA:
    from app.main import _orquestrador
    if _orquestrador is None:
        raise HTTPException(status_code=503, detail="Orquestrador não inicializado")
    return _orquestrador


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest, orq: OrquestradorIA = Depends(get_orquestrador)):
    try:
        return orq.processar(req.session_id, req.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no orquestrador: {e}")
