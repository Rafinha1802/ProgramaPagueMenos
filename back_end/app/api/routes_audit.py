"""GET /audit/readiness — consome o JSON da Estação 12."""
import json
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/audit", tags=["audit"])

JSON_PATH = Path("dados/auditoria/prontidao_producao.json")


@router.get("/readiness")
def readiness() -> Dict[str, Any]:
    if not JSON_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Rode a Estação 12 para gerar prontidao_producao.json",
        )
    return json.loads(JSON_PATH.read_text(encoding="utf-8"))
