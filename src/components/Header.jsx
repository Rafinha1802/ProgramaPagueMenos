import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ShoppingBag, MapPin, Sparkles, User, Store, Smartphone, 
  HelpCircle, ChevronRight, Mic, Camera, X, ArrowRight, TrendingUp, Sparkle, Plus, LogOut
} from 'lucide-react';

export function Header({
  searchQuery,
  setSearchQuery,
  onPerformSearch,
  cartItemsCount,
  cartTotal,
  onOpenCart,
  onOpenAiGuide,
  activeCategory,
  setActiveCategory,
  onOpenSafetyModal,
  userSession,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onGoHome,
  onOpenStoresModal,
  onOpenAppModal,
  onOpenHelpModal,
  onOpenCepModal,
  userLocationCep,
  onOpenCamera,
  backendStatus = null,
  catalogProducts = [],
  onAddToCart = null
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Produtos que correspondem à digitação em tempo real no catálogo
  const matchingProducts = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2 || !Array.isArray(catalogProducts)) {
      return [];
    }
    const q = searchQuery.toLowerCase().trim();
    return catalogProducts
      .filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const active = (p.activePrinciple || '').toLowerCase();
        return name.includes(q) || cat.includes(q) || active.includes(q);
      })
      .slice(0, 4);
  }, [searchQuery, catalogProducts]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const aiSmartPrompts = [
    {
      badge: 'Alívio Rápido',
      query: 'Dor de cabeça forte e enxaqueca',
      hint: 'Neosaldina, Dipirona e analgésicos rápidos'
    },
    {
      badge: 'Economia',
      query: 'Genérico mais barato com mesma fórmula',
      hint: 'Economize até 65% em similares aprovados pela Anvisa'
    },
    {
      badge: 'Dermo & Beleza',
      query: 'Protetor solar toque seco para pele oleosa',
      hint: 'Anthelios, Minesol, Episol e fotoproteção'
    },
    {
      badge: 'Imunidade',
      query: 'Kit gripe, febre e imunidade com Vitamina C',
      hint: 'Cimegripe, Benegrip, Redoxon e Zinco'
    }
  ];

  const popularTags = [
    'Dipirona 500mg',
    'Dorflex',
    'Neosaldina',
    'Protetor FPS 60',
    'Vitamina C',
    'Dramin',
    'Torsilax',
    'Bepantol'
  ];

  const handleSelectQuery = (text) => {
    setSearchQuery(text);
    setIsSearchFocused(false);
    if (onOpenAiGuide) {
      onOpenAiGuide(text);
    } else if (onPerformSearch) {
      onPerformSearch(text);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (searchQuery && searchQuery.trim()) {
      if (onOpenAiGuide) {
        onOpenAiGuide(searchQuery.trim());
      } else if (onPerformSearch) {
        onPerformSearch(searchQuery.trim());
      }
    }
  };
  const departments = [
    { id: 'ofertas', label: 'Ofertas', isRed: true },
    { id: 'Medicamentos', label: 'Medicamentos e Saúde' },
    { id: 'Skincare', label: 'Dermo e Beleza' },
    { id: 'Baby', label: 'Mamães e bebês' },
    { id: 'Higiene', label: 'Higiene pessoal' },
    { id: 'Suplementos', label: 'Vida Saudável' },
    { id: 'conveniencia', label: 'Conveniência' },
    { id: 'servicos', label: 'Serviços de Saúde' },
    { id: 'exclusivas', label: 'Marcas Exclusivas' }
  ];

  return (
    <header style={{ backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* 1. Barra Superior Azul Marinho (Exata como no print oficial) */}
      <div style={{ backgroundColor: '#001242', color: '#FFFFFF', fontSize: '0.74rem', padding: '0.35rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
          <div
            onClick={onOpenStoresModal}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#E2E8F0', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#E2E8F0'}
            title="Localizar farmácias Pague Menos mais próximas"
          >
            <Store size={13} />
            <span>Nossas lojas</span>
          </div>
          <div
            onClick={onOpenAppModal}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#E2E8F0', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#E2E8F0'}
            title="Baixar o aplicativo Pague Menos para celular"
          >
            <Smartphone size={13} />
            <span>Baixe nosso APP</span>
          </div>
          <div
            onClick={onOpenHelpModal}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#E2E8F0', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#E2E8F0'}
            title="Fale conosco, WhatsApp e SAC"
          >
            <HelpCircle size={13} />
            <span>Precisa de ajuda</span>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal do Header (Logo, Barra de Busca Grande, CEP, Login, Cesta) */}
      <div className="container" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'nowrap' }}>
          
          {/* Logo Oficial Pague Menos */}
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => {
              setActiveCategory('all');
              if (onGoHome) onGoHome();
            }}
            title="Pague Menos - Página Inicial"
          >
            <img
              src="/paguemenos-logo.png"
              alt="Pague Menos"
              style={{
                height: '46px',
                width: 'auto',
                maxWidth: '180px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          {/* Barra de Busca Dinâmica com IA Integrada */}
          <div ref={searchContainerRef} style={{ flex: 1, maxWidth: '740px', position: 'relative' }}>
            <form
              onSubmit={handleFormSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: isSearchFocused ? '#FFFFFF' : '#F8FAFC',
                borderRadius: '999px',
                height: '50px',
                padding: '0.25rem 0.35rem 0.25rem 1.15rem',
                border: isSearchFocused ? '1.5px solid #001FD8' : '1.5px solid #E2E8F0',
                boxShadow: isSearchFocused 
                  ? '0 10px 25px -4px rgba(0, 31, 216, 0.16), 0 0 0 3px rgba(0, 31, 216, 0.1)' 
                  : '0 2px 6px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Ícone de Busca Dinâmico */}
              <Search 
                size={19} 
                color={isSearchFocused ? '#001FD8' : '#64748B'} 
                style={{ marginRight: '0.75rem', flexShrink: 0, transition: 'color 0.15s ease' }} 
              />

              {/* Input com placeholder refinado que não corta */}
              <input
                type="text"
                placeholder="Buscar remédios, sintomas, genéricos..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.86rem',
                  fontWeight: 500,
                  color: '#0F172A',
                  outline: 'none',
                  padding: '0.4rem 0',
                  minWidth: 0
                }}
              />

              {/* Botão Limpar (X) */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    border: 'none',
                    backgroundColor: '#E2E8F0',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                    cursor: 'pointer',
                    marginRight: '0.45rem',
                    flexShrink: 0,
                    padding: 0,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#CBD5E1'; e.currentTarget.style.color = '#0F172A'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}
                  title="Limpar busca"
                >
                  <X size={13} />
                </button>
              )}

              {/* Separador vertical sutil */}
              <div style={{ width: '1px', height: '22px', backgroundColor: '#E2E8F0', margin: '0 0.5rem 0 0.2rem', flexShrink: 0 }} />

              {/* Atalho de Enviar Receita com Câmera */}
              {onOpenCamera && (
                <button
                  type="button"
                  onClick={onOpenCamera}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                    marginRight: '0.35rem'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.backgroundColor = '#EFF6FF'; 
                    e.currentTarget.style.color = '#001FD8'; 
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.backgroundColor = '#F1F5F9'; 
                    e.currentTarget.style.color = '#475569'; 
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Fotografar ou enviar receita médica para a IA montar sua cesta"
                >
                  <Camera size={16} />
                </button>
              )}

              {/* Botão de Busca Hero com IA */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchFocused(false);
                  if (onOpenAiGuide) {
                    onOpenAiGuide(searchQuery ? searchQuery.trim() : '');
                  } else if (onPerformSearch) {
                    onPerformSearch(searchQuery ? searchQuery.trim() : '');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'linear-gradient(135deg, #001FD8 0%, #001282 100%)',
                  color: '#FFFFFF',
                  height: '40px',
                  padding: '0 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  letterSpacing: '-0.2px',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 3px 12px rgba(0, 31, 216, 0.35)',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 31, 216, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(0, 31, 216, 0.35)';
                }}
                title="Consultar Farmacêutica Inteligente Pague Menos"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.18)'
                }}>
                  <Sparkles size={13} color="#FDE047" />
                </div>
                <span>Buscar com IA</span>
              </button>
            </form>

            {/* Smart Floating Autocomplete Dropdown (quando focado) */}
            {isSearchFocused && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 31, 216, 0.08)',
                  padding: '1.15rem',
                  zIndex: 999,
                  animation: 'fadeIn 0.15s ease'
                }}
              >
                {/* Header do Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#001FD8'
                    }}>
                      <Sparkles size={13} />
                    </div>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Assistente Farmacêutica Pague Menos
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Pressione Enter para buscar</span>
                </div>

                {/* Se o usuário já digitou algo, destacar ação de busca imediata com IA */}
                {searchQuery && searchQuery.trim().length > 0 && (
                  <>
                    <div
                      onClick={() => handleSelectQuery(searchQuery.trim())}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#EFF6FF',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        marginBottom: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#DBEAFE';
                        e.currentTarget.style.borderColor = '#001FD8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#EFF6FF';
                        e.currentTarget.style.borderColor = '#BFDBFE';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#001FD8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          <Sparkles size={16} color="#FDE047" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>
                            Buscar com IA: <span style={{ color: '#001FD8' }}>"{searchQuery}"</span>
                          </div>
                          <div style={{ fontSize: '0.73rem', color: '#475569' }}>
                            Analisar sintomas, genéricos equivalentes e montar cesta inteligente
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#001FD8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        Consultar IA <ArrowRight size={14} />
                      </span>
                    </div>

                    {/* Produtos correspondentes no catálogo em tempo real */}
                    {matchingProducts.length > 0 ? (
                      <div style={{ marginBottom: '0.9rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.45rem',
                          paddingLeft: '0.2rem'
                        }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Produtos no Catálogo ({matchingProducts.length})
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#001FD8', fontWeight: 600 }}>
                            Preço oficial sem simulação
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {matchingProducts.map((prod) => {
                            const displayPrice = prod.price ?? prod.clubPrice ?? 0;
                            return (
                              <div
                                key={prod.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '10px',
                                  backgroundColor: '#F8FAFC',
                                  border: '1px solid #E2E8F0',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                                  e.currentTarget.style.borderColor = '#CBD5E1';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                                  e.currentTarget.style.borderColor = '#E2E8F0';
                                }}
                              >
                                <div
                                  onClick={() => handleSelectQuery(prod.name)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, cursor: 'pointer', minWidth: 0 }}
                                >
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#FFFFFF', padding: '2px', border: '1px solid #E2E8F0', flexShrink: 0 }}
                                  />
                                  <div style={{ minWidth: 0, paddingRight: '0.5rem' }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {prod.name}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {prod.category} {prod.activePrinciple ? `• ${prod.activePrinciple}` : ''}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#E30613' }}>
                                      R$ {displayPrice.toFixed(2).replace('.', ',')}
                                    </div>
                                    {prod.clubPrice && prod.clubPrice < prod.price && (
                                      <div style={{ fontSize: '0.65rem', color: '#001FD8', fontWeight: 700 }}>
                                        Clube: R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                                      </div>
                                    )}
                                  </div>
                                  {onAddToCart && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToCart(prod);
                                      }}
                                      style={{
                                        backgroundColor: '#001FD8',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.35rem 0.65rem',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        transition: 'transform 0.15s ease'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                      title="Adicionar à sacola"
                                    >
                                      <Plus size={12} />
                                      <span>Adicionar</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: '0.6rem 0.85rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px dashed #CBD5E1',
                        fontSize: '0.74rem',
                        color: '#64748B',
                        marginBottom: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem'
                      }}>
                        <Sparkles size={14} color="#001FD8" />
                        <span>Nenhum nome exato no estoque imediato. A IA Farmacêutica acima encontra princípios ativos, dosagens e equivalentes!</span>
                      </div>
                    )}
                  </>
                )}

                {/* Lista de Prompts Inteligentes Guiados (quando busca vazia) */}
                {(!searchQuery || searchQuery.trim().length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem' }}>
                    {aiSmartPrompts.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectQuery(item.query)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#EFF6FF';
                          e.currentTarget.style.borderColor = '#BFDBFE';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            backgroundColor: '#E0E7FF',
                            color: '#3730A3'
                          }}>
                            {item.badge}
                          </span>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                              {item.query}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {item.hint}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={15} color="#001FD8" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Termos Populares / Em Alta */}
                <div style={{ marginBottom: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem' }}>
                    <TrendingUp size={13} color="#001FD8" />
                    <span>MAIS BUSCADOS NA FARMÁCIA</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {popularTags.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectQuery(tag)}
                        style={{
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#001FD8';
                          e.currentTarget.style.borderColor = '#001FD8';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.color = '#334155';
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card de Envio de Receita */}
                {onOpenCamera && (
                  <div
                    onClick={() => {
                      setIsSearchFocused(false);
                      onOpenCamera();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                      border: '1px dashed #93C5FD',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#001FD8'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#93C5FD'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#DBEAFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#001FD8'
                      }}>
                        <Camera size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                          Tem uma receita médica ou caixa em mãos?
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          A IA lê o nome dos medicamentos e monta a cesta ideal com genéricos mais baratos.
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#001FD8',
                      backgroundColor: '#FFFFFF',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                      Enviar foto
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3 Ações à Direita: CEP, Login, Cesta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            
            {/* CEP */}
            <div
              onClick={onOpenCepModal}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: '10px', transition: 'background 0.15s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Informar CEP para frete grátis e entrega rápida"
            >
              <div style={{ color: '#001FD8' }}>
                <MapPin size={20} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.2 }}>
                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>{userLocationCep ? 'Entregar em' : 'Insira seu'}</span><br />
                <strong style={{ color: '#001FD8' }}>{userLocationCep || 'CEP'}</strong>
              </div>
            </div>

            {/* Usuário / Minha Conta */}
            <div
              onClick={() => {
                if (userSession?.isLoggedIn) {
                  if (onOpenProfile) onOpenProfile();
                } else {
                  if (onOpenAuth) onOpenAuth('login');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                padding: '0.3rem 0.65rem',
                borderRadius: '12px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={userSession?.isLoggedIn ? 'Acessar meu perfil e histórico de compras' : 'Fazer login ou criar cadastro'}
            >
              <div style={{
                color: userSession?.isLoggedIn ? '#059669' : '#001FD8',
                backgroundColor: userSession?.isLoggedIn ? '#DCFCE7' : '#EFF6FF',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={19} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.25 }}>
                {userSession?.isLoggedIn ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div>
                      <span style={{ color: '#059669', fontSize: '0.72rem', fontWeight: 800 }}>Olá, {userSession.name?.split(' ')[0]}</span><br />
                      <strong style={{ color: '#001FD8' }}>Minha Conta & Pedidos</strong>
                    </div>
                    {onLogout && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLogout();
                        }}
                        title="Sair da sua conta"
                        style={{
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          borderRadius: '8px',
                          padding: '0.22rem 0.55rem',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      >
                        <LogOut size={12} />
                        <span>Sair</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <span style={{ color: '#64748B', fontSize: '0.72rem' }}>Bem-vindo!</span><br />
                    <strong style={{ color: '#001FD8' }}>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenAuth) onOpenAuth('login');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        Entre
                      </span>{' '}
                      ou{' '}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenAuth) onOpenAuth('register');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        cadastre-se
                      </span>
                    </strong>
                  </>
                )}
              </div>
            </div>

            {/* Cesta de Compras */}
            <button
              onClick={onOpenCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative', color: '#001FD8' }}>
                <ShoppingBag size={24} strokeWidth={2} />
                {cartItemsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: '#E30613',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF'
                  }}>
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>Cesta</span><br />
                <strong style={{ color: '#001FD8', fontSize: '0.84rem' }}>
                  R$ {cartTotal > 0 ? cartTotal.toFixed(2).replace('.', ',') : '0,00'}
                </strong>
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* 3. Barra de Departamentos e Categorias Oficiais */}
      <div style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.35rem',
            overflowX: 'auto',
            padding: '0.65rem 0',
            scrollbarWidth: 'none',
            fontSize: '0.82rem',
            whiteSpace: 'nowrap'
          }}>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => {
                  setActiveCategory(dept.id === 'ofertas' ? 'all' : dept.id);
                  if (onGoHome) onGoHome();
                }}
                style={{
                  fontWeight: dept.isRed ? 800 : (activeCategory === dept.id ? 700 : 600),
                  color: dept.isRed ? '#E30613' : (activeCategory === dept.id ? '#001FD8' : '#334155'),
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                  padding: '0.2rem 0',
                  borderBottom: activeCategory === dept.id ? '2px solid #001FD8' : '2px solid transparent',
                  transition: 'color 0.15s ease'
                }}
              >
                {dept.label}
              </button>
            ))}

            {/* Destaque Dinâmico da IA na Barra de Menus */}
            <button
              onClick={onOpenAiGuide}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#EFF6FF',
                color: '#001FD8',
                border: '1px solid #BFDBFE',
                borderRadius: '999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={12} color="#001FD8" />
              <span>Dra. IA Pague Menos</span>
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}

export default Header;
