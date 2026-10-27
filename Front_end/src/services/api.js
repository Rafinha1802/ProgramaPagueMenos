// Cliente de API REST para integração com o back_PagueMenos (FastAPI)
// Permite que o frontend consulte produtos, faça chat com IA com guardrails determinísticos
// e sincronize carrinho/checkout diretamente com o servidor backend.

// Em desenvolvimento, '/api' utiliza o proxy configurado no Vite (evitando CORS).
// Em produção, usa a variável de ambiente VITE_API_URL configurada.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const NEUTRAL_PLACEHOLDER = '/products/neutral-product-placeholder.svg';

/**
 * Obtém ou inicializa um identificador de sessão único (UUID) no sessionStorage
 */
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server-session';
  let sid = sessionStorage.getItem('pm_session_id');
  if (!sid) {
    sid = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('pm_session_id', sid);
  }
  return sid;
}

/**
 * Mapeamento seguro de imagens:
 * Apenas aplica fotos reais quando há correspondência forte e inequívoca de marca/produto.
 * Para qualquer outro produto, utiliza placeholder neutro para não induzir a erro farmacêutico.
 */
function resolveProductImage(nome = '', marca = '') {
  const text = `${nome} ${marca}`.toLowerCase();

  // 1. Neutrogena
  if (/\bneutrogena\b/i.test(text)) {
    if (/\bkit\b/i.test(text)) return '/products/neutrogena-kit.png';
    if (/\b(facial|matte|oleosa)\b/i.test(text)) return '/products/neutrogena-sunfresh-facial.png';
    if (/\bfps\s*90\b|\b90\s*fps\b/i.test(text) || (/\b90\b/i.test(text) && !/\b(90g|90ml)\b/i.test(text))) return '/products/neutrogena-sunfresh-fps90.png';
    if (/\bfps\s*60\b|\b60\s*fps\b/i.test(text) || (/\b60\b/i.test(text) && !/\b(60g|60ml)\b/i.test(text))) return '/products/neutrogena-sunfresh-fps60.png';
    if (/\b(sun|sunfresh|protetor)\b/i.test(text)) return '/products/neutrogena-sunfresh-fps70.png';
  }

  // 2. Nivea
  if (/\bnivea\b/i.test(text)) {
    if (/\b(sun|protetor|solar|bronzeador)\b/i.test(text)) {
      if (/\b(fps\s*50|50\s*fps|fps50|\b50\b)/i.test(text) && !/\b(150|150g|250)\b/i.test(text)) {
        return '/products/nivea-sun-fps50.jpg';
      }
      return '/products/nivea-sun.jpg';
    }
    if (/\b(men|deep|barba)\b/i.test(text)) return '/products/nivea-men.jpg';
  }

  // 3. Medicamentos e dermocosméticos específicos com embalagens oficiais catalogadas
  if (/\bbuscopan\b/i.test(text)) return '/products/buscopan.jpg';
  if (/\bpantene\b/i.test(text)) return '/products/pantene-kit.jpg';
  if (/\bdauf\b/i.test(text)) {
    if (/\b(soro|fisiol|solu)\b/i.test(text)) return '/products/soro-dauf.jpg';
    if (/\b(labial|labios|protetor labial)\b/i.test(text)) return '/products/protetor-labial-dauf.jpg';
  }
  if (/\bdorflex\b/i.test(text)) return '/products/dorflex.jpg';
  if (/\bdipirona\b/i.test(text) && /\bems\b/i.test(text)) return '/products/dipirona-ems.jpg';
  if (/\bbenegrip\b/i.test(text)) return '/products/benegrip.jpg';
  if (/\bneosaldina\b/i.test(text)) return '/products/neosaldina.jpg';
  if (/\bsecret\b/i.test(text) && /\b(clinical|desodorante|antitranspirante)\b/i.test(text)) return '/products/secret-clinical.jpg';
  if (/\bcerave\b/i.test(text)) return '/products/cerave.jpg';
  if (/\bdarrow\b/i.test(text) || /\bactine\b/i.test(text)) return '/products/darrow-actine.jpg';
  if (/\baptanutri\b/i.test(text)) return '/products/aptanutri.jpg';
  if (/\bcewin\b/i.test(text) || (/\bvitamina\s*c\b/i.test(text) && /\bpague\s*menos\b/i.test(text))) return '/products/vitamina-c-pm.jpg';
  if (/\bozempic\b/i.test(text)) return '/products/ozempic.jpg';

  // Fallback seguro e neutro
  return NEUTRAL_PLACEHOLDER;
}

