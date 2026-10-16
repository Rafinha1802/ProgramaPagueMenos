import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { CATALOG } from '../data/catalog';

export function AppProductGrid({
  activeCategory,
  searchQuery,
  onAddToCart
}) {
  const [favorites, setFavorites] = useState({});
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (product) => {
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  const filtered = CATALOG.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app-products-section">
      <h3 className="app-products-section-title">
        {searchQuery ? `Resultados para "${searchQuery}"` : 'Aproveite as Melhores Ofertas para Você!'}
      </h3>

      <div className="app-products-grid-2col">
        {filtered.map((prod) => {
          const isFav = favorites[prod.id];
          const isJustAdded = recentlyAddedId === prod.id;

          return (
            <div key={prod.id} className="app-product-card">
              {/* Topo do Card: Badge de Oferta & Favorito */}
              <div className="app-product-top-row">
                <span className="app-product-tag-pink">
                  {prod.offerTag || 'Super oferta'}
                </span>
                <button
                  onClick={() => toggleFavorite(prod.id)}
                  className="app-product-fav-btn"
                  title="Salvar nos favoritos"
                >
                  <Heart
                    size={18}
                    color={isFav ? '#E30613' : '#94A3B8'}
                    fill={isFav ? '#E30613' : 'none'}
                  />
                </button>
              </div>

              {/* Imagem do Produto */}
              <div className="app-product-image-container">
                <img src={prod.image} alt={prod.name} />
              </div>

              {/* Título & Marca */}
              <div>
                <h4 className="app-product-name" title={prod.name}>
                  {prod.name}
                </h4>
                <div className="app-product-brand">
                  {prod.brand}
                </div>
              </div>

              {/* Bloco de Preços e Botão de Adicionar à Sacola */}
              <div className="app-product-price-block">
                {prod.originalPrice && (
                  <div className="app-product-original-price">
                    <span>R$ {prod.originalPrice.toFixed(2).replace('.', ',')}</span>
                    {prod.discountBadge && (
                      <span className="app-product-discount-label">{prod.discountBadge}</span>
                    )}
                  </div>
                )}

                <div className="app-product-final-price">
                  R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#008744', fontWeight: 800, marginTop: '0.1rem' }}>
                  ★ Clube Sempre Bem
                </div>

                {/* Botão Redondo Azul Oficial (+) */}
                <button
                  onClick={() => handleAdd(prod)}
                  className="app-product-add-cart-float"
                  title="Adicionar à sacola"
                >
                  {isJustAdded ? (
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Plus size={20} color="#FFFFFF" strokeWidth={2.8} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
