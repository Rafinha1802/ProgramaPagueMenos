import React from 'react';
import { Home, LayoutGrid, Sparkles, Tag, ShoppingBag } from 'lucide-react';

export function AppBottomNav({
  activeNav,
  setActiveNav,
  cartItemsCount,
  onOpenCart,
  onOpenAiGuide
}) {
  return (
    <nav className="app-bottom-nav">
      {/* 1. Home */}
      <div
        className={`app-nav-item ${activeNav === 'home' ? 'active' : ''}`}
        onClick={() => setActiveNav('home')}
      >
        <Home size={22} strokeWidth={activeNav === 'home' ? 2.5 : 1.8} />
        <span>Home</span>
      </div>

      {/* 2. Categorias */}
      <div
        className={`app-nav-item ${activeNav === 'categorias' ? 'active' : ''}`}
        onClick={() => setActiveNav('categorias')}
      >
        <LayoutGrid size={22} strokeWidth={activeNav === 'categorias' ? 2.5 : 1.8} />
        <span>Categorias</span>
      </div>

      {/* 3. Chat IA Farmacêutica (Destaque Central) */}
      <div
        className={`app-nav-item ${activeNav === 'ai-chat' ? 'active' : ''}`}
        onClick={onOpenAiGuide}
        style={{
          position: 'relative'
        }}
      >
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles
            size={22}
            color={activeNav === 'ai-chat' ? 'var(--pm-app-blue)' : '#001FD8'}
            strokeWidth={activeNav === 'ai-chat' ? 2.5 : 2}
          />
        </div>
        <span style={{
          color: activeNav === 'ai-chat' ? 'var(--pm-app-blue)' : '#001FD8',
          fontWeight: activeNav === 'ai-chat' ? 800 : 700
        }}>
          Chat IA
        </span>
      </div>

      {/* 4. Ofertas */}
      <div
        className={`app-nav-item ${activeNav === 'ofertas' ? 'active' : ''}`}
        onClick={() => setActiveNav('ofertas')}
      >
        <Tag size={22} strokeWidth={activeNav === 'ofertas' ? 2.5 : 1.8} />
        <span>Ofertas</span>
      </div>

      {/* 5. Sacola */}
      <div
        className="app-nav-item"
        onClick={onOpenCart}
        style={{ position: 'relative' }}
      >
        <ShoppingBag size={22} strokeWidth={1.8} />
        {cartItemsCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0px',
            right: '10px',
            backgroundColor: 'var(--pm-app-red)',
            color: '#FFFFFF',
            fontSize: '0.62rem',
            fontWeight: 800,
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {cartItemsCount}
          </span>
        )}
        <span>Sacola</span>
      </div>
    </nav>
  );
}

export default AppBottomNav;
