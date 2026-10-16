import React from 'react';
import { Search, ShoppingBag, Camera, Mic, MapPin, ChevronDown, Sparkles } from 'lucide-react';

export function MobileAppHeader({
  searchQuery,
  setSearchQuery,
  onPerformSearch,
  cartItemsCount,
  onOpenCart,
  onFocusAiSearch
}) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Header Azul Oficial FarmaViva */}
      <div className="app-header-blue">
        <div className="app-header-top">
          
          {/* Logo FarmaViva com Cruz Vermelha e Saudação */}
          <div className="app-brand-greeting">
            <div className="app-logo-box">
              <span style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>+</span>
            </div>
            <div>
              <div style={{ fontSize: '1.12rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px', lineHeight: 1 }}>
                Farma<span style={{ color: '#FCA5A5' }}>Viva</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#E2E8F0', marginTop: '0.12rem' }}>
                Olá, <strong>Rafaella Guedes!</strong>
              </div>
            </div>
          </div>

          {/* Ícone de Sacola / Carrinho */}
          <button
            onClick={onOpenCart}
            className="app-basket-btn"
            title="Abrir carrinho de compras"
          >
            <ShoppingBag size={24} color="#FFFFFF" strokeWidth={1.8} />
            {cartItemsCount > 0 && (
              <span className="app-basket-badge">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Busca Tradicional Flutuante (Lupa + Botão IA + Câmera + Microfone) */}
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
            placeholder="O que você procura?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="app-search-actions">
            <button
              type="button"
              onClick={onFocusAiSearch}
              title="Buscar com Farmacêutica IA"
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
              title="Foto da receita"
              style={{ color: 'var(--pm-app-blue)', display: 'flex', alignItems: 'center' }}
            >
              <Camera size={18} />
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
      <div className="app-address-row">
        <MapPin size={16} color="var(--pm-app-blue)" />
        <span>Entregar: Rua Frei Teófilo de Virgoletta, 415 - Zu...</span>
        <ChevronDown size={15} color="var(--pm-app-blue)" />
      </div>
    </div>
  );
}
