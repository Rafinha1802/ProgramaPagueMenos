import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Truck,
  CreditCard,
  Lock,
  CheckCircle2,
  Check
} from 'lucide-react';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onAddSampleItems
}) {
  // Estado de seleção de itens para compra no carrinho
  const [selectedIds, setSelectedIds] = useState(() => cartItems.map((i) => i.product.id));

  // Sincroniza novos itens adicionados ao carrinho mantendo-os selecionados
  useEffect(() => {
    setSelectedIds((prev) => {
      const existing = new Set(prev);
      cartItems.forEach((i) => existing.add(i.product.id));
      const cartSet = new Set(cartItems.map((i) => i.product.id));
      return Array.from(existing).filter((id) => cartSet.has(id));
    });
  }, [cartItems]);

  // Fechar com tecla Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  // Itens selecionados para checkout
  const effectiveSelected = selectedIds.length > 0
    ? cartItems.filter((i) => selectedIds.includes(i.product.id))
    : cartItems;

  const selectedCount = effectiveSelected.reduce((acc, item) => acc + item.quantity, 0);

  const totalClub = effectiveSelected.reduce(
    (acc, item) => acc + (item.product.clubPrice || item.product.price || 0) * item.quantity,
    0
  );
  const totalOriginal = effectiveSelected.reduce(
    (acc, item) => acc + (item.product.originalPrice || item.product.price || 0) * item.quantity,
    0
  );
  const totalSavings = Math.max(0, totalOriginal - totalClub);
  const freeShippingThreshold = 99.0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalClub);

  const hasRxItem = effectiveSelected.some((i) => i.product.requiresPrescription);

  const handleCheckoutClick = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout(effectiveSelected);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Drawer Container Desktop (Slide-over da direita) */}
      <div
        id="cart-drawer-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header da Cesta */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#001FD8'
              }}
            >
              <ShoppingBag size={22} color="#001FD8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Minha Cesta
                </h3>
                {cartItems.length > 0 && (
                  <span
                    style={{
                      backgroundColor: '#E30613',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      padding: '0.12rem 0.5rem',
                      borderRadius: '999px'
                    }}
                  >
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {cartItems.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'item' : 'itens'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.1rem' }}>
                Farmácia Pague Menos • Entrega Turbo em 45 min
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.color = '#64748B';
            }}
            title="Fechar (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de Meta de Frete Grátis Turbo */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid #DBEAFE',
            flexShrink: 0
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              marginBottom: '0.35rem'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: remainingForFreeShipping === 0 && selectedCount > 0 ? '#059669' : '#001FD8',
                fontWeight: 700
              }}
            >
              <Truck size={16} />
              {remainingForFreeShipping === 0 && selectedCount > 0
                ? 'Parabéns! Você ganhou Frete Grátis Turbo!'
                : `Faltam R$ ${remainingForFreeShipping.toFixed(2).replace('.', ',')} para Frete Grátis`}
            </span>
            <span style={{ fontWeight: 800, color: '#001FD8', fontSize: '0.74rem' }}>
              Meta: R$ 99,00
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#BFDBFE',
              borderRadius: '999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, (totalClub / freeShippingThreshold) * 100)}%`,
                height: '100%',
                backgroundColor: remainingForFreeShipping === 0 && selectedCount > 0 ? '#059669' : '#001FD8',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Barra de Seleção Rápida */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '0.65rem 1.5rem',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              flexShrink: 0
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                fontWeight: 800,
                color: '#001FD8',
                userSelect: 'none'
              }}
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

            <span style={{ fontWeight: 700, color: '#64748B' }}>
              {effectiveSelected.length} de {cartItems.length} selecionado(s)
            </span>
          </div>
        )}

        {/* Lista de Itens com Scroll */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  color: '#001FD8'
                }}
              >
                <ShoppingBag size={38} color="#001FD8" />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.45rem' }}>
                Sua cesta está vazia
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '320px', margin: '0 auto 1.5rem auto' }}>
                Adicione remédios ou produtos de cuidados diários para prosseguir para o pagamento e entrega turbo.
              </p>

              {/* Botão de Adicionar Itens de Teste Rápido */}
              {onAddSampleItems && (
                <button
                  type="button"
                  onClick={onAddSampleItems}
                  style={{
                    width: '100%',
                    backgroundColor: '#001FD8',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.85rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(0, 31, 216, 0.28)',
                    marginBottom: '0.75rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0017A3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#001FD8'}
                >
                  <Sparkles size={17} color="#FDE047" />
                  <span>Adicionar Itens e Ir para Pagamento</span>
                </button>
              )}

              {/* Botão de Ir para Checkout Diretamente */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                style={{
                  width: '100%',
                  backgroundColor: '#EFF6FF',
                  color: '#001FD8',
                  border: '1.5px solid #BFDBFE',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  marginBottom: '0.75rem',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
              >
                <CreditCard size={16} />
                <span>Ir para a Área de Pagamento / Checkout</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
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
                      borderRadius: '14px',
                      padding: '0.85rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center',
                      opacity: isSelected ? 1 : 0.6,
                      boxShadow: isSelected ? '0 2px 8px rgba(0, 31, 216, 0.06)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Checkbox de Seleção */}
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
                        width: '56px',
                        height: '56px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        padding: '2px',
                        flexShrink: 0
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        {source === 'ai' ? (
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 800,
                              color: '#001FD8',
                              backgroundColor: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              padding: '0.1rem 0.45rem',
                              borderRadius: '999px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Sparkles size={10} color="#001FD8" /> Recomendado por IA
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              color: '#64748B',
                              backgroundColor: '#F1F5F9',
                              padding: '0.1rem 0.45rem',
                              borderRadius: '999px'
                            }}
                          >
                            Farmácia Online
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          style={{
                            color: '#94A3B8',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: '0.2rem'
                          }}
                          title="Remover do carrinho"
                          onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <h5
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#0F172A',
                          lineHeight: 1.25,
                          marginBottom: '0.25rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {product.name}
                      </h5>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#E30613' }}>
                            R$ {((product.clubPrice || product.price) * quantity).toFixed(2).replace('.', ',')}
                          </div>
                          {product.originalPrice && product.originalPrice > (product.clubPrice || product.price) && (
                            <div style={{ fontSize: '0.68rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                              R$ {(product.originalPrice * quantity).toFixed(2).replace('.', ',')}
                            </div>
                          )}
                        </div>

                        {/* Controles de Quantidade */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '999px',
                            padding: '0.12rem 0.45rem',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            style={{
                              padding: '0.15rem',
                              color: '#475569',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer'
                            }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            style={{
                              padding: '0.15rem',
                              color: '#475569',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer'
                            }}
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

        {/* ====================================================================
            RODAPÉ FIXO DO CARRINHO COM O BOTÃO DE FINALIZAR COMPRA E IR AO PAGAMENTO
            ==================================================================== */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.15rem 1.5rem',
              borderTop: '1.5px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.06)',
              flexShrink: 0
            }}
          >
            {/* Aviso de Medicamento com Retenção de Receita */}
            {hasRxItem && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '10px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.72rem',
                  color: '#991B1B',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600
                }}
              >
                <ShieldCheck size={15} color="#DC2626" />
                <span>Medicamento tarjado selecionado: receita será conferida no pagamento.</span>
              </div>
            )}

            {/* Linhas de Valores */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.25rem' }}>
              <span>Subtotal ({selectedCount} item{selectedCount > 1 ? 's' : ''}):</span>
              <span style={{ textDecoration: 'line-through' }}>R$ {totalOriginal.toFixed(2).replace('.', ',')}</span>
            </div>

            {totalSavings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#059669', fontWeight: 800, marginBottom: '0.45rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={13} color="#059669" />
                  Desconto Clube Sempre Bem:
                </span>
                <span>- R$ {totalSavings.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '0.9rem',
                borderTop: '1px dashed #E2E8F0',
                paddingTop: '0.55rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0F172A' }}>Total a Pagar:</span>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                  Em até 6x sem juros ou 5% OFF no Pix
                </div>
              </div>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#E30613' }}>
                R$ {totalClub.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* BOTÃO PRINCIPAL: FINALIZAR COMPRA E IR PARA O PAGAMENTO */}
            <button
              id="btn-proceed-to-checkout"
              data-testid="checkout-btn"
              type="button"
              onClick={handleCheckoutClick}
              style={{
                width: '100%',
                padding: '0.95rem 1.25rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #E30613 0%, #B9050F 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 6px 20px rgba(227, 6, 19, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(227, 6, 19, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(227, 6, 19, 0.35)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                    padding: '0.45rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CreditCard size={18} color="#FFFFFF" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.98rem', fontWeight: 900, lineHeight: 1.15 }}>
                    Finalizar Compra
                  </div>
                  <div style={{ fontSize: '0.71rem', color: '#FEE2E2', fontWeight: 700 }}>
                    Ir para Pagamento (Pix, Cartão ou Boleto)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 900 }}>
                  R$ {totalClub.toFixed(2).replace('.', ',')}
                </span>
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>
            </button>

            {/* Selos de Segurança e Formas Aceitas */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '0.75rem',
                fontSize: '0.7rem',
                color: '#64748B',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lock size={12} color="#059669" /> Ambiente Seguro
              </span>
              <span>•</span>
              <span>Pix à Vista</span>
              <span>•</span>
              <span>Cartão de Crédito</span>
              <span>•</span>
              <span>Boleto</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
