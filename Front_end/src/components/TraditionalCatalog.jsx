import React from 'react';
import { ShoppingBag, Star, ShieldCheck, Heart, AlertCircle, Sparkles } from 'lucide-react';

export function TraditionalCatalog({
  activeCategory,
  searchQuery,
  onAddToCart,
  onOpenAiGuide,
  products = []
}) {
  const catalogList = Array.isArray(products) ? products : [];

  // Filtragem combinada por categoria e termo de busca tradicional
  const filteredProducts = catalogList.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' ||
      item.category === activeCategory ||
      item.categoryLabel === activeCategory ||
      (item.categoria && item.categoria.toLowerCase().includes(activeCategory.toLowerCase()));

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section style={{ padding: '3rem 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        
        {/* Header da Vitrine */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pm-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Catálogo Oficial Pague Menos
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {searchQuery ? `Resultados da busca por "${searchQuery}"` : 'Ofertas e Destaques da Farmácia'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Compre direto pela vitrine tradicional ou combine com sugestões da Compra Guiada por IA.
            </p>
          </div>

          <button
            onClick={onOpenAiGuide}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--pm-blue-light)',
              color: 'var(--pm-blue)',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: '1px solid #BAE6FD'
            }}
          >
            <Sparkles size={14} color="#0284C7" />
            Precisa de ajuda para escolher? Abrir Compra com IA
          </button>
        </div>

        {/* Grid de Produtos */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)'
          }}>
            <AlertCircle size={40} color="var(--pm-red)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Nenhum produto encontrado</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Tente buscar com outros termos ou use a Compra Guiada por IA para encontrar alternativas para o seu caso.
            </p>
            <button onClick={onOpenAiGuide} className="btn-primary" style={{ fontSize: '0.88rem' }}>
              <Sparkles size={16} /> Experimentar Compra Guiada
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Badges de Destaque */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backgroundColor: prod.isGeneric ? '#ECFDF5' : 'var(--pm-blue-light)',
                    color: prod.isGeneric ? '#047857' : 'var(--pm-blue)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {prod.badge || prod.categoryLabel}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span>{prod.rating}</span>
                  </div>
                </div>

                {/* Imagem do Produto */}
                <div style={{ textAlign: 'center', marginBottom: '1rem', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      maxHeight: '135px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                </div>

                {/* Detalhes do Produto */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {prod.brand}
                  </div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', minHeight: '2.5rem', lineHeight: 1.35 }}>
                    {prod.name}
                  </h3>

                  {prod.requiresPrescription && (
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#B91C1C',
                      backgroundColor: '#FEF2F2',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      fontWeight: 600
                    }}>
                      Tarja Vermelha • Exige Receita
                    </div>
                  )}

                  {/* Preços */}
                  <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--pm-red)' }}>
                        R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="badge-club">Sempre Bem</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Adicionar ao Carrinho Compartilhado */}
                <button
                  onClick={() => onAddToCart(prod)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>Adicionar à Sacola</span>
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
