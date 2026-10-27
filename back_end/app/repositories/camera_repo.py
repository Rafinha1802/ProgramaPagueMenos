"""Repositório de Capturas de Câmera e Receitas Médicas Digitais.

Persiste capturas, OCR, metadados farmacêuticos e fotos em data/camera_captures.json
e arquivos binários em data/camera_uploads/.
"""
import base64
import json
import logging
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

INITIAL_PRESCRIPTIONS: List[Dict[str, Any]] = [
    {
        "id": "cap_presc_01",
        "session_id": "sess_default",
        "user_id": "user_1",
        "type": "prescription",
        "name": "Receita Digital Certificada - Dr. Carlos Mendes.jpg",
        "preview_url": None,
        "intent": "prescription",
        "detected_medication": "Losartana Potássica 50mg + Dipirona 500mg",
        "brand": "Clínica Médica & Farmacologia Clínica",
        "active_principle": "Losartana 50mg / Dipirona 500mg",
        "dosage": "50mg / 500mg",
        "category": "Receituário Médico Oficial",
        "requires_prescription": True,
        "raw_text": "Receituário médico digital ICP-Brasil Dr. Carlos Mendes CRM/SP 142.891 Losartana 50mg 30 comp Dipirona 500mg",
        "doctor_name": "Dr. Carlos Mendes",
        "crm": "CRM/SP 142.891",
        "savings_pct": 52.0,
        "equivalent_generic": "Losartana 50mg Genérico EMS",
        "generic_price": 7.90,
        "reference_price": 16.50,
        "created_at": "2026-10-24T14:30:00.000Z",
        "status": "validado",
    }
]


