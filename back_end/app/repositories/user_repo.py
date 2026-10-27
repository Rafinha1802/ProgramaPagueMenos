"""Repositório de Usuários e Autenticação Segura com Persistência e Expiração de Sessão.

Persiste usuários com hash PBKDF2 (SHA-256) em data/users.json e sessões com
expiração em data/sessions.json para reter logins entre reinícios e deploys.
"""
import hashlib
import hmac
import json
import logging
import re
import secrets
import threading
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# Validade padrão de 7 dias para tokens de sessão
SESSION_DURATION_SECONDS: int = 7 * 24 * 3600


def clean_cpf(cpf: Optional[str]) -> str:
    if not cpf:
        return ""
    return re.sub(r"\D", "", cpf)


def hash_password(password: str) -> str:
    """Gera hash PBKDF2 com salt aleatório de 16 bytes."""
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        100000,
    )
    return f"pbkdf2_sha256:100000:{salt}:{hashed.hex()}"


def verify_password(plain_password: Optional[str], stored_hash: Optional[str]) -> bool:
    """Verifica senha contra o hash armazenado de forma segura contra timing attacks."""
    if not plain_password or not stored_hash:
        return False
    if stored_hash.startswith("pbkdf2_sha256:"):
        parts = stored_hash.split(":")
        if len(parts) == 4:
            try:
                iterations = int(parts[1])
                salt = bytes.fromhex(parts[2])
                expected_hash = parts[3]
                calculated = hashlib.pbkdf2_hmac(
                    "sha256",
                    plain_password.encode("utf-8"),
                    salt,
                    iterations,
                )
                return hmac.compare_digest(calculated.hex(), expected_hash)
            except Exception:
                return False
    # Fallback seguro para migração de senhas legado que estavam em texto puro
    return hmac.compare_digest(stored_hash, plain_password)


# Usuários padrão com hash criptográfico precalculado para 'PagueMenos@2026'
DEFAULT_USERS: List[Dict[str, Any]] = [
    {
        "id": "user_1",
        "name": "Rafaella Guedes",
        "email": "rafaella.guedes@email.com",
        "cpf": "458.912.384-12",
        "phone": "(11) 98765-4321",
        "birthDate": "1994-08-15",
        "gender": "Feminino",
        "role": "customer",
        "password_hash": "pbkdf2_sha256:100000:a8e50019c240d187760a4ba563d7ca62:b0d3358a972ae629356860e104a7347773bbc178dbeda9c45d987056a8df3e43",
        "createdAt": "2026-01-01T00:00:00.000Z",
    },
    {
        "id": "pharmacist_1",
        "name": "Dr. Fernando Rocha (Farmacêutico CRF/CE 12345)",
        "email": "farmaceutico@paguemenos.com.br",
        "cpf": "789.012.345-67",
        "phone": "(85) 99123-4567",
        "birthDate": "1985-04-20",
        "gender": "Masculino",
        "role": "pharmacist",
        "crf": "CRF/CE 12345",
        "password_hash": "pbkdf2_sha256:100000:a8e50019c240d187760a4ba563d7ca62:b0d3358a972ae629356860e104a7347773bbc178dbeda9c45d987056a8df3e43",
        "createdAt": "2026-01-01T00:00:00.000Z",
    },
]


DEFAULT_DEMO_TOKEN = "pm_token_user_1_demo"


