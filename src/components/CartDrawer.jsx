import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, ShieldCheck, ArrowRight, Truck, Check } from 'lucide-react';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  // Estado de seleção de itens para compra no carrinho
  const [selectedIds, setSelectedIds] = useState(() => cartItems.map((i) => i.product.id));

  // Sincroniza novos itens adicionados ao carrinho mantendo-os selecionados
  useEffect(() => {
    setSelectedIds((prev) => {
      const existing = new Set(prev);
      cartItems.forEach((i) => existing.add(i.product.id));
      // Remove ids que foram deletados do carrinho
      const cartSet = new Set(cartItems.map((i) => i.product.id));
      return Array.from(existing).filter((id) => cartSet.has(id));
    });
  }, [cartItems]);

  if (!isOpen) return null;

  const toggleItem = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const allSelected = cartItems.length > 0 && cartItems.every((i) => selectedIds.includes(i.product.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((i) => i.product.id));
    }
  };

  const selectedItems = cartItems.filter((i) => selectedIds.includes(i.product.id));
  const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalClub = selectedItems.reduce((acc, item) => acc + item.product.clubPrice * item.quantity, 0);
  const totalOriginal = selectedItems.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const totalSavings = totalOriginal - totalClub;
  const freeShippingThreshold = 99.0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalClub);

  const hasRxItem = selectedItems.some((i) => i.product.requiresPrescription);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(3px)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Drawer Container (como uma folha/sheet nativa de app do iPhone) */}
      <div style={{
        width: '100%',
        height: '92%',
        backgroundColor: '#FFFFFF',
        borderRadius: '26px 26px 0 0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -8px 25px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Header do Carrinho */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ShoppingBag size={20} color="var(--pm-red)" />
              <span>Carrinho de Compras</span>
            </h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Selecione os produtos para fechar seu pedido
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de Meta de Frete Grátis Turbo */}
        <div style={{
          backgroundColor: '#EFF6FF',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid #DBEAFE'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--pm-blue)', fontWeight: 600 }}>
              <Truck size={15} />
              {remainingForFreeShipping === 0 && selectedCount > 0
                ? 'Você ganhou Frete Grátis Turbo!'
                : `Faltam R$ ${remainingForFreeShipping.toFixed(2).replace('.', ',')} para Frete Grátis`}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--pm-blue)' }}>Meta: R$ 99,00</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#BFDBFE', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (totalClub / freeShippingThreshold) * 100)}%`,
              height: '100%',
              backgroundColor: remainingForFreeShipping === 0 && selectedCount > 0 ? 'var(--pm-green)' : 'var(--pm-blue)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Barra de Seleção de Itens no Carrinho */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '0.65rem 1.5rem',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem'
          }}>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 800, color: '#001FD8', userSelect: 'none' }}
              onClick={(e) => {
                e.preventDefault();
                toggleSelectAll();
              }}
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => {}}
                style={{ width: '16px', height: '16px', accentColor: '#001FD8', cursor: 'pointer' }}
              />
              <span>Selecionar todos ({cartItems.length})</span>
            </label>

            <span style={{ fontWeight: 700, color: '#475569' }}>
              {selectedItems.length} de {cartItems.length} selecionado(s) para compra
            </span>
          </div>
        )}

        {/* Lista de Itens do Carrinho Compartilhado */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <ShoppingBag size={48} color="#CBD5E1" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Seu carrinho está vazio
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Converse com a Farmacêutica IA no chat ou utilize a busca para adicionar produtos.
              </p>
              <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {cartItems.map(({ product, quantity, source }) => {
                const isSelected = selectedIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: isSelected ? '#FFFFFF' : '#F8FAFC',
                      border: isSelected ? '1.5px solid #001FD8' : '1px solid #E2E8F0',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center',
                      opacity: isSelected ? 1 : 0.65,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Checkbox de Seleção do Item no Carrinho */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(product.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#001FD8',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      title={isSelected ? 'Desmarcar da compra atual' : 'Marcar para comprar'}
                    />

                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        flexShrink: 0
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Badge de Origem do Item */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        {source === 'ai' ? (
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: '#001FD8',
                            backgroundColor: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            padding: '0.1rem 0.45rem',
                            borderRadius: 'var(--radius-full)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Sparkles size={10} color="#001FD8" /> Sugerido no Chat IA
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            backgroundColor: '#F1F5F9',
                            padding: '0.1rem 0.45rem',
                            borderRadius: 'var(--radius-full)'
                          }}>
                            Busca Tradicional
                          </span>
                        )}

                        <button
                          onClick={() => onRemoveItem(product.id)}
                          style={{ color: 'var(--text-muted)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          title="Remover do carrinho"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.25, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </h5>

                      {product.requiresPrescription && (
                        <div style={{ fontSize: '0.68rem', color: '#B91C1C', fontWeight: 600, marginBottom: '0.2rem' }}>
                          * Exige retenção de receita médica
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--pm-red)' }}>
                          R$ {(product.clubPrice * quantity).toFixed(2).replace('.', ',')}
                        </div>

                        {/* Controles de Quantidade */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.12rem 0.45rem',
                          backgroundColor: '#FFFFFF'
                        }}>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            style={{ padding: '0.1rem', color: 'var(--text-secondary)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            style={{ padding: '0.1rem', color: 'var(--text-secondary)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé e Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
          }}>
            {/* Aviso Farmacêutico caso contenha medicamento tarjado selecionado */}
            {hasRxItem && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-sm)',
                padding: '0.55rem 0.75rem',
                fontSize: '0.72rem',
                color: '#991B1B',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <ShieldCheck size={14} color="#DC2626" />
                <span>Itens com retenção de receita serão validados no checkout.</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
              <span>Subtotal ({selectedCount} item(ns)):</span>
              <span style={{ textDecoration: 'line-through' }}>R$ {totalOriginal.toFixed(2).replace('.', ',')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--pm-green)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <span>Economia Clube Sempre Bem:</span>
              <span>- R$ {totalSavings.toFixed(2).replace('.', ',')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.6rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Total a Pagar:</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--pm-red)' }}>
                R$ {totalClub.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              onClick={() => {
                if (selectedItems.length > 0) {
                  onProceedToCheckout();
                }
              }}
              disabled={selectedItems.length === 0}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedItems.length > 0 ? 'var(--pm-red)' : '#94A3B8',
                cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>
                {selectedItems.length > 0
                  ? `Seguir para o Checkout (${selectedCount} itens • R$ ${totalClub.toFixed(2).replace('.', ',')})`
                  : 'Selecione produtos acima para finalizar'}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CartDrawer;