class CameraRepository:
    def __init__(self, data_file: str = "data/camera_captures.json", uploads_dir: str = "data/camera_uploads"):
        self.path = Path(data_file)
        self.uploads_dir = Path(uploads_dir)
        self._lock = threading.Lock()
        self._init_storage()

    def _init_storage(self):
        with self._lock:
            try:
                self.path.parent.mkdir(parents=True, exist_ok=True)
                self.uploads_dir.mkdir(parents=True, exist_ok=True)
                if not self.path.exists():
                    self._save_captures_unlocked(INITIAL_PRESCRIPTIONS)
                    logger.info(f"Base de câmera inicializada em {self.path}")
            except Exception as e:
                logger.warning(f"Aviso ao inicializar storage de câmera: {e}")

    def _load_captures_unlocked(self) -> List[Dict[str, Any]]:
        try:
            if not self.path.exists():
                return [dict(p) for p in INITIAL_PRESCRIPTIONS]
            with open(self.path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return [dict(p) for p in INITIAL_PRESCRIPTIONS]
                return json.loads(content)
        except Exception as e:
            logger.error(f"Erro ao ler capturas de câmera de {self.path}: {e}")
            return [dict(p) for p in INITIAL_PRESCRIPTIONS]

    def _load_captures(self) -> List[Dict[str, Any]]:
        with self._lock:
            return self._load_captures_unlocked()

    def _save_captures_unlocked(self, captures: List[Dict[str, Any]]) -> None:
        try:
            with open(self.path, "w", encoding="utf-8") as f:
                json.dump(captures, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Erro ao salvar capturas de câmera em {self.path}: {e}")

    def _save_captures(self, captures: List[Dict[str, Any]]) -> None:
        with self._lock:
            self._save_captures_unlocked(captures)

    # ----------------------------------------------------------
    def save_capture(self, data: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            captures = self._load_captures_unlocked()
            capture_id = f"cap_{int(time.time() * 1000)}_{uuid.uuid4().hex[:6]}"

            raw_preview = data.get("preview_url")
            saved_file_url = None

            # Se preview for base64 data url, salva arquivo no disco e substitui pelo path relativo
            if raw_preview and raw_preview.startswith("data:image/"):
                try:
                    header, encoded = raw_preview.split(",", 1)
                    file_ext = "jpg"
                    if "png" in header:
                        file_ext = "png"
                    elif "webp" in header:
                        file_ext = "webp"

                    file_name = f"{capture_id}.{file_ext}"
                    disk_path = self.uploads_dir / file_name
                    with open(disk_path, "wb") as img_f:
                        img_f.write(base64.b64decode(encoded))
                    # URL servida pelo backend (evita crescer JSON em MBs)
                    saved_file_url = f"/static/uploads/{file_name}"
                    logger.info(f"Foto da câmera salva em disco: {disk_path} -> {saved_file_url}")
                except Exception as img_err:
                    logger.warning(f"Não foi possível salvar imagem em disco: {img_err}")
                    saved_file_url = None
            else:
                saved_file_url = raw_preview

            now_iso = datetime.now(timezone.utc).isoformat()
            is_prescription = bool(
                data.get("requires_prescription")
                or data.get("type") == "prescription"
                or data.get("intent") == "prescription"
            )

            # Segurança farmacêutica: novas capturas nascem aguardando validação do farmacêutico
            status = "pendente_validacao" if is_prescription else "processado"

            record = {
                "id": capture_id,
                "session_id": data.get("session_id"),
                "user_id": data.get("user_id"),
                "type": "prescription" if is_prescription else (data.get("type") or "photo"),
                "name": data.get("name") or f"captura_{capture_id}.jpg",
                "preview_url": saved_file_url,
                "intent": data.get("intent") or ("prescription" if is_prescription else "generic"),
                "detected_medication": data.get("detected_medication"),
                "brand": data.get("brand"),
                "active_principle": data.get("active_principle"),
                "dosage": data.get("dosage"),
                "category": data.get("category"),
                "requires_prescription": is_prescription,
                "raw_text": data.get("raw_text"),
                "doctor_name": data.get("doctor_name"),
                "crm": data.get("crm"),
                "savings_pct": data.get("savings_pct"),
                "equivalent_generic": data.get("equivalent_generic"),
                "generic_price": data.get("generic_price"),
                "reference_price": data.get("reference_price"),
                "created_at": now_iso,
                "status": status,
            }

            captures.insert(0, record)
            self._save_captures_unlocked(captures)
            return record

    # ----------------------------------------------------------
    def list_captures(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """Retorna capturas filtrando estritamente pelo usuário ou sessão fornecida."""
        with self._lock:
            captures = self._load_captures_unlocked()
            # Proteção de privacidade: se nenhum filtro for enviado, não expõe capturas de terceiros
            if not user_id and not session_id:
                return []

            results = []
            for c in captures:
                if user_id and c.get("user_id") == user_id:
                    results.append(c)
                elif session_id and not user_id and c.get("session_id") == session_id:
                    results.append(c)
                if len(results) >= limit:
                    break
            return results

    # ----------------------------------------------------------
    def list_prescriptions(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Retorna receitas filtrando estritamente pelo usuário ou sessão."""
        with self._lock:
            captures = self._load_captures_unlocked()
            # Proteção: sem filtro não vaza receitas de outros usuários
            if not user_id and not session_id:
                return []

            results = []
            for c in captures:
                if c.get("requires_prescription") or c.get("type") == "prescription" or c.get("intent") == "prescription":
                    if user_id and c.get("user_id") == user_id:
                        results.append(c)
                    elif session_id and not user_id and c.get("session_id") == session_id:
                        results.append(c)
            return results
            
    # ----------------------------------------------------------
    def get_by_id(self, capture_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            captures = self._load_captures_unlocked()
            for c in captures:
                if c["id"] == capture_id:
                    return dict(c)
            return None

    def get_capture_by_filename(self, filename: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            captures = self._load_captures_unlocked()
            clean_name = filename.strip().lower()
            for c in captures:
                p_url = (c.get("preview_url") or "").lower()
                c_id = c.get("id", "").lower()
                c_name = (c.get("name") or "").lower()
                if clean_name in p_url or c_id == clean_name.replace(".jpg", "") or c_name == clean_name:
                    return dict(c)
            return None

    # ----------------------------------------------------------
    def validate_capture(
        self,
        capture_id: str,
        status: str = "validado",
        validated_by: Optional[str] = None,
        crf: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Validação farmacêutica da receita (compliance ANVISA/CRF)."""
        with self._lock:
            captures = self._load_captures_unlocked()
            for c in captures:
                if c["id"] == capture_id:
                    c["status"] = status
                    if validated_by:
                        c["validated_by"] = validated_by
                    if crf:
                        c["crf"] = crf
                    self._save_captures_unlocked(captures)
                    return dict(c)
            return None

    # ----------------------------------------------------------
    def delete_capture(
        self,
        capture_id: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> bool:
        """Exclui captura com verificação rigorosa de posse (impede exclusão indevida)."""
        with self._lock:
            captures = self._load_captures_unlocked()
            target = None
            for c in captures:
                if c["id"] == capture_id:
                    target = c
                    break

            if not target:
                return False

            # Se a captura pertence a um usuário cadastrado, exige o mesmo user_id
            if target.get("user_id"):
                if not user_id or target["user_id"] != user_id:
                    return False
            else:
                # Captura anônima: exige a mesma session_id
                if not session_id or target.get("session_id") != session_id:
                    return False

            filtered = [c for c in captures if c["id"] != capture_id]
            self._save_captures_unlocked(filtered)
            return True
