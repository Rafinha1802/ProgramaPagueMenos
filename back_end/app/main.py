"""FastAPI app principal.

Inicializa repositórios, RAG, LLM, orquestrador, repositório de usuários,
câmera e pedidos no startup.
"""
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from typing import Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api import (
    routes_audit,
    routes_auth,
    routes_camera,
    routes_cart,
    routes_chat,
    routes_checkout,
    routes_orders,
    routes_products,
)
from app.config import get_settings
from app.core.llm_agent import SafeLLMAgent
from app.core.rag_engine import RAGEngine
from app.repositories.camera_repo import CameraRepository
from app.repositories.cart_repo import CartRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.user_repo import UserRepository
from app.services.orchestrator import OrquestradorIA

logger = logging.getLogger(__name__)

# módulos globais — acessados por dependency injection nas rotas
_product_repo: ProductRepository = None
_cart_repo: CartRepository = None
_user_repo: UserRepository = None
_camera_repo: CameraRepository = None
_order_repo: OrderRepository = None
_rag: RAGEngine = None
_llm: SafeLLMAgent = None
_orquestrador: OrquestradorIA = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _product_repo, _cart_repo, _user_repo, _camera_repo, _order_repo, _rag, _llm, _orquestrador
    settings = get_settings()

    logging.basicConfig(level=settings.log_level.upper())
    logger.info("Inicializando aplicação...")

    _product_repo = ProductRepository(settings.catalog_path)
    _cart_repo = CartRepository()
    _user_repo = UserRepository("data/users.json")
    _camera_repo = CameraRepository("data/camera_captures.json", "data/camera_uploads")
    _order_repo = OrderRepository("data/orders.json")

    _rag = RAGEngine(
        _product_repo.get_dataframe(),
        backend=settings.embedding_backend,
        model_name=settings.embedding_model,
    )
    _llm = SafeLLMAgent(
        model=settings.llm_model,
        enabled=settings.llm_enabled,
        api_key=settings.openai_api_key,
        gemini_key=settings.gemini_api_key,
        groq_key=settings.groq_api_key,
        provider=settings.llm_provider,
    )
    _orquestrador = OrquestradorIA(rag=_rag, llm=_llm, top_k=settings.rag_top_k)

    logger.info("Aplicação pronta.")
    yield
    logger.info("Encerrando aplicação.")


app = FastAPI(
    title="Pague Menos IA Commerce API",
    version="0.2.0",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_main_user_repo() -> Optional[UserRepository]:
    return _user_repo


def get_main_camera_repo() -> Optional[CameraRepository]:
    return _camera_repo


# Garante que a pasta de produtos exista e monta arquivos estáticos sob /static/products
# para NÃO entrar em conflito com o roteador de catálogo GET /products/{product_id}
products_dir = Path("data/products")
products_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static/products", StaticFiles(directory=str(products_dir)), name="products_static")

# Diretório de uploads da câmera (receitas médicas - dados sensíveis)
uploads_dir = Path("data/camera_uploads")
uploads_dir.mkdir(parents=True, exist_ok=True)


def get_uploads_dir() -> Path:
    if _camera_repo is not None:
        return _camera_repo.uploads_dir
    return uploads_dir


@app.get("/static/uploads/{filename}", tags=["camera"])
def get_uploaded_prescription(
    filename: str,
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_auth_token: Optional[str] = Header(None, alias="X-Auth-Token"),
    user_repo: Optional[UserRepository] = Depends(get_main_user_repo),
    camera_repo: Optional[CameraRepository] = Depends(get_main_camera_repo),
    target_dir: Path = Depends(get_uploads_dir),
):
    """Endpoint protegido para download de imagens de receitas médicas.
    
    Exige autenticação via cabeçalho 'Authorization: Bearer <token>' ou 'X-Auth-Token'
    e valida a titularidade do documento para compliance rigoroso com LGPD e ANVISA.
    """
    token = authorization or x_auth_token
    if not token or user_repo is None:
        raise HTTPException(
            status_code=401,
            detail="Acesso não autorizado a documentos e receitas médicas.",
        )

    user = user_repo.get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Sessão inválida ou expirada. Faça login novamente.",
        )

    target_resolved = target_dir.resolve()
    file_path = (target_dir / filename).resolve()

    # Proteção estrita contra Directory Traversal usando Path.is_relative_to
    if not file_path.is_relative_to(target_resolved):
        raise HTTPException(status_code=400, detail="Caminho de arquivo inválido.")

    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Arquivo de receita não encontrado.")

    # Validação de posse: apenas o próprio paciente titular ou farmacêutico/admin pode baixar
    if camera_repo is not None:
        capture = camera_repo.get_capture_by_filename(filename)
        if capture:
            is_owner = capture.get("user_id") == user["id"]
            is_staff = user.get("role") in ("pharmacist", "admin")
            if not is_owner and not is_staff:
                raise HTTPException(
                    status_code=403,
                    detail="Acesso negado: esta receita médica pertence a outro paciente.",
                )

    return FileResponse(file_path)

# Rotas
app.include_router(routes_auth.router)
app.include_router(routes_camera.router)
app.include_router(routes_orders.router)
app.include_router(routes_chat.router)
app.include_router(routes_products.router)
app.include_router(routes_cart.router)
app.include_router(routes_checkout.router)
app.include_router(routes_audit.router)


@app.get("/health", tags=["health"])
def health():
    return {
        "status": "ok",
        "catalog_loaded": _product_repo is not None,
        "users_loaded": _user_repo is not None,
        "camera_loaded": _camera_repo is not None,
        "orders_loaded": _order_repo is not None,
        "rag_backend": _rag.info() if _rag else None,
        "llm_enabled": _llm.enabled if _llm else False,
    }


@app.get("/")
def read_root():
    return {
        "message": "Bem-vindo à API do IA Commerce da Pague Menos!",
        "status": "online",
        "docs": "Acesse /docs para ver a documentação interativa",
        "health": "Acesse /health para verificar o status",
    }
