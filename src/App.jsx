import React, { useState, useEffect } from 'react';
import { MobileAppHeader } from './components/MobileAppHeader';
import { AppActionCards } from './components/AppActionCards';
import { AppPromoBanners } from './components/AppPromoBanners';
import { AppCategories } from './components/AppCategories';
import { AppProductGrid } from './components/AppProductGrid';
import { AppBottomNav } from './components/AppBottomNav';
import { AiChatResponseScreen } from './components/AiChatResponseScreen';
import { DesktopAiResponsePage } from './components/DesktopAiResponsePage';
import { DesktopHomePage } from './components/DesktopHomePage';
import { Header as DesktopHeader } from './components/Header';
import { TraditionalCatalog } from './components/TraditionalCatalog';
import { Footer as DesktopFooter } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SafetyModal } from './components/SafetyModal';
import { runAiCommerceEngine } from './services/aiCommerceEngine';
import { CATALOG } from './data/catalog';
import { Smartphone, Monitor, CheckCircle2, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Signal, Wifi, BatteryMedium, X } from 'lucide-react';

export function App() {
  // 1. Alternador de Plataforma: 'mobile' (App iPhone) vs 'desktop' (Site Web Completo)
  const [platformMode, setPlatformMode] = useState('mobile');

  // 2. Navegação de Telas no Mobile: 'home' vs 'ai-response'
  const [mobileScreen, setMobileScreen] = useState('home');

  // 3. Navegação de Páginas no Desktop: 'home' vs 'ai-response'
  const [desktopPage, setDesktopPage] = useState('home');

  // Estados do Chatbot Flutuante no Mobile (como no site)
  const [isMobileFabOpen, setIsMobileFabOpen] = useState(true);
  const [mobileBubbleIndex, setMobileBubbleIndex] = useState(0);

  const mobileBubbleMessages = [
    "Olá! Posso te ajudar a montar sua cesta ou encontrar genéricos?",
    "Precisa de protetor para a praia ou alívio de gripe e dor?",
    "Economize até 95% trocando por genéricos aprovados pela ANVISA!",
    "Envie sua dúvida ou receita médica para nossa Farmacêutica IA."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileBubbleIndex((prev) => (prev + 1) % mobileBubbleMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // 4. Estados Compartilhados de Busca e Categorias
  const [activeNav, setActiveNav] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 5. Carrinho Compartilhado
  const [cartItems, setCartItems] = useState([
    {
      product: CATALOG.find(p => p.id === 'pm-nivea-sun') || CATALOG[0],
      quantity: 1,
      source: 'traditional'
    }
  ]);

  // 6. Motor e Recomendação da Farmacêutica IA
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [activeEngineConfig, setActiveEngineConfig] = useState({});

  // 7. Modais e Gavetas
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // 8. Toast de Feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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

    // Navega para a outra tela dedicada da IA
    setMobileScreen('ai-response');
    setDesktopPage('ai-response');
    setActiveNav('ai-chat');
  };

  // Acionar recomendação a partir de texto livre / chat
  const handleSelectCustomPrompt = (promptText, optionalBudget = null, preferGenerics = false) => {
    const config = {
      prompt: promptText,
      budget: optionalBudget ? parseFloat(optionalBudget) : null,
      preferGenerics: preferGenerics || false
    };
    setActiveEngineConfig(config);

    const result = runAiCommerceEngine(config);
    setAiRecommendation(result);

    // Navega para a tela de resposta dedicada
    setMobileScreen('ai-response');
    setDesktopPage('ai-response');
    setActiveNav('ai-chat');
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

  // Adicionar Cesta Completa da IA
  const handleAddBatchToCart = (products) => {
    setCartItems((prev) => {
      let updated = [...prev];
      products.forEach((prod) => {
        const existingIndex = updated.findIndex((i) => i.product.id === prod.id);
        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
            source: 'ai'
          };
        } else {
          updated.push({ product: prod, quantity: 1, source: 'ai' });
        }
      });
      return updated;
    });
    showToast(`Cesta com ${products.length} itens adicionada à sua sacola!`);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#E2E8F0', position: 'relative' }}>

      {/* ====================================================================
          BARRA FLUTUANTE DE ALTERNÂNCIA: [📱 App Mobile] vs [💻 Site Desktop]
          ==================================================================== */}
      <div className="platform-switcher-bar">
        <button
          onClick={() => setPlatformMode('mobile')}
          className={`platform-switch-btn ${platformMode === 'mobile' ? 'active' : ''}`}
          title="Ver na interface do aplicativo mobile para celular"
        >
          <Smartphone size={15} />
          <span>App Mobile (iPhone)</span>
        </button>
        <button
          onClick={() => setPlatformMode('desktop')}
          className={`platform-switch-btn ${platformMode === 'desktop' ? 'active' : ''}`}
          title="Ver na interface do site desktop para computador"
        >
          <Monitor size={15} />
          <span>Site Desktop (Web)</span>
        </button>
      </div>

      {/* ====================================================================
          VERSÃO 1: APLICATIVO MOBILE (MOCKUP IPHONE FIEL À IMAGEM)
          ==================================================================== */}
      {platformMode === 'mobile' && (
        <div className="app-wrapper" style={{ paddingTop: '4rem' }}>
          {/* Chassi Externo Metálico do iPhone */}
          <div className="iphone-chassis">
            {/* Tela com resolução exata de 393 x 852 px */}
            <div className="iphone-screen">

              {/* Dynamic Island e Barra de Status Permanentes do iPhone */}
              <div className="dynamic-island">
                <div className="dynamic-island-camera" />
              </div>
              <div className="phone-status-bar">
                <span>16:01</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Signal size={12} />
                  <Wifi size={12} />
                  <span style={{ fontSize: '0.65rem' }}>5G</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>96</span>
                    <BatteryMedium size={14} />
                  </span>
                </div>
              </div>

              {/* TELA A: TELA INICIAL (HOME DO APP CELULAR COM VISUAL ALINHADO AO SITE) */}
              {mobileScreen === 'home' && (
                <>
                  {/* Header Oficial do App com Saudação e Barra de Busca */}
                  <MobileAppHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onPerformSearch={() => { }}
                    cartItemsCount={cartItemsCount}
                    onOpenCart={() => setIsCartOpen(true)}
                    onFocusAiSearch={() => {
                      handleSelectCustomPrompt('Preciso de um kit de cuidados de proteção solar e higiene facial');
                    }}
                  />

                  {/* Feed com Scroll da Tela Inicial (sem caixa gigante bloqueando!) */}
                  <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#FFFFFF', position: 'relative' }}>

                    {/* Banner Informativo se houver consulta ativa com a IA */}
                    {aiRecommendation && (
                      <div
                        onClick={() => {
                          setMobileScreen('ai-response');
                          setActiveNav('ai-chat');
                        }}
                        style={{
                          margin: '0.65rem 1rem 0.5rem 1rem',
                          backgroundColor: '#EFF6FF',
                          border: '1.5px solid #BFDBFE',
                          borderRadius: '16px',
                          padding: '0.65rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0, 31, 216, 0.08)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: '#001FD8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            flexShrink: 0
                          }}>
                            <Sparkles size={15} color="#FDE047" />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#001FD8' }}>
                              Consulta Ativa da Farmacêutica IA
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                              "{aiRecommendation.journeyTitle}"
                            </div>
                          </div>
                        </div>

                        <div style={{
                          backgroundColor: '#001FD8',
                          color: '#FFFFFF',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          flexShrink: 0
                        }}>
                          <span>Abrir</span>
                          <ArrowRight size={11} />
                        </div>
                      </div>
                    )}

                    {/* Cards de Ação Rápidos do App (Receita & Alertas) */}
                    <AppActionCards
                      onOpenPrescriptionFlow={() => {
                        handleSelectPreset({
                          prompt: 'Buscar produtos e equivalentes da minha receita médica',
                          budget: 60,
                          targetProductIds: ['prod-07', 'prod-09', 'prod-14']
                        });
                      }}
                      onOpenAlerts={() => {
                        showToast('Lembrete de medicamentos ativado para as 08:00 e 20:00!');
                      }}
                    />

                    {/* Carrossel de Banners Promocionais */}
                    <AppPromoBanners
                      onSelectBanner={(theme) => {
                        if (theme === 'baby') {
                          setActiveCategory('Baby');
                        } else {
                          setActiveCategory('Skincare');
                        }
                      }}
                    />

                    {/* Categorias com Ícones */}
                    <AppCategories
                      activeCategory={activeCategory}
                      onSelectCategory={(catId) => setActiveCategory(catId)}
                    />

                    {/* Grid de Produtos Oficiais FarmaViva (2 Colunas) */}
                    <AppProductGrid
                      activeCategory={activeCategory}
                      searchQuery={searchQuery}
                      onAddToCart={(prod) => handleAddToCart(prod, 'traditional')}
                    />

                  </div>

                  {/* ====================================================================
                      CHATBOT FLUTUANTE DINÂMICO NO CANTO INFERIOR (EXATAMENTE COMO NO SITE)
                      ==================================================================== */}
                  <div style={{
                    position: 'absolute',
                    bottom: '72px',
                    right: '16px',
                    zIndex: 900,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.45rem',
                    pointerEvents: 'none'
                  }}>
                    {/* Balão de Fala Dinâmico Interativo */}
                    {isMobileFabOpen && (
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #001FD8',
                        borderRadius: '14px 14px 4px 14px',
                        padding: '0.65rem 0.85rem',
                        boxShadow: '0 6px 20px rgba(0, 31, 216, 0.25)',
                        maxWidth: '240px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.45rem',
                        pointerEvents: 'auto',
                        animation: 'fadeIn 0.2s ease-out'
                      }}>
                        <div
                          style={{ flex: 1, cursor: 'pointer' }}
                          onClick={() => {
                            handleSelectCustomPrompt('Preciso de atendimento e recomendações de farmácia');
                            setMobileScreen('ai-response');
                            setActiveNav('ai-chat');
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.66rem', fontWeight: 800, color: '#001FD8', marginBottom: '0.15rem' }}>
                            <Sparkles size={11} color="#001FD8" />
                            <span>Dra. IA Pague Menos</span>
                          </div>
                          <p style={{ fontSize: '0.72rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.3, margin: 0 }}>
                            "{mobileBubbleMessages[mobileBubbleIndex]}"
                          </p>
                          <span style={{ fontSize: '0.66rem', color: '#001FD8', fontWeight: 800, marginTop: '0.3rem', display: 'inline-block' }}>
                            Toque para conversar →
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMobileFabOpen(false)}
                          style={{ color: '#94A3B8', padding: '0.1rem', cursor: 'pointer', border: 'none', background: 'transparent' }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    )}

                    {/* Botão Redondo Flutuante da Farmacêutica IA */}
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectCustomPrompt('Preciso de atendimento e recomendações de farmácia');
                        setMobileScreen('ai-response');
                        setActiveNav('ai-chat');
                      }}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#001FD8',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(0, 31, 216, 0.45)',
                        border: '3px solid #FFFFFF',
                        cursor: 'pointer',
                        position: 'relative',
                        pointerEvents: 'auto',
                        transition: 'transform 0.15s ease'
                      }}
                      title="Abrir Farmacêutica IA Pague Menos"
                    >
                      <Sparkles size={24} color="#FDE047" />

                      {/* Ponto Verde Pulsante de Status Online */}
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        border: '2px solid #FFFFFF'
                      }} />
                    </button>
                  </div>
                </>
              )}

              {/* TELA B: OUTRA TELA DEDICADA PARA A RESPOSTA DA IA */}
              {mobileScreen === 'ai-response' && (
                <AiChatResponseScreen
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
                  onBackToHome={() => {
                    setMobileScreen('home');
                    setActiveNav('home');
                  }}
                  onOpenCart={() => setIsCartOpen(true)}
                  cartItemsCount={cartItemsCount}
                />
              )}

              {/* Barra de Navegação Inferior (Dock Oficial com as Abas do Celular Preservadas) */}
              <AppBottomNav
                activeNav={mobileScreen === 'ai-response' ? 'ai-chat' : activeNav}
                setActiveNav={(nav) => {
                  setActiveNav(nav);
                  if (nav === 'home') setMobileScreen('home');
                }}
                cartItemsCount={cartItemsCount}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenAiGuide={() => {
                  if (!aiRecommendation) {
                    handleSelectCustomPrompt('Monte uma rotina de cuidados diários com dermocosméticos e proteção solar');
                  } else {
                    setMobileScreen('ai-response');
                    setActiveNav('ai-chat');
                  }
                }}
              />

              {/* Barrinha iOS Home Indicator */}
              <div className="ios-home-indicator-bar" />

            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          VERSÃO 2: SITE DESKTOP COMPLETO (FARMÁCIA FARMAVIVA WEB)
          ==================================================================== */}
      {platformMode === 'desktop' && (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingTop: '3.5rem' }}>
          {/* Header Completo Desktop */}
          <DesktopHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onPerformSearch={() => { }}
            cartItemsCount={cartItemsCount}
            cartTotal={cartTotal}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAiGuide={() => {
              if (!aiRecommendation) {
                handleSelectCustomPrompt('Produtos de primeiros socorros e alívio de dor para viagem');
              } else {
                setDesktopPage('ai-response');
              }
            }}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
          />

          {/* PÁGINA A: HOME DO SITE*/}
          {desktopPage === 'home' && (
            <DesktopHomePage
              activeCategory={activeCategory}
              onSelectCategory={(catId) => setActiveCategory(catId)}
              onAddToCart={(prod) => handleAddToCart(prod, 'traditional')}
              onOpenAiWithPrompt={(prompt, budget, preferGen) => handleSelectCustomPrompt(prompt, budget, preferGen)}
              onOpenCart={() => setIsCartOpen(true)}
              aiRecommendation={aiRecommendation}
            />
          )}

          {/* PÁGINA B: OUTRA TELA DEDICADA DA RESPOSTA DA IA NO SITE DESKTOP */}
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
            />
          )}

          {/* Rodapé Oficial FarmaViva */}
          <DesktopFooter />
        </div>
      )}

      {/* ====================================================================
          MODAIS E DRAWERS COMPARTILHADOS (MOBILE & DESKTOP)
          ==================================================================== */}
      {/* Gaveta do Carrinho Compartilhado */}
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
