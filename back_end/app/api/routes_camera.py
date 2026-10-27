"""Rotas para Armazenamento Seguro de Dados da Câmera, OCR e Receitas Médicas."""
from typing import List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query

import logging

from app.core.vision_service import analyze_camera_payload
from app.repositories.camera_repo import CameraRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.user_repo import UserRepository
from app.schemas.models import (
    CameraAnalyzeIn,
    CameraAnalyzeOut,
    CameraCaptureIn,
    CameraCaptureOut,
    CameraCaptureResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/camera", tags=["camera"])


def get_product_repo() -> Optional[ProductRepository]:
    from app.main import _product_repo
    return _product_repo



def get_camera_repo() -> CameraRepository:
    from app.main import _camera_repo
    if _camera_repo is None:
        raise HTTPException(status_code=503, detail="Repositório de câmera não inicializado")
    return _camera_repo


def get_user_repo() -> UserRepository:
    from app.main import _user_repo
    return _user_repo


def get_optional_user(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_auth_token: Optional[str] = Header(None, alias="X-Auth-Token"),
    user_repo: UserRepository = Depends(get_user_repo),
) -> Optional[dict]:
    token = authorization or x_auth_token
    if token:
        return user_repo.get_user_by_token(token)
    return None


def get_current_pharmacist(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_auth_token: Optional[str] = Header(None, alias="X-Auth-Token"),
    user_repo: UserRepository = Depends(get_user_repo),
) -> dict:
    """Exige autenticação válida com perfil de Farmacêutico Responsável (CRF)."""
    token = authorization or x_auth_token
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Autenticação necessária. Envie o cabeçalho 'Authorization: Bearer <token>' do Farmacêutico.",
        )
    user = user_repo.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada.")

    if user.get("role") not in ("pharmacist", "admin"):
        raise HTTPException(
            status_code=403,
            detail="Acesso negado: a validação de receitas médicas é restrita a Farmacêuticos Responsáveis (CRF).",
        )
    return user


@router.post("/analyze", response_model=CameraAnalyzeOut)
def analyze_camera_image(
    payload: CameraAnalyzeIn,
    product_repo: Optional[ProductRepository] = Depends(get_product_repo),
):
    """Análise Farmacêutica Real de Imagens/Receitas da Câmera via IA."""
    from app.config import get_settings
    settings = get_settings()
    try:
        return analyze_camera_payload(
            payload=payload,
            product_repo=product_repo,
            gemini_key=settings.gemini_api_key,
        )
    except Exception as e:
        logger.error(f"Erro na análise da câmera com IA: {e}")
        raise HTTPException(status_code=500, detail=f"Erro na análise visual da câmera: {e}")


@router.post("/capture", response_model=CameraCaptureResponse)
def capture(
    payload: CameraCaptureIn,
    repo: CameraRepository = Depends(get_camera_repo),
    auth_user: Optional[dict] = Depends(get_optional_user),
):
    try:
        data = payload.model_dump()
        # Se autenticado, vincula ao usuário da sessão
        if auth_user:
            data["user_id"] = auth_user["id"]

        record = repo.save_capture(data)
        return CameraCaptureResponse(
            success=True,
            message="Dados da câmera e análise farmacêutica armazenados com sucesso!",
            capture=CameraCaptureOut(**record),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar captura da câmera: {e}")


@router.get("/captures", response_model=List[CameraCaptureOut])
def list_captures(
    user_id: Optional[str] = Query(None),
    session_id: Optional[str] = Query(None),
    limite: int = Query(50, ge=1, le=100),
    repo: CameraRepository = Depends(get_camera_repo),
    auth_user: Optional[dict] = Depends(get_optional_user),
):
    """Lista capturas com proteção de privacidade.
    
    Se user_id for informado, exige token correspondente do titular.
    """
    if user_id:
        if not auth_user or auth_user["id"] != user_id:
            raise HTTPException(
                status_code=401 if not auth_user else 403,
                detail="Acesso não autorizado às capturas deste usuário.",
            )
        items = repo.list_captures(user_id=auth_user["id"], limit=limite)
        return [CameraCaptureOut(**i) for i in items]

    if auth_user:
        items = repo.list_captures(user_id=auth_user["id"], limit=limite)
        return [CameraCaptureOut(**i) for i in items]

    if session_id:
        items = repo.list_captures(session_id=session_id, limit=limite)
        return [CameraCaptureOut(**i) for i in items]

    return []


@router.get("/prescriptions", response_model=List[CameraCaptureOut])
def list_prescriptions(
    user_id: Optional[str] = Query(None),
    session_id: Optional[str] = Query(None),
    repo: CameraRepository = Depends(get_camera_repo),
    auth_user: Optional[dict] = Depends(get_optional_user),
):
    """Lista receitas médicas com proteção de privacidade."""
    if user_id:
        if not auth_user or auth_user["id"] != user_id:
            raise HTTPException(
                status_code=401 if not auth_user else 403,
                detail="Acesso não autorizado às receitas médicas deste usuário.",
            )
        items = repo.list_prescriptions(user_id=auth_user["id"])
        return [CameraCaptureOut(**i) for i in items]



    if auth_user:
        items = repo.list_prescriptions(user_id=auth_user["id"])
        return [CameraCaptureOut(**i) for i in items]

    if session_id:
        items = repo.list_prescriptions(session_id=session_id)
        return [CameraCaptureOut(**i) for i in items]

    return []


@router.post("/captures/{capture_id}/validate", response_model=CameraCaptureResponse)
def validate_prescription(
    capture_id: str,
    pharmacist: dict = Depends(get_current_pharmacist),
    repo: CameraRepository = Depends(get_camera_repo),
):
    """Validação técnica e legal da receita restrita ao Farmacêutico Responsável (CRF)."""
    updated = repo.validate_capture(
        capture_id,
        status="validado",
        validated_by=pharmacist.get("name", "Farmacêutico Responsável"),
        crf=pharmacist.get("crf", "CRF"),
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return CameraCaptureResponse(
        success=True,
        message=f"Receita validada com sucesso pelo Farmacêutico {pharmacist.get('name')} ({pharmacist.get('crf', 'CRF')})!",
        capture=CameraCaptureOut(**updated),
    )


@router.delete("/captures/{capture_id}")
def delete_capture(
    capture_id: str,
    session_id: Optional[str] = Query(None),
    repo: CameraRepository = Depends(get_camera_repo),
    auth_user: Optional[dict] = Depends(get_optional_user),
):
    """Exclui captura apenas se o solicitante for o dono autenticado ou da mesma sessão."""
    if not auth_user and not session_id:
        raise HTTPException(
            status_code=401,
            detail="Autenticação necessária para excluir capturas de receita.",
        )

    uid = auth_user["id"] if auth_user else None
    success = repo.delete_capture(capture_id, user_id=uid, session_id=session_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Captura não encontrada ou permissão insuficiente para exclusão.",
        )
    return {"success": True, "message": f"Captura {capture_id} removida com segurança."}
