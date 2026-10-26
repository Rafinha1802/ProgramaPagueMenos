import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  Store,
  Clock,
  ShieldCheck,
  Upload,
  CreditCard,
  QrCode,
  AlertTriangle,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export function CheckoutModal({ isOpen, onClose, cartItems, onCompleteOrder }) {
  const [deliveryMethod, setDeliveryMethod] = useState('turbo'); // 'turbo' | 'retire'
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [rxUploaded, setRxUploaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const totalClub = cartItems.reduce((acc, item) => acc + item.product.clubPrice * item.quantity, 0);
  const totalOriginal = cartItems.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const totalSavings = totalOriginal - totalClub;
  const deliveryFee = deliveryMethod === 'retire' ? 0 : (totalClub >= 99 ? 0 : 7.90);
  const pixDiscount = paymentMethod === 'pix' ? totalClub * 0.05 : 0;
  const finalTotal = totalClub + deliveryFee - pixDiscount;

  const hasRxItem = cartItems.some((i) => i.product.requiresPrescription);
  const rxItems = cartItems.filter((i) => i.product.requiresPrescription);

  const handleFinish = async () => {
    const deliveryType = deliveryMethod === 'retire'
      ? 'Retirada Express em Loja (Loja Jardins)'
      : 'Entrega Turbo Express (45 min)';
    const payment = paymentMethod === 'pix' ? 'Pix à Vista' : 'Cartão de Crédito';
    const address = deliveryMethod === 'retire'
      ? 'Retirado na Loja Pague Menos - Rua Augusta, 1420'
      : 'Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP';

    try {
      const res = await onCompleteOrder({
        deliveryType,
        paymentMethod: payment,
        address
      });
      const orderNum = res?.pedido_id || ('FV-' + Math.floor(100000 + Math.random() * 900000));
      setOrderNumber(orderNum);
      setIsSuccess(true);
    } catch (err) {
      console.error('Falha ao processar checkout no backend:', err);
      // Não transiciona para tela de sucesso se o checkout falhar
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(3px)',
      zIndex: 2100,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxHeight: '94%',
        backgroundColor: '#FFFFFF',
        borderRadius: '26px 26px 0 0',
        boxShadow: '0 -8px 25px rgba(0,0,0,0.3)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* Header do Checkout */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--pm-blue-dark)',
          color: '#FFFFFF'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {isSuccess ? 'Pedido Confirmado com Sucesso!' : 'Finalização de Compra • Pague Menos'}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#93C5FD' }}>
              {isSuccess ? 'Sua farmácia já está preparando os itens' : 'Fluxo seguro de entrega e conferência farmacêutica'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        {isSuccess ? (
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              backgroundColor: '#ECFDF5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={44} color="#059669" />
            </div>

            <span style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              backgroundColor: 'var(--pm-blue-light)',
              color: 'var(--pm-blue)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)'
            }}>
              PEDIDO #{orderNumber}
            </span>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              Compra Finalizada com Sucesso!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
              Sua cesta integrada (com itens da busca tradicional e sugestões inteligentes da IA) foi encaminhada para a loja <strong>Pague Menos Paulista</strong>.
            </p>

            {/* Card de Previsão */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid var(--border-light)',
              textAlign: 'left',
              maxWidth: '480px',
              margin: '0 auto 1.75rem auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Clock size={20} color="var(--pm-blue)" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Previsão de Recebimento:
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--pm-green)', fontWeight: 800 }}>
                    {deliveryMethod === 'retire' ? 'Pronto para retirada em 30 minutos' : 'Chega em até 45 minutos (Entrega Turbo)'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <ShieldCheck size={20} color="#059669" />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Farmacêutica responsável: <strong>Dra. Camila Nogueira (CRF/SP 48.912)</strong>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
              Voltar à Página Inicial
            </button>
          </div>
        ) : (
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 1. Modalidade de Entrega */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                1. Escolha como deseja receber:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                
                {/* Entrega Turbo */}
                <div
                  onClick={() => setDeliveryMethod('turbo')}
                  style={{
                    border: deliveryMethod === 'turbo' ? '2px solid var(--pm-red)' : '1px solid var(--border-light)',
                    backgroundColor: deliveryMethod === 'turbo' ? '#FFF5F5' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Truck size={18} color="var(--pm-red)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Entrega Turbo (1h)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Motoboy direto da farmácia até seu endereço
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: deliveryFee === 0 ? 'var(--pm-green)' : 'var(--pm-red)' }}>
                    {deliveryFee === 0 ? 'GRÁTIS (Sempre Bem Pague Menos)' : 'R$ 7,90'}
                  </div>
                </div>

                {/* Clique & Retire */}
                <div
                  onClick={() => setDeliveryMethod('retire')}
                  style={{
                    border: deliveryMethod === 'retire' ? '2px solid var(--pm-blue)' : '1px solid var(--border-light)',
                    backgroundColor: deliveryMethod === 'retire' ? 'var(--pm-blue-light)' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Store size={18} color="var(--pm-blue)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Clique & Retire (30min)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Loja Pague Menos: Av. Paulista, 1000
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--pm-green)' }}>
                    GRÁTIS
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Camada de Segurança Farmacêutica (ANVISA) - Condicional */}
            {hasRxItem && (
              <div style={{
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #FCD34D',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <AlertTriangle size={22} color="#D97706" style={{ flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400E' }}>
                      Camada de Segurança: Medicamento Sob Prescrição Médica
                    </h5>
                    <p style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '0.2rem', lineHeight: 1.4 }}>
                      Seu pedido contém: <strong>{rxItems.map(i => i.product.name).join(', ')}</strong>.
                      Em cumprimento à legislação sanitária (ANVISA), a dispensação exige retenção da receita.
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  border: '1px dashed #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    {rxUploaded ? (
                      <span style={{ color: 'var(--pm-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={16} /> Receita digital anexada com sucesso!
                      </span>
                    ) : (
                      <span>Você pode enviar a receita digital agora ou apresentar ao entregador na chegada.</span>
                    )}
                  </div>
                  <button
                    onClick={() => setRxUploaded(!rxUploaded)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      backgroundColor: rxUploaded ? '#ECFDF5' : '#FEF3C7',
                      color: rxUploaded ? '#065F46' : '#92400E',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      border: '1px solid #FCD34D'
                    }}
                  >
                    <Upload size={13} />
                    {rxUploaded ? 'Alterar Receita' : 'Anexar Receita'}
                  </button>
                </div>
              </div>
            )}

            {/* 3. Forma de Pagamento */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                3. Forma de Pagamento:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                
                <div
                  onClick={() => setPaymentMethod('pix')}
                  style={{
                    border: paymentMethod === 'pix' ? '2px solid var(--pm-green)' : '1px solid var(--border-light)',
                    backgroundColor: paymentMethod === 'pix' ? '#F0FDF4' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <QrCode size={18} color="var(--pm-green)" />
                    <span>Pix Instantâneo</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--pm-green)', fontWeight: 700, marginTop: '0.2rem' }}>
                    5% OFF adicional no Pix
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cartao')}
                  style={{
                    border: paymentMethod === 'cartao' ? '2px solid var(--pm-blue)' : '1px solid var(--border-light)',
                    backgroundColor: paymentMethod === 'cartao' ? 'var(--pm-blue-light)' : '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CreditCard size={18} color="var(--pm-blue)" />
                    <span>Cartão de Crédito</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Em até 4x sem juros
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Resumo de Valores */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--border-light)',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal dos Produtos:</span>
                <span>R$ {totalClub.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Frete:</span>
                <span style={{ color: deliveryFee === 0 ? 'var(--pm-green)' : 'inherit', fontWeight: deliveryFee === 0 ? 700 : 400 }}>
                  {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
              {paymentMethod === 'pix' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: 'var(--pm-green)', fontWeight: 700 }}>
                  <span>Desconto Extra Pix (5%):</span>
                  <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderTop: '1px dashed var(--border-light)',
                paddingTop: '0.5rem',
                marginTop: '0.5rem'
              }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Total da Compra:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--pm-red)' }}>
                  R$ {finalTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Botão de Finalização */}
            <button
              onClick={handleFinish}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 15px rgba(216, 26, 36, 0.3)'
              }}
            >
              <span>Concluir Pedido com Segurança Farmacêutica</span>
              <PackageCheck size={20} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
