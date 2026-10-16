import React from 'react';
import { Search, ShoppingBag, MapPin, Sparkles, User, Store, Smartphone, HelpCircle, ChevronRight, Mic, Camera } from 'lucide-react';

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
  onOpenSafetyModal
}) {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#E2E8F0' }}>
            <Store size={13} />
            <span>Nossas lojas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#E2E8F0' }}>
            <Smartphone size={13} />
            <span>Baixe nosso APP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#E2E8F0' }}>
            <HelpCircle size={13} />
            <span>Precisa de ajuda</span>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal do Header (Logo, Barra de Busca Grande, CEP, Login, Cesta) */}
      <div className="container" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'nowrap' }}>
          
          {/* Logo Oficial FarmaViva (Quadrado Vermelho com Cruz Branca + Tipografia Azul) */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setActiveCategory('all')}
          >
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#E30613',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 3px 8px rgba(227, 6, 19, 0.3)'
            }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 900, lineHeight: 1 }}>+</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#001FD8', letterSpacing: '-0.5px', lineHeight: 1 }}>
                Farma<br /><span style={{ color: '#E30613' }}>Viva</span>
              </div>
            </div>
          </div>

          {/* Barra de Busca Dinâmica com IA Integrada */}
          <div style={{ flex: 1, maxWidth: '620px', position: 'relative' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) onPerformSearch();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F1F5F9',
                borderRadius: '999px',
                padding: '0.25rem 0.5rem 0.25rem 1.15rem',
                border: '1px solid #E2E8F0',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <Search size={18} color="#64748B" style={{ marginRight: '0.65rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="O que você procura? (Remédios, sintomas ou rotina de cuidados...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.88rem',
                  color: '#1E293B',
                  outline: 'none',
                  padding: '0.45rem 0'
                }}
              />
              
              {/* Botão de Busca Dinâmica com IA */}
              <button
                type="button"
                onClick={onOpenAiGuide}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(0, 31, 216, 0.3)',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                  marginLeft: '0.4rem'
                }}
                title="Consultar Farmacêutica com IA"
              >
                <Sparkles size={13} color="#FDE047" />
                <span>Buscar com IA</span>
              </button>
            </form>
          </div>

          {/* 3 Ações à Direita: CEP, Login, Cesta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            
            {/* CEP */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
              <div style={{ color: '#001FD8' }}>
                <MapPin size={20} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.2 }}>
                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>Insira seu</span><br />
                <strong style={{ color: '#001FD8' }}>CEP</strong>
              </div>
            </div>

            {/* Usuário / Login */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
              <div style={{ color: '#001FD8' }}>
                <User size={22} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.25 }}>
                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>Bem-vindo!</span><br />
                <strong style={{ color: '#001FD8' }}>Entre ou cadastre-se</strong>
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
                onClick={() => setActiveCategory(dept.id === 'ofertas' ? 'all' : dept.id)}
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
              <span>Dra. IA Farmacêutica</span>
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}

export default Header;