/**
 * Normaliza o produto recebido do backend para o formato usado na interface
 * Regra: NUNCA inventar preço, preço de clube falso ou avaliações inexistentes.
 */
export function normalizeProduct(raw) {
  if (!raw) return null;

  const id = String(raw.product_id || raw.id || '');
  const name = raw.nome || raw.product_name || raw.name || 'Produto Pague Menos';
  const brand = raw.marca || raw.brand || 'Pague Menos';

  // Preço real do backend (sem valores fictícios)
  const price = typeof raw.preco === 'number'
    ? raw.preco
    : (typeof raw.price === 'number' ? raw.price : 0);

  // Preço original: apenas se existir valor de lista superior ao preço
  const originalPrice = (typeof raw.originalPrice === 'number' && raw.originalPrice > price)
    ? raw.originalPrice
    : (typeof raw.list_price === 'number' && raw.list_price > price ? raw.list_price : price);

  // Preço clube: rigorosamente igual ao preço real (sem criar desconto imaginário)
  const clubPrice = (typeof raw.clubPrice === 'number' && raw.clubPrice > 0)
    ? raw.clubPrice
    : price;

  const category = raw.categoria || raw.category_path || raw.category || 'Geral';
  const isAvailable = raw.disponivel !== false && raw.is_available !== false;
  const requiresPrescription = Boolean(raw.is_prescription || raw.requiresPrescription);

  const categorySegments = category.split('/').filter(Boolean);
  const categoryLabel = categorySegments[0] || (category.includes('>') ? category.split('>')[0].trim() : category);

  // Parcelamento baseado no preço real
  const installments = price >= 60
    ? `2x de R$ ${(price / 2).toFixed(2).replace('.', ',')} s/ juros`
    : `1x de R$ ${price.toFixed(2).replace('.', ',')}`;

  const image = raw.image || resolveProductImage(name, brand);

  // Badge de desconto real se houver diferença de preço de lista
  const discountBadge = originalPrice > price
    ? `-${Math.round((1 - price / originalPrice) * 100)}%`
    : (raw.discountBadge || null);

  return {
    id,
    product_id: id,
    name,
    nome: name,
    brand,
    marca: brand,
    price,
    preco: price,
    originalPrice,
    clubPrice,
    installments,
    category,
    categoria: category,
    categoryLabel,
    image,
    description: raw.description || raw.motivo_recomendacao || `${name} - Garantia de procedência Farmácia Pague Menos.`,
    motivo_recomendacao: raw.motivo_recomendacao || 'Produto disponível e sem exigência de receita.',
    disponivel: isAvailable,
    is_available: isAvailable,
    requiresPrescription,
    isGeneric: Boolean(
      raw.isGeneric ||
      name.toLowerCase().includes('genérico') ||
      name.toLowerCase().includes('generico') ||
      ['medley', 'neo química', 'ems', 'eurofarma', 'cimed', 'sandoz'].includes(brand.toLowerCase())
    ),
    // Somente expõe rating e reviews se existirem de fato nos dados
    rating: (typeof raw.rating === 'number') ? raw.rating : null,
    reviewsCount: (typeof raw.reviewsCount === 'number') ? raw.reviewsCount : null,
    discountBadge,
    offerTag: raw.offerTag || null,
    clinicalRole: raw.clinicalRole || raw.motivo_recomendacao || null
  };
}

/**
 * Verifica o status de saúde do backend FastAPI
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Status HTTP: ${res.status}`);
    const data = await res.json();
    return {
      online: true,
      data
    };
  } catch (error) {
    return {
      online: false,
      error: error.message
    };
  }
}

/**
 * Busca produtos do catálogo no backend com suporte a filtros
 */
export async function fetchProducts({
  categoria = null,
  apenas_disponiveis = true,
  limite = 100,
  offset = 0,
  ids = null
} = {}) {
  try {
    const params = new URLSearchParams();
    if (ids) {
      params.append('ids', Array.isArray(ids) ? ids.join(',') : String(ids));
    }
    if (categoria && categoria !== 'all' && categoria !== 'ofertas') {
      params.append('categoria', categoria);
    }
    if (apenas_disponiveis !== undefined) {
      params.append('apenas_disponiveis', String(apenas_disponiveis));
    }
    if (limite) params.append('limite', String(limite));
    if (offset) params.append('offset', String(offset));

    const url = `${API_BASE_URL}/products?${params.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar produtos do backend: ${res.status}`);
    }

    const rawList = await res.json();
    return (Array.isArray(rawList) ? rawList : []).map(normalizeProduct);
  } catch (error) {
    console.warn('[apiService] Falha ao conectar ao backend /products:', error);
    throw error;
  }
}