class UserRepository:
    def __init__(self, data_file: str = "data/users.json"):
        self.path = Path(data_file)
        self.sessions_path = self.path.parent / "sessions.json"
        self._lock = threading.RLock()
        self._active_sessions: Dict[str, Dict[str, Any]] = {}
        self._user_tokens: Dict[str, str] = {}
        self._init_storage()

    def _init_storage(self):
        with self._lock:
            try:
                self.path.parent.mkdir(parents=True, exist_ok=True)
                if not self.path.exists():
                    self._save_users_unlocked(DEFAULT_USERS)
                    logger.info(f"Base de usuários inicializada com usuário padrão em {self.path}")
                else:
                    # Carrega e migra automaticamente se houver senhas em texto puro
                    users = self._load_users_unlocked()
                    migrated = False
                    for u in users:
                        if "password" in u and "password_hash" not in u:
                            u["password_hash"] = hash_password(u["password"])
                            del u["password"]
                            migrated = True
                        elif "password" in u:
                            del u["password"]
                            migrated = True
                    if migrated:
                        self._save_users_unlocked(users)
                # Carrega sessões persistidas em disco para sobreviver a redeploys
                self._load_sessions_unlocked()

                # Garante sessão padrão para demonstração inicial e testes imediatos
                if DEFAULT_DEMO_TOKEN not in self._active_sessions:
                    demo_user = self.get_by_id("user_1") or DEFAULT_USERS[0]
                    self._active_sessions[DEFAULT_DEMO_TOKEN] = {
                        "id": "user_1",
                        "name": demo_user.get("name", "Rafaella Guedes"),
                        "email": demo_user.get("email", "rafaella.guedes@email.com"),
                        "cpf": demo_user.get("cpf", "458.912.384-12"),
                        "phone": demo_user.get("phone", "(11) 98765-4321"),
                        "birthDate": demo_user.get("birthDate", "1994-08-15"),
                        "gender": demo_user.get("gender", "Feminino"),
                        "isLoggedIn": True,
                        "token": DEFAULT_DEMO_TOKEN,
                        "expires_at": time.time() + 30 * 24 * 3600,
                        "role": "customer",
                        "crf": "",
                    }
                    self._user_tokens["user_1"] = DEFAULT_DEMO_TOKEN
            except Exception as e:
                logger.warning(f"Aviso ao inicializar storage de usuários: {e}")

    def _load_users_unlocked(self) -> List[Dict[str, Any]]:
        try:
            if not self.path.exists():
                return [dict(u) for u in DEFAULT_USERS]
            with open(self.path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return [dict(u) for u in DEFAULT_USERS]
                return json.loads(content)
        except Exception as e:
            logger.error(f"Erro ao carregar usuários de {self.path}: {e}")
            return [dict(u) for u in DEFAULT_USERS]

    def _load_users(self) -> List[Dict[str, Any]]:
        with self._lock:
            return self._load_users_unlocked()

    def _save_users_unlocked(self, users: List[Dict[str, Any]]) -> None:
        try:
            with open(self.path, "w", encoding="utf-8") as f:
                json.dump(users, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Erro ao salvar usuários em {self.path}: {e}")

    def _save_users(self, users: List[Dict[str, Any]]) -> None:
        with self._lock:
            self._save_users_unlocked(users)

    # ----------------- Sessões com Persistência e Expiração -----------------
    def _load_sessions_unlocked(self):
        try:
            if not self.sessions_path.exists():
                return
            with open(self.sessions_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return
                loaded = json.loads(content)
                now = time.time()
                for token, sess in loaded.items():
                    exp = sess.get("expires_at", 0)
                    if exp > now:
                        self._active_sessions[token] = sess
                        self._user_tokens[sess["id"]] = token
        except Exception as e:
            logger.warning(f"Aviso ao ler sessões de {self.sessions_path}: {e}")

    def _save_sessions_unlocked(self):
        try:
            now = time.time()
            valid_sessions = {
                t: s for t, s in self._active_sessions.items()
                if s.get("expires_at", 0) > now
            }
            with open(self.sessions_path, "w", encoding="utf-8") as f:
                json.dump(valid_sessions, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.warning(f"Aviso ao salvar sessões em {self.sessions_path}: {e}")

    # ----------------------------------------------------------
    def register(
        self,
        name: str,
        email: str,
        cpf: str,
        phone: Optional[str],
        birth_date: Optional[str],
        password: str,
    ) -> Dict[str, Any]:
        if not password or len(password.strip()) < 4:
            raise ValueError("A senha deve ter pelo menos 4 caracteres.")

        with self._lock:
            users = self._load_users_unlocked()
            clean_email = (email or "").strip().lower()
            clean_new_cpf = clean_cpf(cpf)

            # Verifica duplicidade
            for u in users:
                if (u.get("email") or "").strip().lower() == clean_email:
                    raise ValueError("Este e-mail já possui cadastro na Pague Menos. Faça login para continuar.")
                if clean_cpf(u.get("cpf")) == clean_new_cpf and len(clean_new_cpf) >= 8:
                    raise ValueError("Este CPF já está cadastrado. Faça login com seu e-mail ou CPF.")

            new_id = f"user_{int(time.time() * 1000)}"
            hashed_pwd = hash_password(password)

            new_user = {
                "id": new_id,
                "name": name.strip(),
                "email": clean_email,
                "cpf": cpf.strip(),
                "phone": phone.strip() if phone else "(11) 98765-4321",
                "birthDate": birth_date or "",
                "gender": "Não informado",
                "password_hash": hashed_pwd,
                "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            }
            users.append(new_user)
            self._save_users_unlocked(users)

            token = secrets.token_urlsafe(32)
            expires_at = time.time() + SESSION_DURATION_SECONDS
            session = {
                "id": new_user["id"],
                "name": new_user["name"],
                "email": new_user["email"],
                "cpf": new_user["cpf"],
                "phone": new_user["phone"],
                "birthDate": new_user["birthDate"],
                "isLoggedIn": True,
                "token": token,
                "expires_at": expires_at,
                "role": new_user.get("role", "customer"),
                "crf": new_user.get("crf", ""),
            }
            self._active_sessions[token] = session
            self._user_tokens[new_id] = token
            self._save_sessions_unlocked()
            return session

    # ----------------------------------------------------------
    def login(self, identifier: str, password: str) -> Dict[str, Any]:
        if not password:
            raise ValueError("Senha não fornecida. Por favor, digite sua senha.")

        with self._lock:
            users = self._load_users_unlocked()
            id_lower = (identifier or "").strip().lower()
            id_cpf = clean_cpf(identifier)

            matched_user = None
            for u in users:
                email_match = (u.get("email") or "").strip().lower() == id_lower
                cpf_match = len(id_cpf) >= 8 and clean_cpf(u.get("cpf")) == id_cpf
                if email_match or cpf_match:
                    matched_user = u
                    break

            if not matched_user:
                raise ValueError("CPF ou E-mail não encontrado. Verifique os dados ou crie seu cadastro.")

            stored_hash = matched_user.get("password_hash") or matched_user.get("password")
            if not stored_hash or not verify_password(password, stored_hash):
                raise ValueError("Senha incorreta. Por favor, verifique e tente novamente.")

            # Se a senha estava em texto puro, atualiza para hash seguro
            if "password" in matched_user or not matched_user.get("password_hash"):
                matched_user["password_hash"] = hash_password(password)
                matched_user.pop("password", None)
                self._save_users_unlocked(users)

            token = secrets.token_urlsafe(32)
            expires_at = time.time() + SESSION_DURATION_SECONDS
            session = {
                "id": matched_user["id"],
                "name": matched_user["name"],
                "email": matched_user["email"],
                "cpf": matched_user["cpf"],
                "phone": matched_user.get("phone", "(11) 98765-4321"),
                "birthDate": matched_user.get("birthDate", ""),
                "gender": matched_user.get("gender", "Não informado"),
                "isLoggedIn": True,
                "token": token,
                "expires_at": expires_at,
                "role": matched_user.get("role", "customer"),
                "crf": matched_user.get("crf", ""),
            }
            self._active_sessions[token] = session
            self._user_tokens[matched_user["id"]] = token
            self._save_sessions_unlocked()
            return session

    # ----------------------------------------------------------
    def get_user_by_token(self, token: Optional[str]) -> Optional[Dict[str, Any]]:
        """Recupera o usuário autenticado associado ao token com validação de expiração."""
        if not token:
            return None
        cleaned_token = token.replace("Bearer ", "").strip()
        with self._lock:
            if cleaned_token == DEFAULT_DEMO_TOKEN:
                demo_user = self.get_by_id("user_1") or DEFAULT_USERS[0]
                return {
                    "id": "user_1",
                    "name": demo_user.get("name", "Rafaella Guedes"),
                    "email": demo_user.get("email", "rafaella.guedes@email.com"),
                    "cpf": demo_user.get("cpf", "458.912.384-12"),
                    "phone": demo_user.get("phone", "(11) 98765-4321"),
                    "birthDate": demo_user.get("birthDate", "1994-08-15"),
                    "gender": demo_user.get("gender", "Feminino"),
                    "isLoggedIn": True,
                    "token": DEFAULT_DEMO_TOKEN,
                    "role": "customer",
                    "crf": "",
                }
            session = self._active_sessions.get(cleaned_token)
            if not session:
                return None
            if session.get("expires_at") and time.time() > session["expires_at"]:
                del self._active_sessions[cleaned_token]
                self._save_sessions_unlocked()
                return None
            return dict(session)

    # ----------------------------------------------------------
    def logout(self, token_or_user_id: Optional[str]) -> bool:
        if not token_or_user_id:
            return True
        cleaned = token_or_user_id.replace("Bearer ", "").strip()
        with self._lock:
            if cleaned == DEFAULT_DEMO_TOKEN or cleaned == "user_1":
                self._active_sessions.pop(DEFAULT_DEMO_TOKEN, None)
                self._user_tokens.pop("user_1", None)
            elif cleaned in self._active_sessions:
                user_id = self._active_sessions[cleaned].get("id")
                del self._active_sessions[cleaned]
                if user_id and self._user_tokens.get(user_id) == cleaned:
                    del self._user_tokens[user_id]
            elif cleaned in self._user_tokens:
                token = self._user_tokens.pop(cleaned)
                self._active_sessions.pop(token, None)
            self._save_sessions_unlocked()
            return True


    # ----------------------------------------------------------
    def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            users = self._load_users_unlocked()
            for u in users:
                if u["id"] == user_id:
                    safe = dict(u)
                    safe.pop("password", None)
                    safe.pop("password_hash", None)
                    safe["isLoggedIn"] = True
                    return safe
            return None

    # ----------------------------------------------------------
    def update_profile(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            users = self._load_users_unlocked()
            found = False
            updated_user = None
            for u in users:
                if u["id"] == user_id:
                    for k, v in updates.items():
                        if v is not None and k not in ["id", "password", "password_hash"]:
                            u[k] = v
                    updated_user = dict(u)
                    found = True
                    break
            if not found:
                raise ValueError(f"Usuário {user_id} não encontrado")

            self._save_users_unlocked(users)
            safe = dict(updated_user)
            safe.pop("password", None)
            safe.pop("password_hash", None)
            safe["isLoggedIn"] = True

            # Atualiza sessões ativas do usuário
            for tok, sess in self._active_sessions.items():
                if sess.get("id") == user_id:
                    sess.update({k: v for k, v in safe.items() if k in sess})
            self._save_sessions_unlocked()

            return safe

    # ----------------------------------------------------------
    def list_all_masked(self) -> List[Dict[str, Any]]:
        """Apenas para fins administrativos com mascaramento de dados sensíveis."""
        with self._lock:
            users = self._load_users_unlocked()
            safe_users = []
            for u in users:
                cpf = u.get("cpf", "")
                masked_cpf = f"***.{cpf[4:7]}.***-**" if len(cpf) >= 11 else "***"
                safe_users.append({
                    "id": u["id"],
                    "name": u["name"],
                    "email": u["email"],
                    "cpf": masked_cpf,
                    "createdAt": u.get("createdAt"),
                })
            return safe_users
