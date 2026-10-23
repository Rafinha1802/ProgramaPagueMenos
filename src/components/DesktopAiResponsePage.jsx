import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  Trash2,
  Repeat,
  DollarSign,
  AlertTriangle,
  ArrowLeft,
  Send,
  MessageSquare,
  ChevronRight,
  Heart,
  Upload,
  FileText,
  Lock,
  Unlock,
  Stethoscope,
  AlertOctagon,
  FileCheck,
  Check,
  Paperclip,
  Camera,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { CATALOG } from '../data/catalog';

export function DesktopAiResponsePage({
  recommendation,
  onUpdateEngine,
  onAddToCart,
  onAddBatchToCart,
  onBackToStore,
  onOpenCart,
  cartItemsCount,
  onOpenCamera = () => {}
}) {
  const [alternativeSelectorId, setAlternativeSelectorId] = useState(null);
  const [chatFeedback, setChatFeedback] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [chatAttachment, setChatAttachment] = useState(null);
  const chatFileInputRef = useRef(null);
  const chatScrollRef = useRef(null);

  const activeRecommendation = recommendation || {
    journeyTitle: 'Consulta Farmacêutica Digital',
    rationale: 'Selecionei opções com procedência garantida e descontos do Clube Pague Menos.',
    botResponseText: 'Olá! Sou a Dra. Sofia, Farmacêutica IA da Pague Menos. Como posso te orientar hoje?',
    totalPrice: 0,
    originalTotal: 0,
    savingsTotal: 0,
    recommendedItems: [],
    safetyNotice: {
      hasPrescriptionRequired: false,
      warningText: 'Todos os medicamentos incluídos são Isentos de Prescrição (MIPs).'
    },
    appliedPrompt: 'Atendimento Farmacêutico Digital',
    targetBudget: null,
    preferGenerics: false
  };

  const [conversation, setConversation] = useState(() => [
    {
      id: 'init-bot',
      sender: 'bot',
      time: 'Agora',
      text: activeRecommendation?.botResponseText || activeRecommendation?.rationale || 'Olá! Sou a Dra. Sofia, Farmacêutica IA. Analisei sua necessidade e estruturei a melhor recomendação para sua saúde e economia. Você pode me fazer perguntas, pedir genéricos ou ajustar valores.'
    }
  ]);

  // Estados de Validação de Receita Médica (ANVISA / CFM)
  const isPreValidated = Boolean(activeRecommendation?.attachedAnalysis?.intent === 'prescription' || activeRecommendation?.safetyNotice?.prescriptionPreValidated);
  const initialPrescriptionData = activeRecommendation?.attachedAnalysis?.prescriptionData || (isPreValidated ? {
    doctor: activeRecommendation?.attachedAnalysis?.doctor || 'Dr. Marcelo Santos - CRM/SP 142.891',
    specialty: 'Clínica Médica & Farmacologia Clínica',
    status: 'Receita Digital Homologada (ICP-Brasil / CFM)',
    date: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    prescriptionCode: 'MEMED-8849-SP',
    fileName: activeRecommendation?.attachedAnalysis?.name || 'prescricao_medica.pdf'
  } : null);

  const [prescriptionValidated, setPrescriptionValidated] = useState(isPreValidated);
  const [prescriptionData, setPrescriptionData] = useState(initialPrescriptionData);
  const [isValidatingPrescription, setIsValidatingPrescription] = useState(false);
  const [prescriptionCodeInput, setPrescriptionCodeInput] = useState('');
  const fileInputRef = useRef(null);

  const {
    journeyTitle,
    rationale,
    totalPrice,
    originalTotal,
    savingsTotal,
    recommendedItems,
    safetyNotice,
    appliedPrompt,
    targetBudget,
    preferGenerics,
    attachedAnalysis
  } = activeRecommendation;

  const [selectedBasketIds, setSelectedBasketIds] = useState(() => (recommendedItems || []).map((i) => i.id));

  // Sincroniza a seleção quando a lista de recomendação for atualizada
  useEffect(() => {
    if (recommendedItems && recommendedItems.length > 0) {
      setSelectedBasketIds((prev) => {
        const validIds = recommendedItems.map((i) => i.id);
        const filtered = prev.filter((id) => validIds.includes(id));
        return filtered.length > 0 ? filtered : validIds;
      });
    } else {
      setSelectedBasketIds([]);
    }
  }, [recommendedItems]);

  const selectedBasketItems = (recommendedItems || []).filter((i) => selectedBasketIds.includes(i.id));
  const selectedBasketTotal = selectedBasketItems.reduce((acc, curr) => acc + (curr.clubPrice || curr.price || 0), 0);
  const selectedBasketOriginal = selectedBasketItems.reduce((acc, curr) => acc + (curr.originalPrice || curr.price || 0), 0);
  const selectedBasketSavings = selectedBasketItems.reduce((acc, curr) => acc + Math.max(0, (curr.originalPrice || curr.price) - (curr.clubPrice || curr.price)), 0);
  const allBasketSelected = recommendedItems.length > 0 && selectedBasketIds.length === recommendedItems.length;

  const toggleSelectAllBasket = () => {
    if (allBasketSelected) {
      setSelectedBasketIds([]);
    } else {
      setSelectedBasketIds(recommendedItems.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedBasketIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const hasPrescriptionItems = safetyNotice?.hasPrescriptionRequired || recommendedItems.some(i => i.requiresPrescription || i.isControlled);
  const isBasketLocked = hasPrescriptionItems && !prescriptionValidated;

  // Validação simulada de receita médica
  const handleSimulatePrescriptionValidation = (type = 'demo', customName = null) => {
    setIsValidatingPrescription(true);
    setTimeout(() => {
      setIsValidatingPrescription(false);
      setPrescriptionValidated(true);
      const data = {
        doctor: 'Dr. Marcelo Santos - CRM/SP 142.891',
        specialty: 'Clínica Médica & Farmacologia Clínica',
        status: 'Receita Digital Homologada (ICP-Brasil / CFM)',
        date: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        prescriptionCode: type === 'code' ? (customName || 'MEMED-8849-SP') : 'REC-ANVISA-882194',
        fileName: type === 'file' ? (customName || 'receita_medica.pdf') : 'Prescricao_Digital_Assinada.pdf'
      };
      setPrescriptionData(data);
      showChatFeedback('Receita médica validada com sucesso! Compra desbloqueada.');
    }, 850);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSimulatePrescriptionValidation('file', file.name);
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (prescriptionCodeInput.trim()) {
      handleSimulatePrescriptionValidation('code', prescriptionCodeInput.trim());
      setPrescriptionCodeInput('');
    }
  };

  const handleRemovePrescription = () => {
    setPrescriptionValidated(false);
    setPrescriptionData(null);
    showChatFeedback('Receita desanexada. A compra de medicamentos controlados foi bloqueada.');
  };

  // Troca individual de produto por substituto
  const handleSwapProduct = (currentProdId, replacementProdId) => {
    const newItems = recommendedItems.map((item) =>
      item.id === currentProdId ? CATALOG.find((p) => p.id === replacementProdId) : item
    ).filter(Boolean);

    onUpdateEngine({
      customSelectedIds: newItems.map((i) => i.id)
    });
    setAlternativeSelectorId(null);
    showChatFeedback('Produto substituído na sua cesta recomendada!');
  };

  // Remover item individual
  const handleRemoveProduct = (prodId) => {
    const newItems = recommendedItems.filter((i) => i.id !== prodId);
    onUpdateEngine({
      customSelectedIds: newItems.map((i) => i.id)
    });
    showChatFeedback('Item removido da cesta.');
  };

  const showChatFeedback = (msg) => {
    setChatFeedback(msg);
    setTimeout(() => setChatFeedback(null), 3000);
  };

  const handleChatPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChatAttachment({
          type: 'photo',
          name: file.name,
          previewUrl: event.target.result,
          intent: 'generic'
        });
        showChatFeedback(`Anexo carregado: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Envio de nova mensagem / ajuste
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim() || chatAttachment) {
      const text = customInput.trim() || (chatAttachment?.intent === 'generic' ? `Ver genérico do medicamento ${chatAttachment.name}` : `Análise de documento ${chatAttachment?.name}`);
      const userMsg = {
        id: 'user-' + Date.now(),
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        attachment: chatAttachment
      };
      setConversation((prev) => [...prev, userMsg]);

      onUpdateEngine({
        prompt: text,
        customSelectedIds: null,
        attachment: chatAttachment || null
      });

      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Ajustei a recomendação para "${text}". Atualizei os produtos recomendados na cesta ao lado com os melhores descontos do Clube!`
          }
        ]);
        chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 400);

      showChatFeedback(`Ajuste aplicado: "${text}"`);
      setCustomInput('');
      setChatAttachment(null);
    }
  };

  // Envio por atalhos rápidos
  const handleQuickPrompt = (promptText) => {
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: promptText
    };
    setConversation((prev) => [...prev, userMsg]);

    onUpdateEngine({ prompt: promptText, customSelectedIds: null });

    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Ajustei a recomendação para "${promptText}". Verifique os itens atualizados na sua cesta!`
        }
      ]);
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 400);

    showChatFeedback(`Ajuste aplicado: "${promptText}"`);
  };

  // Comprar itens selecionados da cesta
  const handleAddAll = () => {
    if (isBasketLocked) {
      showChatFeedback('Atenção: Anexe e valide sua receita médica para liberar a compra desta medicação.');
      const el = document.getElementById('desktop-prescription-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const toBuy = recommendedItems.filter((i) => selectedBasketIds.includes(i.id));
    if (toBuy.length === 0) {
      showChatFeedback('Selecione ao menos 1 produto para adicionar ao carrinho.');
      return;
    }
    onAddBatchToCart(toBuy, true);
  };

  // Comprar individual
  const handleIndividualBuy = (prod) => {
    if ((prod.requiresPrescription || prod.isControlled) && !prescriptionValidated) {
      showChatFeedback('Atenção: Medicamento sob controle especial. Anexe sua receita para comprar.');
      const el = document.getElementById('desktop-prescription-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onAddToCart(prod, true);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '80vh', padding: '1.75rem 0 3.5rem 0' }}>
      <div className="container">

        {/* 1. Barra de Navegação & Breadcrumbs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          {/* Breadcrumb + Botão Voltar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onBackToStore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#EFF6FF',
                color: '#001FD8',
                padding: '0.45rem 0.95rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid #BFDBFE',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft size={16} />
              <span>Voltar para a vitrine</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748B' }}>
              <span>Loja Online</span>
              <ChevronRight size={14} />
              <span>Atendimento Farmacêutico IA</span>
              <ChevronRight size={14} />
              <strong style={{ color: '#0F172A' }}>{journeyTitle}</strong>
            </div>
          </div>

          {/* Status Farmacêutico Online */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
            }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
              Dra. IA FarmaViva • CRF/SP 48.219 (Plantão Ativo)
            </span>
          </div>
        </div>

        {/* 2. Grid de 2 Colunas Desktop (Esquerda: Consulta/Chat | Direita: Cesta Recomendada) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: '1.75rem',
          alignItems: 'start'
        }}>

          {/* COLUNA ESQUERDA: Conversa Farmacêutica, Orientação Clínica e Chat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Balão de Pergunta do Usuário */}
            <div style={{
              backgroundColor: '#001FD8',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 6px 18px rgba(0, 31, 216, 0.18)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#BFDBFE', fontWeight: 700, marginBottom: '0.35rem' }}>
                <MessageSquare size={14} />
                <span>Você solicitou à IA Farmacêutica:</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.35, letterSpacing: '-0.3px' }}>
                "{appliedPrompt || 'Cesta de Saúde e Cuidados Personalizados'}"
              </h2>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {targetBudget && (
                  <span style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '8px'
                  }}>
                    💰 Limite de gastos: R$ {targetBudget.toFixed(2).replace('.', ',')}
                  </span>
                )}
                {preferGenerics && (
                  <span style={{
                    backgroundColor: 'rgba(74, 222, 128, 0.25)',
                    color: '#DCFCE7',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '8px'
                  }}>
                    💊 Prioridade para genéricos
                  </span>
                )}
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '8px'
                }}>
                  {recommendedItems.length} produtos sugeridos
                </span>
              </div>
            </div>

            {/* CARD DE ANÁLISE DE ANEXO (FOTO DO MEDICAMENTO / RECEITA MÉDICA) */}
            {attachedAnalysis && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '2px solid #60A5FA',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 4px 16px rgba(0, 31, 216, 0.08)',
                animation: 'fadeIn 0.25s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      backgroundColor: '#EFF6FF',
                      color: '#001FD8',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <Sparkles size={13} color="#001FD8" />
                      <span>{attachedAnalysis.badgeText || 'Análise de Imagem IA'}</span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    Arquivo: {attachedAnalysis.name}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {attachedAnalysis.previewUrl ? (
                    <img
                      src={attachedAnalysis.previewUrl}
                      alt="Anexo Analisado"
                      style={{
                        width: '90px',
                        height: '90px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '2px solid #BFDBFE',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '12px',
                      backgroundColor: '#FEF2F2',
                      border: '2px solid #FECACA',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#DC2626',
                      flexShrink: 0
                    }}>
                      <FileText size={32} />
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, marginTop: '0.2rem' }}>PDF</span>
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                      {attachedAnalysis.detectedMedication || attachedAnalysis.detectedTitle}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.45, margin: 0 }}>
                      {attachedAnalysis.actionText}
                    </p>

                    {/* Detalhes de Genérico com Comparativo de Preço */}
                    {attachedAnalysis.intent === 'generic' && attachedAnalysis.equivalentGeneric && (
                      <div style={{
                        marginTop: '0.65rem',
                        backgroundColor: '#F0FDF4',
                        border: '1.5px solid #86EFAC',
                        borderRadius: '10px',
                        padding: '0.55rem 0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>
                            Genérico Equivalente ANVISA Selecionado:
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D' }}>
                            {attachedAnalysis.equivalentGeneric}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                            De R$ {attachedAnalysis.originalPrice?.toFixed(2).replace('.', ',')}
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#15803D' }}>
                            Por R$ {attachedAnalysis.genericPrice?.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detalhes de Receita Médica */}
                    {attachedAnalysis.intent === 'prescription' && (
                      <div style={{
                        marginTop: '0.65rem',
                        backgroundColor: '#ECFDF5',
                        border: '1.5px solid #10B981',
                        borderRadius: '10px',
                        padding: '0.55rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <CheckCircle2 size={18} color="#059669" />
                        <div style={{ fontSize: '0.78rem', color: '#065F46', fontWeight: 700 }}>
                          {attachedAnalysis.doctor} • Protocolo {attachedAnalysis.digitalProtocol}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Balão da Orientação Farmacêutica da IA */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0, 31, 216, 0.25)'
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                    Orientação Clínica FarmaViva
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#008744', fontWeight: 700 }}>
                    ✓ Dosagem, indicações e segurança farmacêutica validadas
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, marginBottom: '1rem' }}>
                {rationale}
              </p>

              {/* Módulo de Prescrição Médica Obrigatória (ANVISA) no Desktop */}
              {hasPrescriptionItems ? (
                <div
                  id="desktop-prescription-section"
                  style={{
                    backgroundColor: prescriptionValidated ? '#ECFDF5' : '#FFFBEB',
                    border: prescriptionValidated ? '2px solid #10B981' : '2px solid #F59E0B',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Topo do Alerta */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{
                      backgroundColor: prescriptionValidated ? '#D1FAE5' : '#FEF3C7',
                      color: prescriptionValidated ? '#059669' : '#D97706',
                      padding: '0.6rem',
                      borderRadius: '12px',
                      flexShrink: 0
                    }}>
                      {prescriptionValidated ? <ShieldCheck size={26} /> : <AlertOctagon size={26} />}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: prescriptionValidated ? '#059669' : '#B45309',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {prescriptionValidated ? 'Receita Médica Validada ✓' : 'Controle Especial Obrigatório (ANVISA)'}
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>
                        {prescriptionValidated
                          ? 'Prescrição Homologada — Compra Liberada'
                          : 'Medicamento Sujeito a Retenção de Receita Médica'}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                        {prescriptionValidated
                          ? 'A receita foi validada e a dispensação está aprovada nos termos da RDC 20/2011 e Portaria SVS/MS 344/98.'
                          : 'Por determinação regulatória sanitária, esta substância NÃO pode ser adquirida ou pesquisada sem prévia validação médica.'}
                      </p>
                    </div>
                  </div>

                  {/* Orientação Médica: PROCURE UM MÉDICO */}
                  {!prescriptionValidated && (
                    <div style={{
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '12px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start'
                    }}>
                      <Stethoscope size={22} color="#001FD8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '0.82rem', color: '#1E40AF', lineHeight: 1.45 }}>
                        <strong>Não possui receita médica? Procure um médico especialista:</strong>
                        <div style={{ marginTop: '0.2rem', color: '#334155' }}>
                          A automedicação com substâncias controladas ou antibióticos pode causar dependência, efeitos adversos graves e resistência bacteriana. Consulte seu médico para obter avaliação clínica e a prescrição formal.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formulário Interativo de Upload ou Código Digital */}
                  {!prescriptionValidated ? (
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1.5px solid #CBD5E1',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem'
                    }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <FileText size={16} color="#001FD8" />
                        <span>Já possui prescrição médica emitida? Anexe abaixo para liberar a compra:</span>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                      />

                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isValidatingPrescription}
                          style={{
                            flex: 1,
                            minWidth: '220px',
                            backgroundColor: '#FFFFFF',
                            border: '2px dashed #001FD8',
                            color: '#001FD8',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Upload size={16} />
                          <span>Anexar Foto da Receita ou PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSimulatePrescriptionValidation('demo')}
                          disabled={isValidatingPrescription}
                          style={{
                            flex: 1,
                            minWidth: '220px',
                            backgroundColor: '#EFF6FF',
                            border: '1.5px solid #93C5FD',
                            color: '#001FD8',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.45rem',
                            cursor: 'pointer'
                          }}
                        >
                          {isValidatingPrescription ? (
                            <span>Validando assinatura digital junto ao CFM...</span>
                          ) : (
                            <>
                              <FileCheck size={16} color="#059669" />
                              <span>Validar Receita de Exemplo (Dr. Marcelo Santos - CRM/SP)</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Validação de Código Digital CFM / Memed */}
                      <form onSubmit={handleCodeSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <input
                          type="text"
                          placeholder="Ou digite o código/token da receita digital (ex: MEMED-8849-SP)"
                          value={prescriptionCodeInput}
                          onChange={(e) => setPrescriptionCodeInput(e.target.value)}
                          style={{
                            flex: 1,
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '10px',
                            padding: '0.6rem 0.95rem',
                            fontSize: '0.84rem'
                          }}
                        />
                        <button
                          type="submit"
                          disabled={isValidatingPrescription}
                          style={{
                            backgroundColor: '#001FD8',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.6rem 1.25rem',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Validar Código
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Receita Validada */
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #86EFAC',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <CheckCircle2 size={28} color="#059669" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#065F46' }}>
                            {prescriptionData?.doctor || 'Dr. Marcelo Santos - CRM/SP 142.891'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                            {prescriptionData?.fileName} • {prescriptionData?.status} • {prescriptionData?.date}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePrescription}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#DC2626',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Trocar Receita
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Alerta de ANVISA e Segurança Padrão */
                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}>
                  <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.4 }}>
                    <strong>{safetyNotice.warningText}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Caixa Interativa de Ajustes e Chat Contínuo */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #BFDBFE',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 4px 14px rgba(0, 31, 216, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
                <Sparkles size={16} color="#001FD8" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Ajuste ou tire dúvidas com a IA Farmacêutica
                </h4>
              </div>

              {/* Feedback rápido de ajuste */}
              {chatFeedback && (
                <div style={{
                  backgroundColor: '#DCFCE7',
                  color: '#065F46',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '0.75rem',
                  border: '1px solid #86EFAC'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{chatFeedback}</span>
                </div>
              )}

              {/* Pílulas de Ações Rápidas */}
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                {[
                  { label: '💬 Gastar até R$ 50', prompt: 'gastar até 50 reais' },
                  { label: '💬 Gastar até R$ 80', prompt: 'gastar até 80 reais' },
                  { label: '💊 Trocar tudo por genéricos', prompt: 'trocar tudo por genéricos mais baratos' },
                  { label: '📉 Opção mais econômica', prompt: 'mais barato e econômico' },
                  { label: '🔄 Repor medicamentos habituais', prompt: 'repetir habitual dor e febre' }
                ].map((pill) => (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => handleQuickPrompt(pill.prompt)}
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      backgroundColor: '#EFF6FF',
                      color: '#001FD8',
                      border: '1px solid #BFDBFE',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Feed Conversacional com a Farmacêutica IA */}
              <div style={{
                maxHeight: '260px',
                overflowY: 'auto',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                marginBottom: '0.85rem'
              }}>
                {conversation.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, marginBottom: '0.15rem' }}>
                      {msg.sender === 'user' ? 'Você' : 'Dra. Sofia (Farmacêutica IA)'} • {msg.time}
                    </div>
                    <div style={{
                      backgroundColor: msg.sender === 'user' ? '#001FD8' : '#FFFFFF',
                      color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                      padding: '0.55rem 0.85rem',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.82rem',
                      lineHeight: 1.4,
                      maxWidth: '85%',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                      border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatScrollRef} />
              </div>

              {/* Input oculto para anexo no chat */}
              <input
                ref={chatFileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleChatPhotoUpload}
              />

              {/* Preview de Anexo no Chat se selecionado */}
              {chatAttachment && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '10px',
                  padding: '0.45rem 0.75rem',
                  marginBottom: '0.65rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {chatAttachment.previewUrl ? (
                      <img
                        src={chatAttachment.previewUrl}
                        alt="Anexo"
                        style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ) : (
                      <FileText size={20} color="#001FD8" />
                    )}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                        {chatAttachment.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#001FD8' }}>
                        Pronto para envio com sua mensagem
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setChatAttachment(null)}
                    style={{ color: '#64748B', cursor: 'pointer' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {/* Barra de Chat */}
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '0.2rem 0.65rem 0.2rem 1rem'
                }}>
                  <input
                    type="text"
                    placeholder="Escreva sua dúvida, anexe foto de remédio ou receita médica..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      fontSize: '0.88rem',
                      color: '#0F172A',
                      padding: '0.45rem 0'
                    }}
                  />

                  {/* Botão Câmera no Chatbot */}
                  <button
                    type="button"
                    onClick={onOpenCamera}
                    style={{
                      backgroundColor: '#EFF6FF',
                      color: '#001FD8',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      marginRight: '0.35rem'
                    }}
                    title="Tirar foto do medicamento ou receita"
                  >
                    <Camera size={14} />
                    <span>Câmera</span>
                  </button>

                  {/* Botão Anexar */}
                  <button
                    type="button"
                    onClick={() => chatFileInputRef.current?.click()}
                    style={{
                      backgroundColor: chatAttachment ? '#FEF2F2' : '#FFFFFF',
                      color: chatAttachment ? '#DC2626' : '#001FD8',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}
                    title="Anexar foto do remédio ou receita (PDF)"
                  >
                    <Paperclip size={14} />
                    <span>Anexar</span>
                  </button>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#001FD8',
                    color: '#FFFFFF',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={16} />
                  <span>Enviar</span>
                </button>
              </form>
            </div>

          </div>

          {/* COLUNA DIREITA: Cesta Recomendada, Preços e Itens do Kit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Card Principal de Preço e CTA de Compra em Lote */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #001FD8',
              padding: '1.5rem',
              boxShadow: '0 8px 24px rgba(0, 31, 216, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#EFF6FF',
                    color: '#0022D6',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    marginBottom: '0.35rem'
                  }}>
                    <Sparkles size={12} />
                    <span>Cesta Inteligente FarmaViva</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                    {journeyTitle}
                  </h3>
                </div>

                <span style={{
                  backgroundColor: '#F1F5F9',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#475569'
                }}>
                  {recommendedItems.length} {recommendedItems.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              {/* Preços e Resumo de Seleção */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '1.1rem 1.25rem',
                border: '1px solid #E2E8F0',
                margin: '1rem 0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <div>
                    {selectedBasketOriginal > selectedBasketTotal && (
                      <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through', marginRight: '0.65rem' }}>
                        De R$ {selectedBasketOriginal.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#E30613', letterSpacing: '-0.5px' }}>
                      R$ {selectedBasketTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {selectedBasketSavings > 0 && (
                    <span style={{
                      backgroundColor: '#DCFCE7',
                      color: '#008744',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '8px'
                    }}>
                      Economia: R$ {selectedBasketSavings.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  ★ Preço exclusivo Clube FarmaViva ({selectedBasketItems.length} de {recommendedItems.length} selecionados)
                </div>
              </div>

              {/* Botão de Compra em Lote dos Selecionados (Com Trava de Receita Médica) */}
              <button
                onClick={handleAddAll}
                disabled={!isBasketLocked && selectedBasketItems.length === 0}
                style={{
                  width: '100%',
                  backgroundColor: isBasketLocked ? '#64748B' : (selectedBasketItems.length === 0 ? '#94A3B8' : '#E30613'),
                  color: '#FFFFFF',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  boxShadow: isBasketLocked || selectedBasketItems.length === 0 ? 'none' : '0 6px 18px rgba(227, 6, 19, 0.35)',
                  cursor: selectedBasketItems.length === 0 && !isBasketLocked ? 'not-allowed' : 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {isBasketLocked ? (
                  <>
                    <Lock size={20} />
                    <span>🔒 Cesta bloqueada: Anexe a receita médica para comprar</span>
                  </>
                ) : selectedBasketItems.length === 0 ? (
                  <>
                    <ShoppingBag size={20} />
                    <span>Selecione ao menos 1 item para comprar</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>
                      {prescriptionValidated
                        ? `Comprar selecionados com receita validada (${selectedBasketItems.length} itens)`
                        : `Comprar selecionados (${selectedBasketItems.length} itens) e abrir carrinho`}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Lista dos Produtos Selecionados no Kit com Seleção Individual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: '0.65rem 0.9rem',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>
                  <input
                    type="checkbox"
                    checked={allBasketSelected}
                    onChange={toggleSelectAllBasket}
                    style={{ width: '18px', height: '18px', accentColor: '#E30613', cursor: 'pointer' }}
                  />
                  <span>Selecionar todos ({selectedBasketIds.length}/{recommendedItems.length})</span>
                </label>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#008744' }}>
                  Subtotal: R$ {selectedBasketTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {recommendedItems.map((prod) => {
                const hasAlternative = prod.genericEquivalentId || CATALOG.some((c) => c.category === prod.category && c.id !== prod.id);
                const isSelected = selectedBasketIds.includes(prod.id);

                return (
                  <div
                    key={prod.id}
                    style={{
                      backgroundColor: isSelected ? '#FFFFFF' : '#F8FAFC',
                      borderRadius: '16px',
                      border: isSelected ? '1.5px solid #001FD8' : '1px solid #E2E8F0',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,31,216,0.06)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid #F1F5F9'
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(prod.id)}
                          style={{ width: '18px', height: '18px', accentColor: '#E30613', cursor: 'pointer' }}
                        />
                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: isSelected ? '#008744' : '#64748B'
                        }}>
                          {isSelected ? '✓ Selecionado para comprar' : '○ Não selecionado'}
                        </span>
                      </label>
                      <button
                        onClick={() => handleRemoveProduct(prod.id)}
                        style={{ color: '#94A3B8', padding: '0.2rem', cursor: 'pointer', background: 'none', border: 'none' }}
                        title="Remover deste kit"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: '72px',
                          height: '72px',
                          objectFit: 'contain',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          padding: '0.25rem',
                          flexShrink: 0
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase' }}>
                            {prod.brand}
                          </span>
                          <button
                            onClick={() => handleRemoveProduct(prod.id)}
                            style={{ color: '#94A3B8', padding: '0.2rem', cursor: 'pointer' }}
                            title="Remover deste kit"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, margin: '0.2rem 0' }}>
                          {prod.name}
                        </h4>

                        <div style={{
                          fontSize: '0.74rem',
                          color: '#0369A1',
                          backgroundColor: '#F0F9FF',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          display: 'inline-block'
                        }}>
                          <strong>Ação:</strong> {prod.clinicalRole}
                        </div>

                        {/* Tag de Alerta de Controle Especial */}
                        {(prod.requiresPrescription || prod.isControlled) && (
                          <div style={{
                            marginTop: '0.45rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: prescriptionValidated ? '#ECFDF5' : '#FEF2F2',
                            color: prescriptionValidated ? '#059669' : '#DC2626',
                            border: prescriptionValidated ? '1px solid #A7F3D0' : '1px solid #FECACA',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 800
                          }}>
                            {prescriptionValidated ? <Check size={13} /> : <Lock size={13} />}
                            <span>{prescriptionValidated ? 'Receita Validada para Dispensação' : (prod.prescriptionType || 'Exige Receita Médica')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preços e Ações */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.65rem',
                      borderTop: '1px dashed #E2E8F0'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through', marginRight: '0.4rem' }}>
                          De R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#E30613' }}>
                          R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {hasAlternative && (
                          <button
                            type="button"
                            onClick={() => setAlternativeSelectorId(alternativeSelectorId === prod.id ? null : prod.id)}
                            style={{
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: '#001FD8',
                              backgroundColor: '#EFF6FF',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              border: '1px solid #BFDBFE',
                              cursor: 'pointer'
                            }}
                          >
                            <Repeat size={13} />
                            <span>Ver alternativa</span>
                          </button>
                        )}

                        {/* Botão de Compra Individual com Trava para Controlados */}
                        {(() => {
                          const isProdLocked = (prod.requiresPrescription || prod.isControlled) && !prescriptionValidated;
                          return (
                            <button
                              type="button"
                              onClick={() => handleIndividualBuy(prod)}
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                backgroundColor: isProdLocked ? '#E2E8F0' : '#E30613',
                                color: isProdLocked ? '#64748B' : '#FFFFFF',
                                padding: '0.45rem 0.85rem',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer',
                                border: isProdLocked ? '1px solid #CBD5E1' : 'none',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isProdLocked ? (
                                <>
                                  <Lock size={13} color="#DC2626" />
                                  <span>Requer Receita</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag size={13} />
                                  <span>Comprar</span>
                                </>
                              )}
                            </button>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Menu de Alternativas Equivalentes */}
                    {alternativeSelectorId === prod.id && (
                      <div style={{
                        marginTop: '0.5rem',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569' }}>
                          Equivalentes e Genéricos no catálogo:
                        </div>
                        {CATALOG
                          .filter((c) => c.category === prod.category && c.id !== prod.id)
                          .slice(0, 3)
                          .map((alt) => (
                            <div
                              key={alt.id}
                              onClick={() => handleSwapProduct(prod.id, alt.id)}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 0.75rem',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              <span style={{ color: '#0F172A', fontWeight: 600 }}>
                                <strong>{alt.brand}</strong> - {alt.name}
                              </span>
                              <span style={{ color: '#E30613', fontWeight: 900 }}>
                                R$ {alt.clubPrice.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default DesktopAiResponsePage;