/**
 * Busca um produto específico pelo ID no backend
 */
export async function fetchProductById(productId) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Produto não encontrado: ${res.status}`);
    const data = await res.json();
    return normalizeProduct(data);
  } catch (error) {
    console.warn(`[apiService] Erro ao buscar produto ${productId}:`, error);
    return null;
  }
}

/**
 * Envia uma mensagem em linguagem natural para o orquestrador do backend
 * Aplica as 4 camadas de Guardrails determinísticos + RAG vetorial + LLM
 */
export async function sendChatMessage({ sessionId = null, message }) {
  try {
    const activeSessionId = sessionId || getOrCreateSessionId();
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        session_id: activeSessionId,
        message: message
      })
    });

    if (!res.ok) {
      throw new Error(`Erro no chat do backend: HTTP ${res.status}`);
    }

    const data = await res.json();
    const normalizedProducts = (data.produtos || []).map(normalizeProduct);

    return {
      tipo: data.tipo,
      mensagem: data.mensagem,
      produtos: normalizedProducts,
      guardrailAcionado: data.guardrail_acionado,
      fontes: data.fontes || [],
      fallbackLlm: data.fallback_llm || false,
      raw: data
    };
  } catch (error) {
    console.error('[apiService] Erro na requisição /chat:', error);
    throw error;
  }
}

/**
 * Adiciona item ao carrinho no backend com validação de receita (403 ANVISA)
 */
export async function addCartItemBackend({ sessionId = null, productId, quantidade = 1 }) {
  try {
    const activeSessionId = sessionId || getOrCreateSessionId();
    const res = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: activeSessionId,
        product_id: String(productId),
        quantidade: quantidade
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error = new Error(err.detail || `HTTP ${res.status}`);
      error.status = res.status;
      error.detail = err.detail;
      throw error;
    }
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro no cart backend:', error);
    throw error;
  }
}

/**
 * Consulta carrinho por ID de sessão
 */
export async function fetchCartBackend(sessionId = null) {
  try {
    const activeSessionId = sessionId || getOrCreateSessionId();
    const res = await fetch(`${API_BASE_URL}/cart?session_id=${encodeURIComponent(activeSessionId)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao consultar cart backend:', error);
    return null;
  }
}

/**
 * Simula checkout no backend e registra o pedido no back_PagueMenos
 */
export async function checkoutBackend(params = {}) {
  try {
    const sessionId = typeof params === 'string' ? params : (params?.sessionId || null);
    const userId = typeof params === 'object' ? params?.userId : null;
    const address = typeof params === 'object' ? params?.address : null;
    const paymentMethod = typeof params === 'object' ? params?.paymentMethod : null;
    const deliveryType = typeof params === 'object' ? params?.deliveryType : null;
    const items = typeof params === 'object' ? params?.items : null;
    const total = typeof params === 'object' ? params?.total : null;
    const subtotal = typeof params === 'object' ? params?.subtotal : null;
    const savings = typeof params === 'object' ? params?.savings : null;
    const token = (typeof params === 'object' && params?.token) ? params.token : getStoredSessionToken();

    const activeSessionId = sessionId || getOrCreateSessionId();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        session_id: activeSessionId,
        user_id: userId || 'user_1',
        address,
        payment_method: paymentMethod,
        delivery_type: deliveryType,
        items,
        total,
        subtotal,
        savings
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error = new Error(err.detail || err.message || HTTP );
      error.status = res.status;
      throw error;
    }
    return await res.json();
  } catch (error) {
    console.error('[apiService] Erro no checkout backend:', error);
    throw error;
  }
}

// ====================================================================
// AUTENTICAÇÃO E USUÁRIOS NO BACKEND (Cadastro, Login, Perfil, Logout)
// ====================================================================

/**
 * Realiza Login no backend FastAPI (persiste em users.json)
 */
