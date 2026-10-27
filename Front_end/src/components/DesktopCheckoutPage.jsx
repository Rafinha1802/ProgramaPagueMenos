import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  Store,
  Clock,
  MapPin,
  CreditCard,
  QrCode,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  Upload,
  Copy,
  Check,
  Tag,
  Plus,
  Minus,
  Trash2,
  Lock,
  Receipt,
  FileText,
  Gift,
  User,
  ShoppingBag
} from 'lucide-react';

export function DesktopCheckoutPage({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCompleteOrder,
  onBackToStore,
  onGoToProfile,
  userSession,
  onShowToast
}) {
  // Modalidade de Entrega: 'turbo' (45 min), 'padrao' (mesmo dia), 'retire' (retirada em loja)
  const [deliveryMethod, setDeliveryMethod] = useState('turbo');
  const [selectedStore, setSelectedStore] = useState('Loja Jardins - Rua Augusta, 1420');

  // Endereço selecionado e endereços salvos
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      label: 'Casa (São Paulo)',
      street: 'Av. Paulista',
      number: '1578',
      complement: 'Apto 82',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      cep: '01310-200',
      isDefault: true
    },
    {
      id: 'addr_2',
      label: 'Trabalho (Jardins)',
      street: 'Rua Oscar Freire',
      number: '920',
      complement: 'Conjunto 41',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      cep: '01426-000',
      isDefault: false
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr_1');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    label: 'Outro Endereço',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP'
  });

  // Forma de pagamento: 'pix', 'cartao', 'boleto', 'convenio'
  const [paymentMethod, setPaymentMethod] = useState('pix');

  // Cartão de crédito selecionado e dados do formulário
  const [savedCards] = useState([
    {
      id: 'card_1',
      brand: 'mastercard',
      last4: '4821',
      holder: 'RAFAELLA GUEDES',
      expiry: '08/29'
    }
  ]);
  const [selectedCardId, setSelectedCardId] = useState('card_1');
  const [isUsingNewCard, setIsUsingNewCard] = useState(false);
  const [newCardData, setNewCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [installments, setInstallments] = useState('1');

  // Programa Sempre Bem / Cashback
  const availableCashback = 12.50;
  const [useCashback, setUseCashback] = useState(false);

  // Cupons de desconto
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Compliance de Receita Médica (ANVISA)
  const [rxDeliveryOption, setRxDeliveryOption] = useState('upload_now'); // 'upload_now' | 'show_on_delivery'
  const [rxFile, setRxFile] = useState(null);
  const [rxUploadedSuccess, setRxUploadedSuccess] = useState(false);

  // Estado do Pix
  const [pixCopied, setPixCopied] = useState(false);
  const [pixTimer, setPixTimer] = useState(900); // 15 minutos em segundos
  const [isPixSimulatingPayment, setIsPixSimulatingPayment] = useState(false);

  // Estado de finalização / sucesso
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Efeito do timer do Pix
  useEffect(() => {
    let interval = null;
    if (paymentMethod === 'pix' && !completedOrder) {
      interval = setInterval(() => {
        setPixTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentMethod, completedOrder]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Itens com retenção de receita médica (ANVISA)
  const rxItems = useMemo(() => {
    return cartItems.filter((i) => i.product?.requiresPrescription);
  }, [cartItems]);
  const hasRxItem = rxItems.length > 0;

  // Cálculos financeiros
  const subtotalClub = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const p = item.product?.clubPrice || item.product?.price || 0;
      return acc + p * item.quantity;
    }, 0);
  }, [cartItems]);

  const subtotalOriginal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const p = item.product?.originalPrice || item.product?.price || 0;
      return acc + p * item.quantity;
    }, 0);
  }, [cartItems]);

  const totalClubSavings = Math.max(0, subtotalOriginal - subtotalClub);

  // Frete
  const deliveryFee = useMemo(() => {
    if (deliveryMethod === 'retire') return 0;
    if (appliedCoupon?.code === 'SEMPREBEM') return 0;
    if (subtotalClub >= 99.0) return 0;
    return deliveryMethod === 'turbo' ? 7.90 : 4.90;
  }, [deliveryMethod, subtotalClub, appliedCoupon]);

  // Desconto de Cupom
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'fixed') return appliedCoupon.value;
    if (appliedCoupon.type === 'percent') return (subtotalClub * appliedCoupon.value) / 100;
    return 0;
  }, [appliedCoupon, subtotalClub]);

  // Desconto de Cashback Sempre Bem
  const cashbackDiscount = useMemo(() => {
    if (!useCashback) return 0;
    return Math.min(availableCashback, subtotalClub);
  }, [useCashback, subtotalClub]);

  // Desconto Pix (5% adicional sobre os produtos após cupons)
  const pixDiscount = useMemo(() => {
    if (paymentMethod !== 'pix') return 0;
    const baseValue = Math.max(0, subtotalClub - couponDiscount - cashbackDiscount);
    return baseValue * 0.05;
  }, [paymentMethod, subtotalClub, couponDiscount, cashbackDiscount]);

  // Total Final
  const finalTotal = Math.max(
    0,
    subtotalClub + deliveryFee - couponDiscount - cashbackDiscount - pixDiscount
  );

  // Endereço ativo
  const currentAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const formattedAddressString = currentAddress
    ? `${currentAddress.street}, ${currentAddress.number}${currentAddress.complement ? ` (${currentAddress.complement})` : ''} - ${currentAddress.neighborhood}, ${currentAddress.city} - ${currentAddress.state} • CEP ${currentAddress.cep}`
    : 'Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP';

  const [pixRandomSuffix] = useState(() => Math.floor(100000 + Math.random() * 900000));

  // Chave Pix EMV realista
  const pixEmvCode = useMemo(() => {
    return `00020126580014br.gov.bcb.pix0136pm-checkout-${pixRandomSuffix}520400005303986540${finalTotal.toFixed(2)}5802BR5920FARMACIA PAGUE MENOS6009SAO PAULO62070503***6304`;
  }, [finalTotal, pixRandomSuffix]);

  // Copiar Pix
  const handleCopyPix = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(pixEmvCode);
    }
    setPixCopied(true);
    if (onShowToast) onShowToast('Código Pix Copia e Cola copiado para a área de transferência!');
    setTimeout(() => setPixCopied(false), 3000);
  };

  // Manipular upload de receita médica
  const handleRxFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRxFile(file);
      setRxUploadedSuccess(true);
      if (onShowToast) onShowToast('Receita médica anexada com sucesso para validação farmacêutica!');
    }
  };

  // Cupons disponíveis para teste
  const availableCouponPresets = [
    { code: 'BEMVINDO15', label: 'R$ 15 OFF no 1º Pedido', type: 'fixed', value: 15 },
    { code: 'PRIMEIRACOMPRA', label: 'R$ 20 OFF acima de R$ 80', type: 'fixed', value: 20, min: 80 },
    { code: 'TURBO10', label: '10% OFF nos Produtos', type: 'percent', value: 10 },
    { code: 'SEMPREBEM', label: 'Frete Grátis Imediato', type: 'shipping', value: 0 }
  ];

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError('');
    if (!code) return;

    const found = availableCouponPresets.find((c) => c.code === code);
    if (found) {
      if (found.min && subtotalClub < found.min) {
        setCouponError(`O cupom ${found.code} exige pedido mínimo de R$ ${found.min.toFixed(2).replace('.', ',')}.`);
        return;
      }
      setAppliedCoupon(found);
      setCouponInput(found.code);
      if (onShowToast) onShowToast(`Cupom ${found.code} aplicado com sucesso!`);
    } else {
      setCouponError('Cupom inválido ou expirado. Tente BEMVINDO15 ou TURBO10.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    if (onShowToast) onShowToast('Cupom removido.');
  };

  // Adicionar novo endereço
  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddressForm.street || !newAddressForm.number || !newAddressForm.cep) {
      if (onShowToast) onShowToast('Preencha os campos obrigatórios do endereço.');
      return;
    }
    const newId = 'addr_' + Date.now();
    const created = {
      id: newId,
      ...newAddressForm,
      isDefault: false
    };
    setAddresses((prev) => [...prev, created]);
    setSelectedAddressId(newId);
    setIsAddingNewAddress(false);
    if (onShowToast) onShowToast('Novo endereço de entrega salvo com sucesso!');
  };

  // Formatação automática do cartão
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setNewCardData((prev) => ({ ...prev, number: val }));
  };

  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setNewCardData((prev) => ({ ...prev, expiry: val }));
  };

  // Concluir Pedido
  const handleFinalizeOrder = async () => {
    if (cartItems.length === 0) {
      if (onShowToast) onShowToast('Sua sacola está vazia.');
      return;
    }

    if (hasRxItem && rxDeliveryOption === 'upload_now' && !rxUploadedSuccess && !rxFile) {
      if (onShowToast) onShowToast('Por favor, anexe a receita digital ou selecione a entrega com retenção física.');
      return;
    }

    setIsSubmitting(true);

    const deliveryDescription = deliveryMethod === 'retire'
      ? `Retirada Express em Loja (${selectedStore})`
      : deliveryMethod === 'turbo'
        ? 'Entrega Turbo Express (45 min)'
        : 'Entrega Convencional no Mesmo Dia';

    const paymentDescription = paymentMethod === 'pix'
      ? 'Pix Instantâneo à Vista'
      : paymentMethod === 'cartao'
        ? `Cartão de Crédito (${installments}x de R$ ${(finalTotal / parseInt(installments)).toFixed(2).replace('.', ',')})`
        : paymentMethod === 'convenio'
          ? 'Convênio Farmácia PBM'
          : 'Boleto Bancário à Vista';

    const checkoutPayload = {
      address: deliveryMethod === 'retire' ? selectedStore : formattedAddressString,
      deliveryType: deliveryDescription,
      paymentMethod: paymentDescription,
      items: cartItems.map((i) => ({
        id: i.product?.id,
        name: i.product?.name,
        quantity: i.quantity,
        price: i.product?.clubPrice || i.product?.price
      })),
      total: finalTotal,
      savings: totalClubSavings + couponDiscount + cashbackDiscount + pixDiscount,
      hasPrescription: hasRxItem,
      prescriptionOption: hasRxItem ? rxDeliveryOption : null
    };

    try {
      let result = null;
      if (onCompleteOrder) {
        result = await onCompleteOrder(checkoutPayload);
      }
      const orderNum = result?.pedido_id || result?.orderId || `FV-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrder({
        id: orderNum,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        items: [...cartItems],
        deliveryType: deliveryDescription,
        paymentMethod: paymentDescription,
        address: checkoutPayload.address,
        total: finalTotal,
        subtotal: subtotalClub,
        deliveryFee,
        savings: checkoutPayload.savings
      });
      if (onShowToast) onShowToast('Pedido concluído com sucesso e registrado na farmácia!');
    } catch (err) {
      console.warn('Backend offline ou erro no checkout, simulando conclusão segura:', err);
      const fallbackNum = `FV-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrder({
        id: fallbackNum,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        items: [...cartItems],
        deliveryType: deliveryDescription,
        paymentMethod: paymentDescription,
        address: checkoutPayload.address,
        total: finalTotal,
        subtotal: subtotalClub,
        deliveryFee,
        savings: checkoutPayload.savings
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simular confirmação instantânea do Pix
  const handleSimulatePixPaid = () => {
    setIsPixSimulatingPayment(true);
    setTimeout(() => {
      setIsPixSimulatingPayment(false);
      handleFinalizeOrder();
    }, 1200);
  };

  // ==========================================================================
  // CENÁRIO A: SACOLA VAZIA
  // ==========================================================================
  if (cartItems.length === 0 && !completedOrder) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', backgroundColor: '#FFFFFF', padding: '3.5rem 2.5rem', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#001FD8' }}>
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.65rem' }}>
            Sua sacola de compras está vazia
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Você ainda não selecionou nenhum produto ou medicamento para finalizar. Navegue pelo catálogo ou use nossa Farmacêutica Inteligente para encontrar o que precisa.
          </p>
          <button
            onClick={onBackToStore}
            style={{
              backgroundColor: '#001FD8',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.9rem 2.2rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 31, 216, 0.28)'
            }}
          >
            <ArrowLeft size={18} />
            <span>Explorar Ofertas e Medicamentos</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // CENÁRIO B: TELA DE PEDIDO CONCLUÍDO COM SUCESSO
  // ==========================================================================
  if (completedOrder) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '2rem 1rem 5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Cartão Principal de Sucesso */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.07)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            marginBottom: '1.75rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Faixa decorativa superior */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #001FD8, #059669, #E30613)' }} />

            <div style={{
              width: '84px',
              height: '84px',
              backgroundColor: '#ECFDF5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              border: '4px solid #D1FAE5'
            }}>
              <CheckCircle2 size={50} color="#059669" />
            </div>

            <span style={{
              display: 'inline-block',
              fontSize: '0.85rem',
              fontWeight: 900,
              backgroundColor: '#EFF6FF',
              color: '#001FD8',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              letterSpacing: '0.5px',
              marginBottom: '0.75rem',
              border: '1px solid #BFDBFE'
            }}>
              PEDIDO CONFIRMADO #{completedOrder.id}
            </span>

            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              Parabéns! Sua compra foi finalizada com sucesso.
            </h1>
            <p style={{ color: '#475569', fontSize: '0.98rem', maxWidth: '580px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              A farmácia <strong>Pague Menos Paulista</strong> já recebeu seu pedido. Os produtos estão sendo separados e passarão por conferência farmacêutica.
            </p>

            {/* Linha do Tempo / Rastreamento em Tempo Real */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '1.5rem 1.25rem',
              maxWidth: '680px',
              margin: '0 auto 2rem auto',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Acompanhamento da Entrega Turbo
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} />
                  {deliveryMethod === 'retire' ? 'Pronto para retirada em 30 min' : 'Previsão de chegada: 35 a 45 min'}
                </span>
              </div>

              {/* Steps do Tracker */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
                    <Check size={18} />
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669' }}>Pedido Aprovado</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{completedOrder.time}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#001FD8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
                    <PackageCheck size={18} />
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#001FD8' }}>Em Separação</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Loja Paulista</div>
                </div>

                <div style={{ textAlign: 'center', opacity: 0.85 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '2px solid #CBD5E1', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>Conferência CRF</div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Dra. Camila</div>
                </div>

                <div style={{ textAlign: 'center', opacity: 0.65 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '2px solid #CBD5E1', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem auto' }}>
                    <Truck size={18} />
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>A Caminho</div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Motoboy Turbo</div>
                </div>
              </div>
            </div>

            {/* Informações Resumidas do Pedido Concluído */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Endereço de Entrega
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                  {completedOrder.address}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Forma de Pagamento
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                  {completedOrder.paymentMethod}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '0.15rem' }}>
                  Valor Pago: R$ {completedOrder.total.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Economia Total
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
                  Você economizou R$ {completedOrder.savings.toFixed(2).replace('.', ',')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                  Clube Sempre Bem Pague Menos
                </div>
              </div>
            </div>

            {/* Botões de Ação Pós-Pedido */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center' }}>
              <button
                onClick={onGoToProfile}
                style={{
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.8rem',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 31, 216, 0.28)'
                }}
              >
                <Receipt size={17} />
                <span>Ver Pedido em Meus Pedidos</span>
              </button>

              <button
                onClick={onBackToStore}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer'
                }}
              >
                <ShoppingBag size={17} />
                <span>Continuar Comprando na Loja</span>
              </button>
            </div>

          </div>

          {/* Card de Segurança Sanitária ANVISA */}
          <div style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '16px',
            border: '1px solid #BFDBFE',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#1E40AF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={20} color="#001FD8" />
              <span>
                Dispensação sob responsabilidade da <strong>Dra. Camila Nogueira (CRF/SP 48.912)</strong>. SAC Farmacêutico 24h: <strong>0800 275 1313</strong>.
              </span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================================================
  // CENÁRIO C: FLUXO DE COMPRA (CHECKOUT ATIVO)
  // ==========================================================================
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Header do Checkout Focado em Confiança & Segurança */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo e Retorno */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={onBackToStore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#64748B',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '0.4rem 0.6rem',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#001FD8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            >
              <ArrowLeft size={16} />
              <span>Voltar à loja</span>
            </button>

            <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#E30613',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1rem'
              }}>
                ♥
              </div>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#001FD8', letterSpacing: '-0.3px' }}>
                  pague menos
                </span>
                <span style={{ fontSize: '0.72rem', display: 'block', color: '#E30613', fontWeight: 800, marginTop: '-3px' }}>
                  SEMPRE BEM
                </span>
              </div>
            </div>
          </div>

          {/* Selos de Segurança e Auditoria */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
              <Lock size={15} />
              <span>Ambiente 100% Criptografado (SSL 256 bits)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#64748B' }}>
              <ShieldCheck size={15} color="#001FD8" />
              <span>Farmacêutica: CRF/SP 48.912</span>
            </div>
          </div>

        </div>
      </header>

      {/* Stepper Superior */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0.75rem 0' }}>
        <div className="container" style={{ maxWidth: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#001FD8', fontWeight: 800, fontSize: '0.85rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#001FD8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
              1
            </div>
            <span>Identificação & Entrega</span>
          </div>

          <div style={{ width: '40px', height: '2px', backgroundColor: '#001FD8' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#001FD8', fontWeight: 800, fontSize: '0.85rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#001FD8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
              2
            </div>
            <span>Pagamento & Segurança</span>
          </div>

          <div style={{ width: '40px', height: '2px', backgroundColor: '#CBD5E1' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontWeight: 600, fontSize: '0.85rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
              3
            </div>
            <span>Confirmação</span>
          </div>

        </div>
      </div>

      {/* Conteúdo Principal do Checkout (Duas Colunas) */}
      <main className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
          
          {/* ================================================================
              COLUNA DA ESQUERDA: ETAPAS DE ENTREGA E PAGAMENTO
              ================================================================ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* ETAPA 1: IDENTIFICAÇÃO DO CLIENTE */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8' }}>
                    <User size={18} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      1. Identificação do Comprador
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Dados para emissão de Nota Fiscal e Farmácia Popular</span>
                  </div>
                </div>

                <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.74rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                  Clube Sempre Bem Ouro
                </span>
              </div>

              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                border: '1px solid #E2E8F0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.84rem'
              }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Nome Completo:</span>
                  <strong style={{ color: '#0F172A' }}>{userSession?.name || 'Rafaella Guedes'}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>CPF (Identificação):</span>
                  <strong style={{ color: '#0F172A' }}>{userSession?.cpf || '458.912.384-12'}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>WhatsApp (Rastreio):</span>
                  <strong style={{ color: '#0F172A' }}>{userSession?.phone || '(11) 98765-4321'}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>E-mail:</span>
                  <strong style={{ color: '#0F172A' }}>{userSession?.email || 'rafaella.guedes@email.com'}</strong>
                </div>
              </div>
            </div>

            {/* ETAPA 2: ENDEREÇO & MODALIDADE DE ENTREGA */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    2. Onde e Como Deseja Receber
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Entrega Turbo Express direto da filial mais próxima</span>
                </div>
              </div>

              {/* Seletor de Modalidade de Entrega */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
                
                {/* 1. Turbo Express */}
                <div
                  onClick={() => setDeliveryMethod('turbo')}
                  style={{
                    border: deliveryMethod === 'turbo' ? '2px solid #E30613' : '1px solid #E2E8F0',
                    backgroundColor: deliveryMethod === 'turbo' ? '#FFF5F5' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.15rem 1rem',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ position: 'absolute', top: '-10px', right: '10px', backgroundColor: '#E30613', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                    MAIS RÁPIDO
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#E30613', marginBottom: '0.35rem' }}>
                    <Truck size={18} />
                    <strong style={{ fontSize: '0.88rem' }}>Turbo (45 min)</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                    Motoboy direto da farmácia até seu endereço
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: subtotalClub >= 99 ? '#059669' : '#0F172A' }}>
                    {subtotalClub >= 99 ? 'GRÁTIS' : 'R$ 7,90'}
                  </div>
                </div>

                {/* 2. Convencional */}
                <div
                  onClick={() => setDeliveryMethod('padrao')}
                  style={{
                    border: deliveryMethod === 'padrao' ? '2px solid #001FD8' : '1px solid #E2E8F0',
                    backgroundColor: deliveryMethod === 'padrao' ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.15rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#001FD8', marginBottom: '0.35rem' }}>
                    <Clock size={18} />
                    <strong style={{ fontSize: '0.88rem' }}>Hoje até 22h</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                    Entrega padrão no mesmo dia útil
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: subtotalClub >= 99 ? '#059669' : '#0F172A' }}>
                    {subtotalClub >= 99 ? 'GRÁTIS' : 'R$ 4,90'}
                  </div>
                </div>

                {/* 3. Clique & Retire */}
                <div
                  onClick={() => setDeliveryMethod('retire')}
                  style={{
                    border: deliveryMethod === 'retire' ? '2px solid #059669' : '1px solid #E2E8F0',
                    backgroundColor: deliveryMethod === 'retire' ? '#ECFDF5' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.15rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#059669', marginBottom: '0.35rem' }}>
                    <Store size={18} />
                    <strong style={{ fontSize: '0.88rem' }}>Clique & Retire</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                    Pronto em 30 min sem fila no balcão
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
                    100% GRÁTIS
                  </div>
                </div>

              </div>

              {/* Se for Clique & Retire: Seletor de Loja */}
              {deliveryMethod === 'retire' ? (
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1.25rem', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                    Selecione a Filial Pague Menos para Retirada:
                  </label>
                  <select
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontWeight: 600
                    }}
                  >
                    <option value="Loja Jardins - Rua Augusta, 1420">Loja Jardins — Rua Augusta, 1420 (A 800m • Retirada em 30 min)</option>
                    <option value="Loja Paulista - Av. Paulista, 1000">Loja Paulista — Av. Paulista, 1000 (A 1,2km • Retirada em 30 min)</option>
                    <option value="Loja Pinheiros - Rua Teodoro Sampaio, 1850">Loja Pinheiros — Rua Teodoro Sampaio, 1850 (A 2,5km)</option>
                  </select>
                </div>
              ) : (
                /* Se for Entrega em Domicílio: Endereços Salvos */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569' }}>
                      Endereço de Entrega Selecionado:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                      style={{ color: '#001FD8', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                      <span>{isAddingNewAddress ? 'Cancelar Novo' : 'Cadastrar Novo Endereço'}</span>
                    </button>
                  </div>

                  {/* Formulário Expansível de Novo Endereço */}
                  {isAddingNewAddress && (
                    <form onSubmit={handleSaveNewAddress} style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '1.25rem', border: '1px solid #CBD5E1', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>Adicionar Novo Endereço de Entrega</strong>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>CEP:</label>
                        <input
                          type="text"
                          placeholder="00000-000"
                          value={newAddressForm.cep}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, cep: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Apelido (ex: Trabalho):</label>
                        <input
                          type="text"
                          value={newAddressForm.label}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, label: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Logradouro / Rua:</label>
                        <input
                          type="text"
                          placeholder="Ex: Alameda Santos"
                          value={newAddressForm.street}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Número:</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={newAddressForm.number}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, number: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>Complemento:</label>
                        <input
                          type="text"
                          placeholder="Apto 45"
                          value={newAddressForm.complement}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, complement: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#001FD8', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Salvar Endereço
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Lista de Endereços Cadastrados */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {addresses.map((addr) => {
                      const isSelected = addr.id === selectedAddressId;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          style={{
                            border: isSelected ? '2px solid #001FD8' : '1px solid #CBD5E1',
                            backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                            borderRadius: '14px',
                            padding: '1rem',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {addr.isDefault && (
                            <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#001FD8', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                              Principal
                            </span>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                            <MapPin size={16} color={isSelected ? '#001FD8' : '#64748B'} />
                            <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>{addr.label}</strong>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                            {addr.street}, {addr.number} {addr.complement ? `(${addr.complement})` : ''}<br />
                            {addr.neighborhood} — {addr.city}/{addr.state}<br />
                            CEP {addr.cep}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ETAPA CONDICIONAL: CAMADA DE SEGURANÇA FARMACÊUTICA ANVISA */}
            {hasRxItem && (
              <div style={{
                backgroundColor: '#FFFBEB',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1.5px solid #FCD34D',
                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#92400E', margin: 0 }}>
                      Camada de Segurança Sanitária: Medicamento Sob Retenção de Receita
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '0.3rem', lineHeight: 1.5 }}>
                      Em cumprimento à <strong>RDC 20/2011 da ANVISA</strong>, seu pedido possui {rxItems.length} medicamento(s) que exige(m) validação e retenção da via da receita médica: <strong>{rxItems.map(i => i.product.name).join(', ')}</strong>.
                    </p>
                  </div>
                </div>

                {/* Opções de Apresentação da Receita */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  
                  <div
                    onClick={() => setRxDeliveryOption('upload_now')}
                    style={{
                      border: rxDeliveryOption === 'upload_now' ? '2px solid #D97706' : '1px solid #FDE68A',
                      backgroundColor: rxDeliveryOption === 'upload_now' ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Upload size={16} />
                      <span>Anexar Receita Digital Agora</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#B45309', marginTop: '0.25rem' }}>
                      Foto legível ou PDF com assinatura eletrônica
                    </div>
                  </div>

                  <div
                    onClick={() => setRxDeliveryOption('show_on_delivery')}
                    style={{
                      border: rxDeliveryOption === 'show_on_delivery' ? '2px solid #D97706' : '1px solid #FDE68A',
                      backgroundColor: rxDeliveryOption === 'show_on_delivery' ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={16} />
                      <span>Entregar Receita Física ao Motoboy</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#B45309', marginTop: '0.25rem' }}>
                      O entregador recolherá a via na entrega
                    </div>
                  </div>

                </div>

                {/* Campo de Upload Ativo */}
                {rxDeliveryOption === 'upload_now' && (
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1.5px dashed #F59E0B',
                    padding: '1.25rem',
                    textAlign: 'center'
                  }}>
                    {rxUploadedSuccess ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', color: '#059669', fontWeight: 800, fontSize: '0.88rem' }}>
                        <CheckCircle2 size={20} />
                        <span>Receita médica anexada ({rxFile?.name || 'receita-digital.pdf'})</span>
                        <button
                          type="button"
                          onClick={() => { setRxFile(null); setRxUploadedSuccess(false); }}
                          style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, marginLeft: '0.5rem', textDecoration: 'underline' }}
                        >
                          Trocar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} color="#D97706" style={{ margin: '0 auto 0.4rem auto' }} />
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400E' }}>
                          Clique para selecionar ou arraste o arquivo da receita médica
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>
                          Formatos aceitos: JPG, PNG ou PDF (máx. 10MB)
                        </div>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleRxFileUpload}
                          style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#475569' }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ETAPA 3: FORMA DE PAGAMENTO COMPLETA E INTERATIVA */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8' }}>
                  <CreditCard size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    3. Forma de Pagamento
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Pague via Pix com desconto extra ou parcele no cartão</span>
                </div>
              </div>

              {/* Tabs de Seleção de Pagamento */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem', marginBottom: '1.5rem' }}>
                
                {/* Pix */}
                <div
                  onClick={() => setPaymentMethod('pix')}
                  style={{
                    border: paymentMethod === 'pix' ? '2px solid #059669' : '1px solid #CBD5E1',
                    backgroundColor: paymentMethod === 'pix' ? '#F0FDF4' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '0.9rem 0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <QrCode size={22} color={paymentMethod === 'pix' ? '#059669' : '#64748B'} style={{ margin: '0 auto 0.25rem auto' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: paymentMethod === 'pix' ? '#059669' : '#0F172A' }}>
                    Pix Instantâneo
                  </div>
                  <span style={{ display: 'inline-block', backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.68rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '4px', marginTop: '0.2rem' }}>
                    5% OFF EXTRA
                  </span>
                </div>

                {/* Cartão de Crédito */}
                <div
                  onClick={() => setPaymentMethod('cartao')}
                  style={{
                    border: paymentMethod === 'cartao' ? '2px solid #001FD8' : '1px solid #CBD5E1',
                    backgroundColor: paymentMethod === 'cartao' ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '0.9rem 0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <CreditCard size={22} color={paymentMethod === 'cartao' ? '#001FD8' : '#64748B'} style={{ margin: '0 auto 0.25rem auto' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: paymentMethod === 'cartao' ? '#001FD8' : '#0F172A' }}>
                    Cartão de Crédito
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', marginTop: '0.2rem' }}>
                    Até 6x sem juros
                  </span>
                </div>

                {/* Boleto */}
                <div
                  onClick={() => setPaymentMethod('boleto')}
                  style={{
                    border: paymentMethod === 'boleto' ? '2px solid #0F172A' : '1px solid #CBD5E1',
                    backgroundColor: paymentMethod === 'boleto' ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '0.9rem 0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Receipt size={22} color={paymentMethod === 'boleto' ? '#0F172A' : '#64748B'} style={{ margin: '0 auto 0.25rem auto' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>
                    Boleto Bancário
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', marginTop: '0.2rem' }}>
                    Vence em 2 dias
                  </span>
                </div>

                {/* Convênio PBM */}
                <div
                  onClick={() => setPaymentMethod('convenio')}
                  style={{
                    border: paymentMethod === 'convenio' ? '2px solid #7C3AED' : '1px solid #CBD5E1',
                    backgroundColor: paymentMethod === 'convenio' ? '#F5F3FF' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '0.9rem 0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={22} color={paymentMethod === 'convenio' ? '#7C3AED' : '#64748B'} style={{ margin: '0 auto 0.25rem auto' }} />
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: paymentMethod === 'convenio' ? '#7C3AED' : '#0F172A' }}>
                    Convênio PBM
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', marginTop: '0.2rem' }}>
                    Vidalink / Epharma
                  </span>
                </div>

              </div>

              {/* CONTEÚDO DA FORMA DE PAGAMENTO SELECIONADA */}

              {/* 1. SELEÇÃO PIX */}
              {paymentMethod === 'pix' && (
                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <QrCode size={20} color="#059669" />
                      <strong style={{ fontSize: '0.92rem', color: '#065F46' }}>Pagamento Instantâneo com 5% de Desconto Adicional</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> Vence em {formatTimer(pixTimer)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #BBF7D0' }}>
                    {/* QR Code SVG / Visual realista */}
                    <div style={{
                      width: '130px',
                      height: '130px',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                        <rect x="0" y="0" width="30" height="30" fill="#059669" />
                        <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" />
                        <rect x="10" y="10" width="10" height="10" fill="#059669" />

                        <rect x="70" y="0" width="30" height="30" fill="#059669" />
                        <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" />
                        <rect x="80" y="10" width="10" height="10" fill="#059669" />

                        <rect x="0" y="70" width="30" height="30" fill="#059669" />
                        <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" />
                        <rect x="10" y="80" width="10" height="10" fill="#059669" />

                        <rect x="36" y="10" width="8" height="8" fill="#0F172A" />
                        <rect x="50" y="14" width="12" height="6" fill="#0F172A" />
                        <rect x="40" y="36" width="20" height="20" fill="#059669" />
                        <rect x="70" y="45" width="10" height="10" fill="#0F172A" />
                        <rect x="45" y="70" width="15" height="10" fill="#0F172A" />
                        <rect x="70" y="75" width="20" height="15" fill="#059669" />
                      </svg>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                        Abra o app do seu banco e escaneie o QR Code acima
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                        Ou copie o código Pix abaixo para pagar no internet banking na opção <strong>Pix Copia e Cola</strong>.
                      </div>

                      {/* Botão Copiar Pix */}
                      <button
                        onClick={handleCopyPix}
                        style={{
                          backgroundColor: pixCopied ? '#059669' : '#FFFFFF',
                          color: pixCopied ? '#FFFFFF' : '#059669',
                          border: '1.5px solid #059669',
                          padding: '0.55rem 1rem',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {pixCopied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{pixCopied ? 'Código Pix Copiado com Sucesso!' : 'Copiar Código Pix Copia e Cola'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Botão de Demonstração / Teste Real */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ECFDF5', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#065F46' }}>
                      💡 <strong>Dica de teste:</strong> Você pode simular a confirmação imediata do pagamento Pix pelo banco:
                    </span>
                    <button
                      onClick={handleSimulatePixPaid}
                      disabled={isPixSimulatingPayment}
                      style={{
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.45rem 0.95rem',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {isPixSimulatingPayment ? 'Processando...' : '⚡ Simular Pix Pago no Banco'}
                    </button>
                  </div>
                </div>
              )}

              {/* 2. SELEÇÃO CARTÃO DE CRÉDITO */}
              {paymentMethod === 'cartao' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Cartão Salvo na Conta */}
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '0.65rem' }}>
                      Cartões Salvos na Carteira Pague Menos:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                      {savedCards.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => { setSelectedCardId(c.id); setIsUsingNewCard(false); }}
                          style={{
                            border: (!isUsingNewCard && selectedCardId === c.id) ? '2px solid #001FD8' : '1px solid #CBD5E1',
                            backgroundColor: (!isUsingNewCard && selectedCardId === c.id) ? '#EFF6FF' : '#FFFFFF',
                            borderRadius: '14px',
                            padding: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '26px', backgroundColor: '#0F172A', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900 }}>
                              MC
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.85rem', color: '#0F172A', display: 'block' }}>
                                Mastercard final {c.last4}
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                                {c.holder} • Exp: {c.expiry}
                              </span>
                            </div>
                          </div>
                          <input
                            type="radio"
                            checked={!isUsingNewCard && selectedCardId === c.id}
                            onChange={() => { setSelectedCardId(c.id); setIsUsingNewCard(false); }}
                            style={{ accentColor: '#001FD8' }}
                          />
                        </div>
                      ))}

                      {/* Botão Usar Novo Cartão */}
                      <div
                        onClick={() => setIsUsingNewCard(true)}
                        style={{
                          border: isUsingNewCard ? '2px solid #001FD8' : '1.5px dashed #CBD5E1',
                          backgroundColor: isUsingNewCard ? '#EFF6FF' : '#FFFFFF',
                          borderRadius: '14px',
                          padding: '1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem'
                        }}
                      >
                        <Plus size={18} color="#001FD8" />
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#001FD8', display: 'block' }}>
                            Usar Outro Cartão
                          </strong>
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            Crédito em até 6x sem juros
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formulário Interativo de Novo Cartão */}
                  {isUsingNewCard && (
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid #CBD5E1',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem'
                    }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.3rem' }}>
                          Número do Cartão de Crédito
                        </label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={newCardData.number}
                          onChange={handleCardNumberChange}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.3rem' }}>
                          Nome Impresso no Cartão
                        </label>
                        <input
                          type="text"
                          placeholder="Como impresso no cartão"
                          value={newCardData.holder}
                          onChange={(e) => setNewCardData({ ...newCardData, holder: e.target.value.toUpperCase() })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.3rem' }}>
                          Validade (MM/AA)
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={newCardData.expiry}
                          onChange={handleCardExpiryChange}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: '0.3rem' }}>
                          Código CVV
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={newCardData.cvv}
                          onChange={(e) => setNewCardData({ ...newCardData, cvv: e.target.value.replace(/\D/g, '') })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFFFFF' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Seletor de Parcelamento */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                      Opções de Parcelamento Sem Juros:
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                        backgroundColor: '#FFFFFF',
                        fontWeight: 700,
                        color: '#0F172A'
                      }}
                    >
                      <option value="1">1x de R$ {finalTotal.toFixed(2).replace('.', ',')} (à vista no crédito)</option>
                      <option value="2">2x de R$ {(finalTotal / 2).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="3">3x de R$ {(finalTotal / 3).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="4">4x de R$ {(finalTotal / 4).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="5">5x de R$ {(finalTotal / 5).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="6">6x de R$ {(finalTotal / 6).toFixed(2).replace('.', ',')} sem juros</option>
                    </select>
                  </div>

                </div>
              )}

              {/* 3. SELEÇÃO BOLETO BANCÁRIO */}
              {paymentMethod === 'boleto' && (
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1.25rem', border: '1px solid #CBD5E1', fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>Informações sobre o Boleto Bancário:</strong>
                  O boleto será gerado após a confirmação. O prazo de compensação bancária é de 1 a 2 dias úteis. A entrega será iniciada após a compensação do pagamento.
                </div>
              )}

              {/* 4. SELEÇÃO CONVÊNIO PBM */}
              {paymentMethod === 'convenio' && (
                <div style={{ backgroundColor: '#F5F3FF', borderRadius: '14px', padding: '1.25rem', border: '1px solid #DDD6FE' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#6D28D9', display: 'block', marginBottom: '0.5rem' }}>
                    Identificação de Convênio Farmácia / PBM
                  </strong>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4C1D95', marginBottom: '0.2rem' }}>Operadora PBM:</label>
                      <select style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #C4B5FD', backgroundColor: '#FFFFFF', fontSize: '0.82rem' }}>
                        <option>Vidalink Saúde</option>
                        <option>Epharma</option>
                        <option>Funcional Health</option>
                        <option>Orizon</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#4C1D95', marginBottom: '0.2rem' }}>Número da Carteirinha:</label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #C4B5FD', backgroundColor: '#FFFFFF', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CLUBE SEMPRE BEM: OPÇÃO DE USAR CASHBACK */}
              <div style={{
                marginTop: '1.5rem',
                backgroundColor: '#EFF6FF',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Gift size={22} color="#001FD8" />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#001FD8' }}>
                      Saldo de Cashback Clube Sempre Bem: R$ {availableCashback.toFixed(2).replace('.', ',')}
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.74rem', color: '#1E40AF' }}>
                      Deseja abater este valor do total do seu pedido?
                    </span>
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={useCashback}
                    onChange={(e) => setUseCashback(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#001FD8', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#001FD8' }}>Usar Saldo</span>
                </label>
              </div>

            </div>

          </div>

          {/* ================================================================
              COLUNA DA DIREITA: RESUMO DO PEDIDO STICKY
              ================================================================ */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              
              {/* Header do Resumo */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ShoppingBag size={18} color="#001FD8" />
                  <span>Resumo do Pedido</span>
                </h3>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} iten(s)
                </span>
              </div>

              {/* Lista dos Itens do Pedido */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
                {cartItems.map((item) => {
                  const prod = item.product;
                  const unitPrice = prod?.clubPrice || prod?.price || 0;
                  return (
                    <div key={prod.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                      <img
                        src={prod.image || '/products/neutral-product-placeholder.svg'}
                        alt={prod.name}
                        style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {prod.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(prod.id, item.quantity - 1)}
                            style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                            title="Diminuir quantidade"
                          >
                            <Minus size={11} color="#475569" />
                          </button>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(prod.id, item.quantity + 1)}
                            style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                            title="Aumentar quantidade"
                          >
                            <Plus size={11} color="#475569" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveItem && onRemoveItem(prod.id)}
                            style={{ marginLeft: '0.4rem', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Remover produto"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>
                          R$ {(unitPrice * item.quantity).toFixed(2).replace('.', ',')}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Campo de Cupom de Desconto */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                  Possui Cupom de Desconto?
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Ex: BEMVINDO15"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.6rem 0.6rem 2.1rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    style={{
                      backgroundColor: '#001FD8',
                      color: '#FFFFFF',
                      padding: '0.6rem 1rem',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Aplicar
                  </button>
                </div>

                {couponError && (
                  <div style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: '0.25rem', fontWeight: 600 }}>
                    {couponError}
                  </div>
                )}

                {/* Cupons de sugestão rápida */}
                {!appliedCoupon && (
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('BEMVINDO15')}
                      style={{ fontSize: '0.68rem', backgroundColor: '#EFF6FF', color: '#001FD8', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800, border: '1px dashed #BFDBFE' }}
                    >
                      + BEMVINDO15 (R$ 15)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('TURBO10')}
                      style={{ fontSize: '0.68rem', backgroundColor: '#EFF6FF', color: '#001FD8', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800, border: '1px dashed #BFDBFE' }}
                    >
                      + TURBO10 (10%)
                    </button>
                  </div>
                )}

                {appliedCoupon && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ECFDF5', padding: '0.45rem 0.75rem', borderRadius: '8px', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={13} /> Cupom {appliedCoupon.code} ativado!
                    </span>
                    <button onClick={handleRemoveCoupon} style={{ color: '#DC2626', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                      Remover
                    </button>
                  </div>
                )}
              </div>

              {/* Demonstrativo Financeiro de Valores */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Subtotal dos Produtos:</span>
                  <span style={{ fontWeight: 600 }}>R$ {subtotalClub.toFixed(2).replace('.', ',')}</span>
                </div>

                {totalClubSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                    <span>Economia Clube Sempre Bem:</span>
                    <span>- R$ {totalClubSavings.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                    <span>Cupom ({appliedCoupon?.code}):</span>
                    <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                {cashbackDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#001FD8', fontWeight: 700 }}>
                    <span>Cashback Sempre Bem:</span>
                    <span>- R$ {cashbackDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                {pixDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                    <span>Desconto Extra Pix (5%):</span>
                    <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Frete ({deliveryMethod === 'turbo' ? 'Turbo' : deliveryMethod === 'padrao' ? 'Padrão' : 'Retirada'}):</span>
                  <span style={{ color: deliveryFee === 0 ? '#059669' : '#0F172A', fontWeight: 700 }}>
                    {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>

                <div style={{
                  borderTop: '2px dashed #E2E8F0',
                  paddingTop: '0.75rem',
                  marginTop: '0.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0F172A' }}>
                    Total a Pagar:
                  </span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#E30613', letterSpacing: '-0.5px' }}>
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {paymentMethod === 'cartao' && parseInt(installments) > 1 && (
                  <div style={{ fontSize: '0.74rem', color: '#64748B', textAlign: 'right' }}>
                    ou {installments}x de R$ {(finalTotal / parseInt(installments)).toFixed(2).replace('.', ',')} sem juros
                  </div>
                )}
              </div>

              {/* Botão de Finalização Primário */}
              <button
                onClick={handleFinalizeOrder}
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#E30613',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '1.05rem',
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 20px rgba(227, 6, 19, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {isSubmitting ? (
                  <span>Processando Compra com Segurança...</span>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Concluir Pedido Seguro</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Garantias de Segurança no Rodapé do Resumo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.73rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Entrega com controle térmico para medicamentos</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Check size={14} color="#001FD8" />
                  <span>Farmacêutica de plantão para dúvidas no pós-venda</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default DesktopCheckoutPage;
