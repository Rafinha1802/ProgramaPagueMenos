import React from 'react';

export function AppPromoBanners({ onSelectBanner }) {
  return (
    <div className="app-banners-carousel">
      {/* Banner 1: Alimento Infantil até 60% OFF na 2ª unidade */}
      <div
        className="app-promo-banner"
        onClick={() => onSelectBanner('baby')}
        style={{
          background: 'linear-gradient(135deg, #0A58CA 0%, #0022D6 100%)',
          color: '#FFFFFF',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '60%', zIndex: 2 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Alimento Infantil
          </div>
          <div style={{ fontSize: '0.7rem', color: '#CBD5E1', marginTop: '0.1rem' }}>
            COM ATÉ
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FF3399', lineHeight: 1 }}>
            60% OFF
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>
            NA 2ª UNIDADE
          </div>
        </div>

        {/* Latas Aptanutri / Nestonutri ilustrativas */}
        <div style={{ display: 'flex', gap: '-8px', position: 'relative' }}>
          <div style={{
            width: '52px',
            height: '66px',
            backgroundColor: '#0022D6',
            borderRadius: '8px',
            border: '2px solid #FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <span style={{ fontSize: '0.5rem', fontWeight: 800, color: '#FCD34D' }}>Aptanutri</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#FFFFFF' }}>3</span>
            <span style={{ fontSize: '0.45rem', color: '#FFFFFF' }}>800g</span>
          </div>
          <div style={{
            width: '52px',
            height: '66px',
            backgroundColor: '#059669',
            borderRadius: '8px',
            border: '2px solid #FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            marginLeft: '-12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <span style={{ fontSize: '0.48rem', fontWeight: 800, color: '#FFFFFF' }}>Nestonutri</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#FCD34D' }}>1-3</span>
          </div>
        </div>
      </div>

      {/* Banner 2: Festival Dermo & Beleza */}
      <div
        className="app-promo-banner"
        onClick={() => onSelectBanner('skincare')}
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #0022D6 100%)',
          color: '#FFFFFF',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div style={{
          backgroundColor: '#FF3399',
          color: '#FFFFFF',
          fontSize: '0.65rem',
          fontWeight: 800,
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          alignSelf: 'flex-start',
          marginBottom: '0.4rem'
        }}>
          Festival Dermo & Beleza
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 900, lineHeight: 1.15 }}>
          COMBINE PRODUTOS
        </div>
        <div style={{ fontSize: '0.75rem', color: '#93C5FD' }}>
          E GANHE <strong style={{ color: '#FDE047', fontSize: '0.95rem' }}>25% DE DESCONTO</strong>
        </div>
      </div>
    </div>
  );
}