export async function loginBackend({ identifier, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.detail || data.error || 'Erro ao realizar login'
      };
    }
    return data;
  } catch (error) {
    console.warn('[apiService] Falha ao conectar ao backend /auth/login:', error);
    return {
      success: false,
      error: 'Servidor backend indisponível. Tentando modo de contingência local...'
    };
  }
}

/**
 * Realiza Cadastro Real de novo usuário no backend FastAPI
 */
export async function registerBackend({ name, email, cpf, phone, birthDate, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, cpf, phone, birthDate, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.detail || data.error || 'Erro ao realizar cadastro'
      };
    }
    return data;
  } catch (error) {
    console.warn('[apiService] Falha ao conectar ao backend /auth/register:', error);
    return {
      success: false,
      error: 'Servidor backend indisponível para registro. Tentando contingência...'
    };
  }
}

/**
 * Realiza Logout no backend FastAPI
 */
export async function logoutBackend(userIdOrSession = null) {
  try {
    const activeToken = getStoredSessionToken();
    const headers = { 'Content-Type': 'application/json' };
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        session_id: getOrCreateSessionId(),
        user_id: userIdOrSession || null
      })
    });
    return await res.json().catch(() => ({ success: true }));
  } catch (error) {
    console.warn('[apiService] Erro no logout backend:', error);
    return { success: true };
  }
}

/**
 * Obtém perfil do usuário do backend
 */
export async function fetchUserProfileBackend(userId = 'user_1') {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao carregar perfil do backend:', error);
    return null;
  }
}

/**
 * Atualiza dados do perfil do usuário no backend FastAPI
 */
export async function updateUserProfileBackend(profileData) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao atualizar perfil no backend:', error);
    return null;
  }
}

// ====================================================================
// ARMAZENAMENTO DE DADOS DA CÂMERA E RECEITAS MÉDICAS NO BACKEND
// ====================================================================

/**
 * Salva a captura da câmera, OCR e laudo farmacêutico no backend FastAPI
 */
