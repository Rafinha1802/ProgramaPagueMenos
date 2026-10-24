import React, { useState } from 'react';
import { DesktopAiResponsePage } from './components/DesktopAiResponsePage';
import { DesktopHomePage } from './components/DesktopHomePage';
import { DesktopAuthPage } from './components/DesktopAuthPage';
import { Header as DesktopHeader } from './components/Header';
import { Footer as DesktopFooter } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SafetyModal } from './components/SafetyModal';
import { UserProfilePage } from './components/UserProfilePage';
import { StoresModal, AppDownloadModal, HelpModal, CepLocationModal } from './components/SiteNavigationModals';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { runAiCommerceEngine } from './services/aiCommerceEngine';
import { CATALOG } from './data/catalog';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  // Navegação de Páginas no Desktop Web: 'home' vs 'ai-response' vs 'auth' vs 'profile'
  const [desktopPage, setDesktopPage] = useState('home');
  const [desktopAuthMode, setDesktopAuthMode] = useState('login');

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

  // Carrinho de Compras
  const [cartItems, setCartItems] = useState([
    {
      product: CATALOG.find(p => p.id === 'pm-nivea-sun') || CATALOG[0],
      quantity: 1,
      source: 'traditional'
    }
  ]);

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

  // Sessão de Usuário e Autenticação (Login / Cadastro)
  const [userSession, setUserSession] = useState({
    isLoggedIn: true,
    name: 'Rafaella Guedes',
    email: 'rafaella.guedes@email.com',
    cpf: '458.912.384-12',
    phone: '(11) 98765-4321'
  });

  const handleLogin = (userData) => {
    setUserSession({
      ...userData,
      isLoggedIn: true
    });
    showToast(`Bem-vindo de volta, ${userData.name.split(' ')[0]}!`);
  };

  const handleRegister = (userData) => {
    setUserSession({
      ...userData,
      isLoggedIn: true
    });
    showToast(`Cadastro realizado com sucesso! Cupom de R$ 15 OFF ativado.`);
  };

  const handleLogout = () => {
    setUserSession({
      isLoggedIn: false,
      name: '',
      email: '',
      cpf: '',
      phone: ''
    });
    showToast('Você saiu da sua conta.');
  };

  // Acionar recomendação a partir de Preset
  const handleSelectPreset = (presetOption) => {
    const config = {
      prompt: presetOption.prompt,
      budget: presetOption.budget,
      customSelectedIds: presetOption.targetProductIds,
      preferGenerics: false
    };
    setActiveEngineConfig(config);

    const result = runAiCommerceEngine(config);
    setAiRecommendation(result);
    setDesktopPage('ai-response');
  };

  // Acionar recomendação a partir de texto livre / chat / anexo
  const handleSelectCustomPrompt = (promptText, optionalBudget = null, preferGenerics = false, attachment = null) => {
    const config = {
      prompt: promptText,
      budget: optionalBudget ? parseFloat(optionalBudget) : null,
      preferGenerics: preferGenerics || false,
      attachment: attachment || null
    };
    setActiveEngineConfig(config);

    const result = runAiCommerceEngine(config);
    setAiRecommendation(result);
    setDesktopPage('ai-response');
  };

  // Foto confirmada da câmera
  const handleCameraPhotoConfirmed = (photoData) => {
    let prompt = '';
    if (photoData.intent === 'generic') {
      prompt = `Encontrar genérico equivalente mais barato do medicamento ${photoData.detectedMedication || photoData.name}`;
    } else if (photoData.intent === 'repurchase') {
      prompt = `Recomprar medicamento ${photoData.detectedMedication || photoData.name}`;
    } else {
      prompt = `Medicamentos prescritos na receita médica ${photoData.name}`;
    }
    handleSelectCustomPrompt(prompt, null, photoData.intent === 'generic', photoData);
  };

  // Atualizar parâmetros do motor (troca de item, genéricos, orçamentos)
  const handleUpdateEngine = (newParams) => {
    const updatedConfig = {
      ...activeEngineConfig,
      ...newParams
    };
    setActiveEngineConfig(updatedConfig);

    const result = runAiCommerceEngine(updatedConfig);
    setAiRecommendation(result);
  };

  // Adicionar item avulso ao carrinho
  const handleAddToCart = (product, source = 'traditional') => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, source }];
    });
    showToast(`"${product.name.slice(0, 24)}..." adicionado à sacola!`);
  };

  // Adicionar Cesta ou Produtos Selecionados da IA ao Carrinho
  const handleAddBatchToCart = (products) => {
    setCartItems((prev) => {
      let updated = [...prev];
      products.forEach((itemOrProd) => {
        const prod = itemOrProd.product || itemOrProd;
        const qtyToAdd = itemOrProd.quantity ? Math.max(1, itemOrProd.quantity) : 1;
        const existingIndex = updated.findIndex((i) => i.product.id === prod.id);
        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qtyToAdd,
            source: 'ai'
          };
        } else {
          updated.push({ product: prod, quantity: qtyToAdd, source: 'ai' });
        }
      });
      return updated;
    });
    showToast(`${products.length} produto(s) selecionado(s) adicionado(s) à sua sacola!`);
  };

  // Atualizar quantidade no carrinho
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Remover item do carrinho
  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.clubPrice * item.quantity, 0);

  return (
    <div style={{
      minHeight: '100vh',
      height: desktopPage === 'auth' ? '100vh' : 'auto',
      maxHeight: desktopPage === 'auth' ? '100vh' : 'none',
      overflow: desktopPage === 'auth' ? 'hidden' : 'visible',
      backgroundColor: desktopPage === 'auth' ? '#F8FAFC' : '#FFFFFF',
      position: 'relative'
    }}>
      {/* TELA DE LOGIN / CADASTRO: TELA CHEIA IMERSIVA (100vw x 100vh) */}
      {desktopPage === 'auth' ? (
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
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Completo com Entrega Turbo e Compliance ANVISA */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCompleteOrder={() => setCartItems([])}
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
