import React from 'react';
import { Search, ShoppingBag, Mic, MapPin, ChevronDown, Sparkles, User } from 'lucide-react';

export function MobileAppHeader({
  searchQuery,
  setSearchQuery,
  onPerformSearch,
  cartItemsCount,
  onOpenCart,
  onFocusAiSearch,
  userSession,
  onOpenAuth,
  onOpenProfile,
  onOpenCepModal
}) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Header Azul Oficial FarmaViva */}
      <div className="app-header-blue" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div className="app-header-top" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
          
          {/* Logo FarmaViva com Cruz Vermelha e Saudação */}
          <div
            className="app-brand-greeting"
            onClick={userSession?.isLoggedIn ? onOpenProfile : () => onOpenAuth && onOpenAuth('login')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}
            title={userSession?.isLoggedIn ? 'Minha Conta & Histórico de Compras' : 'Entrar ou Cadastrar'}
          >
            <div className="app-logo-box" style={{ flexShrink: 0 }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, lineHeight: 1 }}>+</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.14rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px', lineHeight: 1.15 }}>
                Farma<span style={{ color: '#FCA5A5' }}>Viva</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#E2E8F0', marginTop: '0.12rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {userSession?.isLoggedIn ? (
                  <>Olá, <strong style={{ color: '#FFFFFF' }}>{userSession.name?.split(' ')[0]}!</strong> (Ver perfil)</>
                ) : (
                  <>Olá! <span style={{ textDecoration: 'underline', color: '#FEF08A', fontWeight: 700 }}>Entrar / Cadastrar</span></>
                )}
              </div>
            </div>
          </div>

          {/* Ações da Direita: Perfil + Sacola */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {/* Ícone de Perfil / Conta */}
            <button
              type="button"
              onClick={userSession?.isLoggedIn ? onOpenProfile : () => onOpenAuth && onOpenAuth('login')}
              style={{
                background: userSession?.isLoggedIn ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              title={userSession?.isLoggedIn ? 'Minha Conta FarmaViva & Compras' : 'Entrar ou Cadastrar'}
            >
              <User size={19} strokeWidth={2.2} />
            </button>

            {/* Ícone de Sacola / Carrinho */}
            <button
              onClick={onOpenCart}
              className="app-basket-btn"
              style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '50%',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Abrir carrinho de compras"
            >
              <ShoppingBag size={19} color="#FFFFFF" strokeWidth={2.2} />
              {cartItemsCount > 0 && (
                <span className="app-basket-badge" style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--pm-app-red)',
                  color: '#FFFFFF',
                  fontSize: '0.64rem',
                  fontWeight: 900,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--pm-app-blue)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                }}>
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Busca Tradicional Flutuante (Lupa + Botão IA + Microfone) */}
      <div className="app-search-floating-wrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onPerformSearch();
          }}
          className="app-search-bar"
        >
          <Search size={19} color="#64748B" />
          <input
            type="text"
            className="app-search-input"
            placeholder="O que você procura no catálogo de produtos?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="app-search-actions">
            <button
              type="button"
              onClick={onFocusAiSearch}
              title="Atendimento com Farmacêutica IA"
              style={{
                backgroundColor: '#EFF6FF',
                color: '#001FD8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '999px',
                border: '1px solid #BFDBFE',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={12} color="#001FD8" />
              <span>IA</span>
            </button>
            <button
              type="button"
              onClick={onFocusAiSearch}
              title="Busca por voz"
              style={{ color: 'var(--pm-app-blue)', display: 'flex', alignItems: 'center' }}
            >
              <Mic size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Linha de Endereço e Localização */}
      <div className="app-address-row" onClick={onOpenCepModal} style={{ cursor: 'pointer' }} title="Alterar CEP de entrega">
        <MapPin size={16} color="var(--pm-app-blue)" />
        <span>Entregar: Rua Frei Teófilo de Virgoletta, 415 - Zu...</span>
        <ChevronDown size={15} color="var(--pm-app-blue)" />
      </div>
    </div>
  );
}