export async function saveCameraCaptureBackend({
  sessionId = null,
  userId = null,
  photoData = {}
}) {
  try {
    const activeSessionId = sessionId || getOrCreateSessionId();
    const analysis = photoData.analysisResult || {};
    const isPrescription = photoData.type === 'prescription' || photoData.intent === 'prescription' || Boolean(analysis.requiresPrescription);

    const payload = {
      session_id: activeSessionId,
      user_id: userId || 'user_1',
      type: isPrescription ? 'prescription' : (photoData.type || 'photo'),
      name: photoData.name || (analysis.detectedMedication ? `${analysis.detectedMedication}.jpg` : 'captura_camera.jpg'),
      preview_url: photoData.previewUrl || photoData.preview_url || null,
      intent: photoData.intent || analysis.intent || (isPrescription ? 'prescription' : 'generic'),
      detected_medication: analysis.detectedMedication || photoData.detectedMedication || photoData.name,
      brand: analysis.brand || photoData.brand,
      active_principle: analysis.activePrinciple,
      dosage: analysis.dosage,
      category: analysis.category,
      requires_prescription: Boolean(isPrescription),
      raw_text: photoData.rawText || analysis.rawText,
      doctor_name: analysis.prescriptionData?.doctor || null,
      crm: analysis.prescriptionData?.doctor || null,
      savings_pct: typeof analysis.savingsPct === 'number' ? analysis.savingsPct : null,
      equivalent_generic: analysis.equivalentGeneric || null,
      generic_price: typeof analysis.genericPrice === 'number' ? analysis.genericPrice : null,
      reference_price: typeof analysis.referencePrice === 'number' ? analysis.referencePrice : null,
      notes: analysis.actionText || analysis.usageAdvice || null
    };

    const res = await fetch(`${API_BASE_URL}/camera/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('[apiService] Erro ao salvar captura de câmera no backend:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Busca histórico de fotos/capturas da câmera no backend
 */
export async function fetchCameraCapturesBackend({ userId = null, sessionId = null } = {}) {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (sessionId) params.append('session_id', sessionId);
    const res = await fetch(`${API_BASE_URL}/camera/captures?${params.toString()}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao buscar capturas de câmera no backend:', error);
    return [];
  }
}

/**
 * Busca receitas médicas salvas no backend
 */
export async function fetchPrescriptionsBackend({ userId = null, sessionId = null, token = null } = {}) {
  try {
    const activeToken = token || getStoredSessionToken();
    const headers = {};
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (sessionId) params.append('session_id', sessionId);
    const res = await fetch(`${API_BASE_URL}/camera/prescriptions?${params.toString()}`, { headers });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao carregar receitas do backend:', error);
    return [];
  }
}

/**
 * Exclui uma captura da câmera no backend
 */
export async function deleteCameraCaptureBackend(captureId) {
  try {
    const res = await fetch(`${API_BASE_URL}/camera/captures/${captureId}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (error) {
    console.warn('[apiService] Erro ao deletar captura no backend:', error);
    return false;
  }
}

// ====================================================================
// HISTÓRICO DE PEDIDOS E COMPRAS DO CLIENTE NO BACKEND
// ====================================================================

/**
 * Busca histórico real de pedidos no backend
 */
export async function fetchUserOrdersBackend({ userId = null, sessionId = null, token = null } = {}) {
  try {
    const activeToken = token || getStoredSessionToken();
    const headers = {};
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (sessionId) params.append('session_id', sessionId);
    const res = await fetch(`${API_BASE_URL}/orders?${params.toString()}`, { headers });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao buscar pedidos no backend:', error);
    return [];
  }
}


/**
 * Recupera o token de sessão ativa armazenado no navegador
 */
export function getStoredSessionToken() {
  try {
    const raw = localStorage.getItem('paguemenos_session');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

/**
 * Atualiza quantidade de um item no carrinho do backend
 */
export async function updateCartItemQuantityBackend({ sessionId = null, productId, quantidade }) {
  try {
    const activeSessionId = sessionId || getOrCreateSessionId();
    const res = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: activeSessionId,
        quantidade: Number(quantidade)
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao sincronizar quantidade no carrinho backend:', error);
    return null;
  }
}

/**
 * Remove item do carrinho no backend
 */
export async function removeCartItemBackend({ sessionId = null, productId }) {
  try {
    const activeSessionId = sessionId || getOrCreateSessionId();
    const res = await fetch(`${API_BASE_URL}/cart/items/${productId}?session_id=${encodeURIComponent(activeSessionId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('[apiService] Erro ao remover item do carrinho backend:', error);
    return null;
  }
}

/**
 * Baixa com segurança imagem de receita médica protegida usando cabeçalho de autenticação
 * e converte para Object URL (Blob) para renderização segura em tags <img>
 */
export async function fetchProtectedPrescriptionBlob(imageUrl, token = null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  const sessionToken = token || getStoredSessionToken();
  const fullUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  try {
    const res = await fetch(fullUrl, {
      headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}
    });
    if (!res.ok) {
      console.warn(`[apiService] Falha ao carregar receita protegida: HTTP ${res.status}`);
      return null;
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('[apiService] Erro ao carregar blob de receita:', err);
    return null;
  }
}


/**
 * Pesquisa Semântica com IA no backend (RAG vetorial + similaridade clínica de sintomas)
 */
export async function searchProductsSemantic({
  query = '',
  categoria = null,
  apenas_disponiveis = true,
  limite = 50,
  preferGenerics = false,
  maxPrice = null
} = {}) {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (categoria && categoria !== 'all') params.append('categoria', categoria);
    if (apenas_disponiveis !== undefined) params.append('apenas_disponiveis', String(apenas_disponiveis));
    if (limite) params.append('limite', String(limite));
    if (preferGenerics) params.append('prefer_generics', 'true');
    if (maxPrice) params.append('max_price', String(maxPrice));

    const res = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    return (Array.isArray(list) ? list : []).map(normalizeProduct);
  } catch (err) {
    console.warn('[apiService] Falha na busca semântica, usando fallback regular:', err);
    return await fetchProducts({ categoria, apenas_disponiveis, limite });
  }
}

/**
 * Envia imagem e metadados para Visão Farmacêutica com IA no backend FastAPI (/camera/analyze)
 */
export async function analyzeCameraImageBackend({
  image = null,
  filename = 'captura.jpg',
  ocrText = '',
  intent = 'generic',
  sessionId = null,
  userId = null
} = {}) {
  try {
    const activeSessionId = sessionId || getOrCreateSessionId();
    const res = await fetch(`${API_BASE_URL}/camera/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        image,
        filename,
        ocr_text: ocrText,
        intent,
        session_id: activeSessionId,
        user_id: userId || 'user_1'
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('[apiService] Falha ao contatar /camera/analyze do backend:', error);
    return null;
  }
}
