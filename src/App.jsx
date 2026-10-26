import React, { useState, useEffect } from 'react';
import { DesktopAiResponsePage } from './components/DesktopAiResponsePage';
import { DesktopHomePage } from './components/DesktopHomePage';
import { DesktopAuthPage } from './components/DesktopAuthPage';
import { Header as DesktopHeader } from './components/Header';
import { Footer as DesktopFooter } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DesktopCheckoutPage } from './components/DesktopCheckoutPage';
import { SafetyModal } from './components/SafetyModal';
import { UserProfilePage } from './components/UserProfilePage';
import { StoresModal, AppDownloadModal, HelpModal, CepLocationModal } from './components/SiteNavigationModals';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { runAiCommerceEngine, runAiCommerceEngineAsync, setCachedCatalogProducts } from './services/aiCommerceEngine';
import { fetchProducts, checkBackendHealth, addCartItemBackend, checkoutBackend, saveCameraCaptureBackend, updateCartItemQuantityBackend, removeCartItemBackend } from './services/api';
import { getStoredSession, saveStoredSession, logoutUser } from './services/authService';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  // Navegação de Páginas no Desktop Web: 'home' vs 'ai-response' vs 'auth' vs 'profile' vs 'checkout'
  const [desktopPage, setDesktopPage] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/checkout') {
      return 'checkout';
    }
    return 'home';
  });
  const [desktopAuthMode, setDesktopAuthMode] = useState('login');

  // Sincronizar URL do navegador com a página ativa
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const targetPath = desktopPage === 'checkout' ? '/checkout' : desktopPage === 'auth' ? '/auth' : desktopPage === 'profile' ? '/profile' : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, [desktopPage]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/checkout') setDesktopPage('checkout');
      else if (path === '/auth') setDesktopPage('auth');
      else if (path === '/profile') setDesktopPage('profile');
      else setDesktopPage('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Modais de Navegação do Site e CEP
  const [isStoresModalOpen, setIsStoresModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCepModalOpen, setIsCepModalOpen] = useState(false);
  const [userLocationCep, setUserLocationCep] = useState('01310-200');

  // Modal de Câmera / Upload para Receita ou Caixa de Medicamento
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // Estado do Chatbot Flutuante Interativo (Farmacêutica IA Sofia)
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  // Estados de Busca e Categorias
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Produtos carregados dinamicamente do back_PagueMenos
  const [products, setProducts] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Carrinho de Compras
  const [cartItems, setCartItems] = useState([]);

  // Carregar produtos e verificar integridade com o backend FastAPI ao iniciar
  useEffect(() => {
    let isMounted = true;
    async function loadBackendCatalog() {
      try {
        const health = await checkBackendHealth();
        if (isMounted) {
          setBackendStatus({ online: health.online, checking: false, details: health.data });
        }

        const backendProds = await fetchProducts({ limite: 500 });
        if (isMounted && Array.isArray(backendProds) && backendProds.length > 0) {
          setProducts(backendProds);
          setCachedCatalogProducts(backendProds);
        }
      } catch (err) {
        console.warn('[App] Não foi possível carregar produtos do back_PagueMenos:', err);
        if (isMounted) {
          setBackendStatus({ online: false, checking: false, error: err.message });
        }
      }
    }
    loadBackendCatalog();
    return () => { isMounted = false; };
  }, []);

  // Motor e Recomendação da Farmacêutica IA
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [activeEngineConfig, setActiveEngineConfig] = useState({});

  // Modais
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Toast de Feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sessão de Usuário e Autenticação (Login / Cadastro Reais com Persistência)
  const [userSession, setUserSession] = useState(() => {
    return getStoredSession() || {
      isLoggedIn: true,
      name: 'Rafaella Guedes',
      email: 'rafaella.guedes@email.com',
      cpf: '458.912.384-12',
      phone: '(11) 98765-4321'
    };
  });

  const handleLogin = (userData) => {
    const updated = {
      ...userData,
      isLoggedIn: true
    };
    saveStoredSession(updated);
    setUserSession(updated);
    showToast(`Bem-vindo(a) de volta, ${userData.name.split(' ')[0]}!`);
  };

  const handleRegister = (userData) => {
    const updated = {
      ...userData,
      isLoggedIn: true
    };
    saveStoredSession(updated);
    setUserSession(updated);
    showToast(`Cadastro realizado com sucesso, ${userData.name.split(' ')[0]}! Cupom de R$ 15 OFF ativado.`);
  };

    const handleLogout = async () => {
    const loggedOut = await logoutUser(userSession?.token || userSession?.id);
    setUserSession(loggedOut);
    setDesktopPage('home');
    showToast('Você saiu da sua conta.');
  };

  // Acionar recomendação a partir de Preset conectando ao backend
  const handleSelectPreset = async (presetOption) => {
    const config = {
      prompt: presetOption.prompt,
      budget: presetOption.budget,
      customSelectedIds: presetOption.targetProductIds,
      preferGenerics: false,
      sessionId: userSession?.email || 'desktop-session'
    };
    setActiveEngineConfig(config);
    setIsAiLoading(true);
    setDesktopPage('ai-response');

    try {
      const result = await runAiCommerceEngineAsync(config);
      setAiRecommendation(result);
    } catch {
      const fallback = runAiCommerceEngine(config);
      setAiRecommendation(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Acionar recomendação a partir de texto livre / chat / anexo com fetch no back_PagueMenos
  const handleSelectCustomPrompt = async (promptText, optionalBudget = null, preferGenerics = false, attachment = null) => {
    const config = {
      prompt: promptText,
      budget: optionalBudget ? parseFloat(optionalBudget) : null,
      preferGenerics: preferGenerics || false,
      attachment: attachment || null,
      sessionId: userSession?.email || 'desktop-session'
    };
    setActiveEngineConfig(config);
    setIsAiLoading(true);
    setDesktopPage('ai-response');

    try {
      const result = await runAiCommerceEngineAsync(config);
      if (attachment) {
        result.attachment = attachment;
      }
      setAiRecommendation(result);
    } catch {
      const fallback = runAiCommerceEngine(config);
      if (attachment) {
        fallback.attachment = attachment;
      }
      setAiRecommendation(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Foto confirmada da câmera com análise e extração da IA
  const handleCameraPhotoConfirmed = async (photoData) => {
    try {
      await saveCameraCaptureBackend({
        userId: userSession?.id || 'user_1',
        photoData: photoData
      });
    } catch (e) {
      console.warn('Aviso: falha ao sincronizar câmera com backend:', e);
    }
    const analysis = photoData.analysisResult;
    const medName = analysis?.detectedMedication || photoData.detectedMedication || photoData.name;
    const isGeneric = photoData.intent === 'generic';

    let prompt = '';
    if (isGeneric && analysis?.equivalentGeneric) {
      prompt = `Encontrar genérico equivalente mais barato de ${medName}: ${analysis.equivalentGeneric}`;
    } else if (photoData.intent === 'repurchase') {
      prompt = `Recomprar medicamento ${medName}`;
    } else if (photoData.intent === 'prescription') {
      prompt = `Receita médica digital identificada para ${medName}`;
    } else {
      prompt = `Medicamento identificado na foto: ${medName}`;
    }

    showToast(`📸 Foto analisada com sucesso: ${medName}`);
    handleSelectCustomPrompt(prompt, null, isGeneric, photoData);
  };

  // Atualizar parâmetros do motor (troca de item, genéricos, orçamentos) via API
  const handleUpdateEngine = async (newParams) => {
    const updatedConfig = {
      ...activeEngineConfig,
      ...newParams,
      sessionId: userSession?.email || 'desktop-session'
    };
    setActiveEngineConfig(updatedConfig);
    setIsAiLoading(true);

    try {
      const result = await runAiCommerceEngineAsync(updatedConfig);
      setAiRecommendation(result);
    } catch {
      const fallback = runAiCommerceEngine(updatedConfig);
      setAiRecommendation(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Adicionar item avulso ao carrinho com validação no backend (ANVISA 403)
  const handleAddToCart = async (product, source = 'traditional') => {
    // Trava de segurança sanitária: produtos com receita exigem prescrição
    if (product.requiresPrescription) {
      showToast('⛔ Bloqueio ANVISA: Medicamento exige receita médica e retenção.');
      return;
    }

    try {
      await addCartItemBackend({ productId: product.id, quantidade: 1 });
    } catch (err) {
      if (err.status === 403 || (err.detail && err.detail.includes('receita'))) {
        showToast(`⛔ Bloqueio ANVISA: ${err.detail || 'Produto exige receita médica e não pode ser vendido por este canal'}`);
        return;
      }
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.product.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.product.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, source }];
    });
    showToast(`"${product.name.slice(0, 24)}..." adicionado à sacola!`);
  };

  // Adicionar Cesta ou Produtos Selecionados da IA ao Carrinho com validação sanitária
  const handleAddBatchToCart = async (productsToAdd) => {
    let addedCount = 0;
    let blockedCount = 0;

    for (const itemOrProd of productsToAdd) {
      const prod = itemOrProd.product || itemOrProd;
      const qty = itemOrProd.quantity ? Math.max(1, itemOrProd.quantity) : 1;

      if (prod.requiresPrescription) {
        blockedCount++;
        continue;
      }

      try {
        await addCartItemBackend({ productId: prod.id, quantidade: qty });
        setCartItems((prev) => {
          const existingIndex = prev.findIndex((i) => String(i.product.id) === String(prod.id));
          if (existingIndex > -1) {
            return prev.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + qty, source: 'ai' }
                : item
            );
          }
          return [...prev, { product: prod, quantity: qty, source: 'ai' }];
        });
        addedCount++;
      } catch (err) {
        if (err.status === 403) {
          blockedCount++;
        }
      }
    }

    if (blockedCount > 0) {
      showToast(`⚠️ ${blockedCount} medicamento(s) com retenção de receita bloqueado(s) pelas regras ANVISA.`);
    } else if (addedCount > 0) {
      showToast(`${addedCount} produto(s) adicionado(s) à sua sacola!`);
    }
  };

  // Atualizar quantidade no carrinho com sincronização bidirecional no back_PagueMenos
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      removeCartItemBackend({ productId }).catch((e) => console.warn(e));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
    updateCartItemQuantityBackend({ productId, quantidade: newQty }).catch((e) => console.warn(e));
  };

  // Remover item do carrinho com sincronização no back_PagueMenos
  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    removeCartItemBackend({ productId }).catch((e) => console.warn(e));
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product?.clubPrice || item.product?.price || 0) * item.quantity, 0);

  return (
    <div style={{
      minHeight: '100vh',
      height: desktopPage === 'auth' ? '100vh' : 'auto',
      maxHeight: desktopPage === 'auth' ? '100vh' : 'none',
      overflow: desktopPage === 'auth' ? 'hidden' : 'visible',
      backgroundColor: desktopPage === 'auth' ? '#F8FAFC' : '#FFFFFF',
      position: 'relative'
    }}>
      {/* TELA DE CHECKOUT: FINALIZAÇÃO DE COMPRA DEDICADA */}
      {desktopPage === 'checkout' ? (
        <DesktopCheckoutPage
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCompleteOrder={async (checkoutData) => {
            try {
              const res = await checkoutBackend({
                userId: (userSession && userSession.isLoggedIn) ? userSession.id : null,
                address: checkoutData?.address || (userSession?.address || 'Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP'),
                paymentMethod: checkoutData?.paymentMethod || 'Pix à Vista',
                deliveryType: checkoutData?.deliveryType || 'Entrega Turbo Express (45 min)',
                items: checkoutData?.items || cartItems.map((i) => ({
                  id: i.product?.id,
                  name: i.product?.name,
                  quantity: i.quantity,
                  price: i.product?.clubPrice || i.product?.price
                })),
                total: checkoutData?.total,
                subtotal: checkoutData?.subtotal,
                savings: checkoutData?.savings,
                token: userSession?.token
              });
              setCartItems([]);
              showToast('Pedido registrado com sucesso no back_PagueMenos!');
              return res;
            } catch (e) {
              console.warn('Concluindo pedido no modo seguro:', e);
              setCartItems([]);
              showToast('Pedido simulado e registrado com sucesso!');
              return { pedido_id: 'FV-' + Math.floor(100000 + Math.random() * 900000) };
            }
          }}
          onBackToStore={() => setDesktopPage('home')}
          onGoToProfile={() => setDesktopPage('profile')}
          userSession={userSession}
          onShowToast={showToast}
        />
      ) : desktopPage === 'auth' ? (
        <DesktopAuthPage
          initialMode={desktopAuthMode}
          userSession={userSession}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
          onBackToStore={() => setDesktopPage('home')}
          onOpenProfile={() => setDesktopPage('profile')}
        />
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
          {/* Header Completo Desktop */}
          <DesktopHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onPerformSearch={(query) => {
              const q = (typeof query === 'string' && query.trim()) ? query.trim() : searchQuery.trim();
              if (q) {
                handleSelectCustomPrompt(q);
              }
            }}
            cartItemsCount={cartItemsCount}
            cartTotal={cartTotal}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAiGuide={(customPrompt) => {
              const promptToUse = (typeof customPrompt === 'string' && customPrompt.trim())
                ? customPrompt.trim()
                : (searchQuery.trim() || 'Produtos de primeiros socorros e alívio de dor para viagem');
              handleSelectCustomPrompt(promptToUse);
            }}
            onOpenCamera={() => setIsCameraModalOpen(true)}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
            userSession={userSession}
            onOpenAuth={(mode = 'login') => {
              setDesktopAuthMode(mode);
              setDesktopPage('auth');
            }}
            onOpenProfile={() => setDesktopPage('profile')}
            onGoHome={() => setDesktopPage('home')}
            onOpenStoresModal={() => setIsStoresModalOpen(true)}
            onOpenAppModal={() => setIsAppModalOpen(true)}
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
            onOpenCepModal={() => setIsCepModalOpen(true)}
            userLocationCep={userLocationCep}
            backendStatus={backendStatus}
            catalogProducts={products}
            onAddToCart={(prod) => handleAddToCart(prod, 'traditional')}
          />

          {/* PÁGINA A: HOME DO SITE */}
          {desktopPage === 'home' && (
            <DesktopHomePage
              activeCategory={activeCategory}
              onSelectCategory={(catId) => setActiveCategory(catId)}
              onAddToCart={(prod) => handleAddToCart(prod, 'traditional')}
              onOpenAiWithPrompt={(prompt, budget, preferGen, attach) => handleSelectCustomPrompt(prompt, budget, preferGen, attach)}
              onOpenCart={() => setIsCartOpen(true)}
              aiRecommendation={aiRecommendation}
              onOpenPrescriptionFlow={() => setIsCameraModalOpen(true)}
              onShowToast={showToast}
              onOpenAuth={(mode = 'login') => {
                setDesktopAuthMode(mode);
                setDesktopPage('auth');
              }}
              products={products}
              backendStatus={backendStatus}
              isAiLoading={isAiLoading}
            />
          )}

          {/* PÁGINA B: RESPOSTA DEDICADA DA IA NO SITE DESKTOP */}
          {desktopPage === 'ai-response' && (
            <DesktopAiResponsePage
              recommendation={aiRecommendation}
              onUpdateEngine={handleUpdateEngine}
              onAddToCart={(prod, openCart = true) => {
                handleAddToCart(prod, 'ai');
                if (openCart) setIsCartOpen(true);
              }}
              onAddBatchToCart={(prods, openCart = true) => {
                handleAddBatchToCart(prods);
                if (openCart) setIsCartOpen(true);
              }}
              onBackToStore={() => setDesktopPage('home')}
              onOpenCart={() => setIsCartOpen(true)}
              cartItemsCount={cartItemsCount}
              onOpenCamera={() => setIsCameraModalOpen(true)}
              products={products}
              isAiLoading={isAiLoading}
              userSession={userSession}
            />
          )}

          {/* PÁGINA C: PERFIL E HISTÓRICO DE COMPRAS */}
          {desktopPage === 'profile' && (
            <UserProfilePage
              userSession={userSession}
              onLogout={handleLogout}
              onBackToStore={() => setDesktopPage('home')}
              onAddToCart={(prod) => handleAddToCart(prod, 'traditional')}
              onShowToast={showToast}
              onOpenPrescriptionFlow={() => setIsCameraModalOpen(true)}
              isMobile={false}
            />
          )}

          {/* Rodapé Oficial Pague Menos */}
          <DesktopFooter />

          {/* Chatbot Flutuante Interativo (Farmacêutica IA) no Site Desktop */}
          {desktopPage !== 'auth' && desktopPage !== 'ai-response' && (
            <ChatbotWidget
              isOpen={isChatWidgetOpen}
              onToggle={() => setIsChatWidgetOpen((prev) => !prev)}
              onClose={() => setIsChatWidgetOpen(false)}
              onAddToCart={(prod) => handleAddToCart(prod, 'ai')}
              onAddBatchToCart={handleAddBatchToCart}
              cartItems={cartItems}
              cartItemsCount={cartItemsCount}
              cartTotal={cartTotal}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenCamera={() => setIsCameraModalOpen(true)}
              onShowToast={showToast}
              userSession={userSession}
              isMobile={false}
              onNavigateToFullPage={(result) => {
                if (result) setAiRecommendation(result);
                setDesktopPage('ai-response');
                setIsChatWidgetOpen(false);
              }}
            />
          )}
        </div>
      )}

      {/* ====================================================================
          MODAIS E DRAWERS COMPARTILHADOS
          ==================================================================== */}
      {/* Gaveta do Carrinho */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setDesktopPage('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAddSampleItems={() => {
          const sample = [
            {
              product: {
                id: 'prod_dipirona_ems',
                name: 'Dipirona Monoidratada 500mg 10 Comprimidos Genérico EMS',
                brand: 'EMS Genéricos',
                category: 'Medicamentos',
                price: 7.90,
                clubPrice: 4.89,
                originalPrice: 11.90,
                image: '/products/dipirona-ems.jpg',
                requiresPrescription: false
              },
              quantity: 2,
              source: 'ai'
            },
            {
              product: {
                id: 'prod_dorflex_36',
                name: 'Dorflex Analgésico e Relaxante Muscular 36 Comprimidos',
                brand: 'Sanofi',
                category: 'Medicamentos',
                price: 24.90,
                clubPrice: 19.80,
                originalPrice: 28.50,
                image: '/products/dorflex.jpg',
                requiresPrescription: false
              },
              quantity: 1,
              source: 'traditional'
            }
          ];
          setCartItems(sample);
          setIsCartOpen(false);
          setDesktopPage('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast('Cesta adicionada! Redirecionando para o pagamento.');
        }}
      />

      {/* Checkout Completo com Entrega Turbo e Compliance ANVISA */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCompleteOrder={async (checkoutData) => {
          try {
            const res = await checkoutBackend({
              userId: (userSession && userSession.isLoggedIn) ? userSession.id : null,
              address: checkoutData?.address || (userSession?.address || 'Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP'),
              paymentMethod: checkoutData?.paymentMethod || 'Pix à Vista',
              deliveryType: checkoutData?.deliveryType || 'Entrega Turbo Express (45 min)'
            });
            setCartItems([]);
            showToast('Pedido simulado e registrado com sucesso no back_PagueMenos!');
            return res;
          } catch (e) {
            console.error('Erro no checkout backend:', e);
            showToast(`Falha no checkout: ${e.message || 'Erro ao processar pedido'}`);
            throw e;
          }
        }}
      />

      {/* Modal de Compliance e Regras Farmacêuticas */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      {/* Modal de Câmera / Upload para Medicamento ou Receita */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onConfirmPhoto={handleCameraPhotoConfirmed}
      />

      {/* Modal de Nossas Lojas Pague Menos */}
      <StoresModal
        isOpen={isStoresModalOpen}
        onClose={() => setIsStoresModalOpen(false)}
        onSelectStore={(st) => showToast(`Loja selecionada para retirada em 1h: ${st.name}`)}
      />

      {/* Modal Baixe Nosso App */}
      <AppDownloadModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
      />

      {/* Modal Central de Atendimento / Ajuda */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Modal de CEP / Localização */}
      <CepLocationModal
        isOpen={isCepModalOpen}
        onClose={() => setIsCepModalOpen(false)}
        onSaveCep={(c) => {
          setUserLocationCep(c);
          showToast(`CEP atualizado para ${c}! Frete Grátis e Entrega Turbo ativados.`);
        }}
      />

      {/* Notificação Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.85rem'
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
