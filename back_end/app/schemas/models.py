"""Contratos Pydantic: entrada e saída da API."""
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------- chat ----------------
class ChatRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=2000)


class ProdutoRecomendado(BaseModel):
    product_id: str
    nome: str
    marca: str
    preco: float
    disponivel: bool
    categoria: Optional[str] = None
    motivo_recomendacao: str = "Produto disponível e sem exigência de receita."
    is_prescription: bool = False


class ChatResponse(BaseModel):
    tipo: str  # "produto" | "bloqueio_intencao" | "sem_produto_seguro"
    mensagem: str
    produtos: List[ProdutoRecomendado] = Field(default_factory=list)
    guardrail_acionado: Optional[str] = None
    fontes: List[str] = Field(default_factory=list)
    fallback_llm: bool = False


# ---------------- carrinho ----------------
class CartItemIn(BaseModel):
    session_id: str
    product_id: str
    quantidade: int = Field(1, ge=1, le=99, description="Quantidade entre 1 e 99 itens")


class CartItemUpdateIn(BaseModel):
    session_id: str
    quantidade: int = Field(..., ge=0, le=99, description="Quantidade entre 0 e 99 (0 remove do carrinho)")


class CartItemOut(BaseModel):
    product_id: str
    nome: str
    preco: float
    quantidade: int


class CartResponse(BaseModel):
    session_id: str
    itens: List[CartItemOut]
    total: float
    pedido_id: Optional[str] = None


class OrderItem(BaseModel):
    id: str
    name: str
    brand: Optional[str] = None
    quantity: int = 1
    price: float
    image: Optional[str] = None


# ---------------- checkout ----------------
class CheckoutRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    address: Optional[str] = None
    payment_method: Optional[str] = None
    delivery_type: Optional[str] = None
    items: Optional[List[OrderItem]] = None
    total: Optional[float] = None
    subtotal: Optional[float] = None
    discount: Optional[float] = 0.0
    freight: Optional[float] = 0.0
    savings: Optional[float] = 0.0
    has_prescription: Optional[bool] = False
    prescription_option: Optional[str] = None


# ---------------- auth ----------------
class UserRegisterIn(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=5)
    cpf: str = Field(..., min_length=11)
    phone: Optional[str] = "(11) 98765-4321"
    birthDate: Optional[str] = ""
    password: str = Field(..., min_length=4)


class UserLoginIn(BaseModel):
    identifier: str = Field(..., min_length=3)
    password: str = Field(..., min_length=1)


class UserSessionOut(BaseModel):
    id: str
    name: str
    email: str
    cpf: str
    phone: Optional[str] = None
    birthDate: Optional[str] = None
    isLoggedIn: bool = True
    token: Optional[str] = None
    role: Optional[str] = "customer"
    crf: Optional[str] = None
    address: Optional[str] = None


class AuthResponse(BaseModel):
    success: bool
    user: Optional[UserSessionOut] = None
    error: Optional[str] = None
    message: Optional[str] = None


class UserProfileUpdateIn(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    cpf: Optional[str] = None
    phone: Optional[str] = None
    birthDate: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None


class LogoutRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None


# ---------------- camera ----------------
class CameraCaptureIn(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    type: Optional[str] = "photo"  # "photo" | "prescription"
    name: Optional[str] = "captura.jpg"
    preview_url: Optional[str] = None
    intent: Optional[str] = None
    detected_medication: Optional[str] = None
    brand: Optional[str] = None
    active_principle: Optional[str] = None
    dosage: Optional[str] = None
    category: Optional[str] = None
    requires_prescription: bool = False
    raw_text: Optional[str] = None
    doctor_name: Optional[str] = None
    crm: Optional[str] = None
    savings_pct: Optional[float] = None
    equivalent_generic: Optional[str] = None
    generic_price: Optional[float] = None
    reference_price: Optional[float] = None
    notes: Optional[str] = None


class CameraCaptureOut(BaseModel):
    id: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    type: str
    name: str
    preview_url: Optional[str] = None
    intent: Optional[str] = None
    detected_medication: Optional[str] = None
    brand: Optional[str] = None
    active_principle: Optional[str] = None
    dosage: Optional[str] = None
    category: Optional[str] = None
    requires_prescription: bool = False
    raw_text: Optional[str] = None
    doctor_name: Optional[str] = None
    crm: Optional[str] = None
    savings_pct: Optional[float] = None
    equivalent_generic: Optional[str] = None
    generic_price: Optional[float] = None
    reference_price: Optional[float] = None
    created_at: str
    status: str = "validado"
    validated_by: Optional[str] = None
    crf: Optional[str] = None


class CameraCaptureResponse(BaseModel):
    success: bool
    message: str
    capture: Optional[CameraCaptureOut] = None


class CameraAnalyzeIn(BaseModel):
    image: Optional[str] = None  # base64 data url ou string base64 pura
    filename: Optional[str] = None
    ocr_text: Optional[str] = None
    intent: Optional[str] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = None


class CameraAnalyzeOut(BaseModel):
    success: bool
    identified: bool
    title: str
    message: str
    reason: Optional[str] = None
    intent: str = "generic"  # "prescription" | "generic" | "consultation"
    detected_medication: Optional[str] = None
    brand: Optional[str] = None
    active_principle: Optional[str] = None
    dosage: Optional[str] = None
    category: Optional[str] = None
    requires_prescription: bool = False
    raw_text: Optional[str] = None
    anvisa_registry: Optional[str] = None
    usage_advice: Optional[str] = None
    equivalent_generic: Optional[str] = None
    generic_price: Optional[float] = None
    reference_price: Optional[float] = None
    savings_pct: Optional[float] = None
    badge_text: Optional[str] = None
    action_text: Optional[str] = None
    doctor_name: Optional[str] = None
    crm: Optional[str] = None
    prescription_data: Optional[dict] = None
    matched_products: List[ProdutoRecomendado] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    ai_source: str = "local_vision"


# ---------------- orders ----------------


class OrderOut(BaseModel):
    id: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    date: str
    time: str
    status: str
    statusColor: str
    statusBg: str
    deliveryType: str
    paymentMethod: str
    address: str
    total: float
    discount: float = 0.0
    subtotal: float
    freight: float = 0.0
    items: List[OrderItem] = Field(default_factory=list)


class CheckoutResponse(BaseModel):
    pedido_id: str
    status: str
    total: float
    mensagem: str = "Pedido simulado com sucesso."
    pedido: Optional[OrderOut] = None
