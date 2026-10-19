import React, { useState, useRef } from 'react';
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
  Check,
  ChevronDown,
  Upload,
  FileText,
  Lock,
  Unlock,
  Stethoscope,
  AlertOctagon,
  FileCheck,
  Camera,
  Paperclip,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { CATALOG } from '../data/catalog';

export function AiChatResponseScreen({
  recommendation,
  onUpdateEngine,
  onAddToCart,
  onAddBatchToCart,
  onBackToHome,
  onOpenCart,
  cartItemsCount,
  onOpenCamera = () => {}
}) {
  const [alternativeSelectorId, setAlternativeSelectorId] = useState(null);
  const [chatFeedback, setChatFeedback] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [chatAttachment, setChatAttachment] = useState(null);
  const chatFileInputRef = useRef(null);
  const chatDocInputRef = useRef(null);

  // Estados de Validação de Receita Médica (ANVISA / CFM)
  const isPreValidated = Boolean(recommendation?.attachedAnalysis?.intent === 'prescription' || recommendation?.safetyNotice?.prescriptionPreValidated);
  const initialPrescriptionData = recommendation?.attachedAnalysis?.prescriptionData || (isPreValidated ? {
    doctor: recommendation?.attachedAnalysis?.doctor || 'Dr. Marcelo Santos - CRM/SP 142.891',
    specialty: 'Clínica Médica & Farmacologia Clínica',
    status: 'Receita Digital Homologada (ICP-Brasil / CFM)',
    date: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    prescriptionCode: 'MEMED-8849-SP',
    fileName: recommendation?.attachedAnalysis?.name || 'prescricao_medica.pdf'
  } : null);

  const [prescriptionValidated, setPrescriptionValidated] = useState(isPreValidated);
  const [prescriptionData, setPrescriptionData] = useState(initialPrescriptionData);
  const [isValidatingPrescription, setIsValidatingPrescription] = useState(false);
  const [prescriptionCodeInput, setPrescriptionCodeInput] = useState('');
  const fileInputRef = useRef(null);

  const activeRecommendation = recommendation || {
    journeyTitle: 'Consulta Farmacêutica Digital',
    rationale: 'Analisando suas necessidades para selecionar os melhores produtos disponíveis com os descontos do Clube FarmaViva.',
    totalPrice: 0,
    originalTotal: 0,
    savingsTotal: 0,
    recommendedItems: [],
    safetyNotice: {
      hasPrescriptionRequired: false,
      warningText: 'Todos os medicamentos incluídos são Isentos de Prescrição (MIPs).'
    },
    appliedPrompt: 'Produtos de farmácia e cuidados',
    targetBudget: null,
    preferGenerics: false
  };

  const {
    journeyTitle,
    rationale,
    totalPrice,
    originalTotal,
    savingsTotal,
    recommendedItems,
    safetyNotice,
    isWithinBudget,
    appliedPrompt,
    targetBudget,
    preferGenerics
  } = activeRecommendation;

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
    showChatFeedback('Produto substituído na sua cesta!');
  };

  // Remover item individual do kit
  const handleRemoveProduct = (prodId) => {
    const newItems = recommendedItems.filter((i) => i.id !== prodId);
    onUpdateEngine({
      customSelectedIds: newItems.map((i) => i.id)
    });
    showChatFeedback('Item removido da recomendação.');
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
        showChatFeedback(`Foto carregada: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChatDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setChatAttachment({
        type: 'document',
        name: file.name,
        previewUrl: null,
        intent: 'prescription'
      });
      showChatFeedback(`Documento de receita: ${file.name}`);
    }
  };

  // Envio de nova mensagem / ajuste
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim() || chatAttachment) {
      const text = customInput.trim() || (chatAttachment?.intent === 'generic' ? `Ver genérico do medicamento ${chatAttachment.name}` : `Análise de documento ${chatAttachment?.name}`);
      onUpdateEngine({
        prompt: text,
        customSelectedIds: null,
        attachment: chatAttachment || null
      });
      showChatFeedback(`Ajuste aplicado: "${text}"`);
      setCustomInput('');
      setChatAttachment(null);
    }
  };

  // Envio rápido por botões de chip
  const handleQuickPrompt = (promptText) => {
    onUpdateEngine({ prompt: promptText, customSelectedIds: null });
    showChatFeedback(`Ajuste aplicado: "${promptText}"`);
  };

  // Comprar todos os itens da cesta
  const handleAddAll = () => {
    if (isBasketLocked) {
      showChatFeedback('Atenção: Anexe sua receita médica para liberar a compra desta medicação.');
      const el = document.getElementById('prescription-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onAddBatchToCart(recommendedItems, true);
  };

  // Comprar item individual com validação
  const handleIndividualBuy = (prod) => {
    if ((prod.requiresPrescription || prod.isControlled) && !prescriptionValidated) {
      showChatFeedback('Atenção: Medicamento controlado. Anexe a receita para liberar a compra.');
      const el = document.getElementById('prescription-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    onAddToCart(prod, true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      backgroundColor: '#F8FAFC',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* 1. Header Oficial da Tela de Resposta da IA */}
      <div style={{
        background: 'linear-gradient(135deg, #001FD8 0%, #0017A3 100%)',
        color: '#FFFFFF',
        padding: '0.65rem 1rem 0.85rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 14px rgba(0, 31, 216, 0.25)',
        zIndex: 20,
        flexShrink: 0
      }}>
        {/* Botão Voltar para a Tela Principal (Home) */}
        <button
          onClick={onBackToHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: '#FFFFFF',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            padding: '0.4rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            transition: 'all 0.15s ease'
          }}
          title="Voltar para a tela inicial"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        {/* Identificação da Farmacêutica IA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <Sparkles size={18} color="#001FD8" />
            <div style={{
              position: 'absolute',
              bottom: '1px',
              right: '1px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: '1.5px solid #FFFFFF'
            }} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.2px' }}>
              Farmacêutica IA
            </div>
            <div style={{ fontSize: '0.68rem', color: '#93C5FD', fontWeight: 600 }}>
              CRF/SP 48.219 • Online
            </div>
          </div>
        </div>

        {/* Sacola de Compras com Contador */}
        <button
          onClick={onOpenCart}
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}
          title="Abrir sacola de compras"
        >
          <ShoppingBag size={18} />
          {cartItemsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#E30613',
              color: '#FFFFFF',
              fontSize: '0.62rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #001FD8'
            }}>
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* 2. Área com Scroll de Conversa e Resultados */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.85rem 0.85rem 5.5rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        
        {/* Marcador de Sessão Farmacêutica */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.68rem',
          color: '#64748B',
          fontWeight: 600,
          margin: '0.1rem 0'
        }}>
          Consulta Digital Farmácia FarmaViva • Atendimento Ativo
        </div>

        {/* Balão 1: Pergunta / Intenção do Usuário (Alinhado à direita) */}
        <div style={{
          alignSelf: 'flex-end',
          maxWidth: '88%',
          backgroundColor: '#001FD8',
          color: '#FFFFFF',
          borderRadius: '16px 16px 4px 16px',
          padding: '0.75rem 0.9rem',
          boxShadow: '0 2px 8px rgba(0, 31, 216, 0.2)'
        }}>
          <div style={{ fontSize: '0.68rem', color: '#BFDBFE', fontWeight: 700, marginBottom: '0.2rem' }}>
            Você pediu:
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, lineHeight: 1.35 }}>
            "{appliedPrompt || 'Recomendação de saúde e cuidados'}"
          </div>
          
          {/* Tags de Parâmetros adicionais */}
          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
            {targetBudget && (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '6px'
              }}>
                💰 Teto: R$ {targetBudget.toFixed(0)}
              </span>
            )}
            {preferGenerics && (
              <span style={{
                backgroundColor: 'rgba(74, 222, 128, 0.3)',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '6px'
              }}>
                💊 Priorizar genéricos
              </span>
            )}
          </div>
        </div>

        {/* Card de Imagem / Documento Anexado Analisado pela IA no Mobile */}
        {activeRecommendation?.attachedAnalysis && (
          <div style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #60A5FA',
            padding: '0.85rem',
            boxShadow: '0 2px 10px rgba(0, 31, 216, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#EFF6FF',
                color: '#001FD8',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Sparkles size={11} color="#001FD8" />
                <span>{activeRecommendation.attachedAnalysis.badgeText || 'Foto Analisada'}</span>
              </div>
              <span style={{ fontSize: '0.66rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                {activeRecommendation.attachedAnalysis.name}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              {activeRecommendation.attachedAnalysis.previewUrl ? (
                <img
                  src={activeRecommendation.attachedAnalysis.previewUrl}
                  alt="Anexo Analisado"
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '1.5px solid #BFDBFE',
                    flexShrink: 0
                  }}
                />
              ) : (
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF2F2',
                  border: '1.5px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  flexShrink: 0
                }}>
                  <FileText size={26} />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
                  {activeRecommendation.attachedAnalysis.detectedMedication || activeRecommendation.attachedAnalysis.detectedTitle}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.3 }}>
                  {activeRecommendation.attachedAnalysis.actionText}
                </div>
              </div>
            </div>

            {/* Comparativo de Economia com Genérico */}
            {activeRecommendation.attachedAnalysis.intent === 'generic' && activeRecommendation.attachedAnalysis.equivalentGeneric && (
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.72rem'
              }}>
                <div>
                  <span style={{ color: '#166534', fontWeight: 800, display: 'block' }}>
                    {activeRecommendation.attachedAnalysis.equivalentGeneric.slice(0, 32)}...
                  </span>
                  <span style={{ color: '#15803D', fontSize: '0.65rem' }}>Mesma fórmula • ANVISA</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#94A3B8', textDecoration: 'line-through', fontSize: '0.65rem' }}>
                    De R$ {activeRecommendation.attachedAnalysis.originalPrice?.toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ color: '#15803D', fontWeight: 900, fontSize: '0.9rem' }}>
                    R$ {activeRecommendation.attachedAnalysis.genericPrice?.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Balão 2: Resposta Farmacêutica da IA (Alinhado à esquerda) */}
        <div style={{
          alignSelf: 'flex-start',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1.5px solid #E2E8F0',
          padding: '0.9rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: '#001FD8',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={14} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#001FD8' }}>
                Orientação Farmacêutica FarmaViva
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#1E293B', lineHeight: 1.45 }}>
            {rationale}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.6rem',
            paddingTop: '0.45rem',
            borderTop: '1px dashed #E2E8F0',
            fontSize: '0.68rem',
            color: '#008744',
            fontWeight: 700
          }}>
            <span>✓ Eficácia terapêutica validada</span>
            <span>CRF/SP ativo</span>
          </div>
        </div>

        {/* MÓDULO REGULATÓRIO & VALIDAÇÃO DE RECEITA MÉDICA (ANVISA) */}
        {hasPrescriptionItems && (
          <div
            id="prescription-section"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: prescriptionValidated ? '2px solid #10B981' : '2px solid #EF4444',
              padding: '0.95rem',
              boxShadow: prescriptionValidated ? '0 4px 14px rgba(16, 185, 129, 0.12)' : '0 4px 14px rgba(239, 68, 68, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transition: 'all 0.25s ease'
            }}
          >
            {/* Topo do Alerta */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
              <div style={{
                backgroundColor: prescriptionValidated ? '#ECFDF5' : '#FEF2F2',
                color: prescriptionValidated ? '#059669' : '#DC2626',
                padding: '0.45rem',
                borderRadius: '10px',
                flexShrink: 0
              }}>
                {prescriptionValidated ? <ShieldCheck size={22} /> : <AlertOctagon size={22} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: prescriptionValidated ? '#059669' : '#DC2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px'
                }}>
                  {prescriptionValidated ? 'Receita Médica Validada ✓' : 'Atenção Médica e Regulatória (ANVISA)'}
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: '0.15rem 0' }}>
                  {prescriptionValidated
                    ? 'Prescrição Aprovada — Compra Liberada'
                    : 'Medicamento Controlado / Retenção de Receita'}
                </h4>
                <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.35, margin: 0 }}>
                  {prescriptionValidated
                    ? 'A dispensação foi autorizada pelo farmacêutico responsável.'
                    : 'Por exigência legal da ANVISA, este medicamento NÃO pode ser vendido livremente sem comprovação profissional.'}
                </p>
              </div>
            </div>

            {/* Aviso: PROCURE UM MÉDICO */}
            {!prescriptionValidated && (
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '10px',
                padding: '0.65rem 0.75rem',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start'
              }}>
                <Stethoscope size={18} color="#001FD8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.74rem', color: '#1E40AF', lineHeight: 1.35 }}>
                  <strong>Não tem receita? Procure um médico:</strong>
                  <div style={{ marginTop: '0.15rem', color: '#334155' }}>
                    A automedicação com substâncias controladas ou antibióticos apresenta sérios riscos à saúde. Consulte um médico especialista para obter o diagnóstico e a prescrição correta.
                  </div>
                </div>
              </div>
            )}

            {/* Se ainda NÃO validou: formulário para anexar ou validar token */}
            {!prescriptionValidated ? (
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileText size={14} color="#001FD8" />
                  <span>Já possui receita médica? Anexe para validar:</span>
                </div>

                {/* Input escondido de arquivo */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                />

                {/* Botões de Ação para Anexar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isValidatingPrescription}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px dashed #001FD8',
                      color: '#001FD8',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={14} />
                    <span>Anexar foto da receita ou PDF</span>
                  </button>

                  {/* Atalho de Demonstração Rápida */}
                  <button
                    type="button"
                    onClick={() => handleSimulatePrescriptionValidation('demo')}
                    disabled={isValidatingPrescription}
                    style={{
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #93C5FD',
                      color: '#001FD8',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isValidatingPrescription ? (
                      <span>Validando junto ao CFM...</span>
                    ) : (
                      <>
                        <FileCheck size={14} color="#059669" />
                        <span>Validar receita de exemplo (Dr. Marcelo Santos - CRM/SP)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Ou validar por Token Digital CFM / Memed */}
                <form onSubmit={handleCodeSubmit} style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <input
                    type="text"
                    placeholder="Ou código da receita digital (ex: MEMED-4821)"
                    value={prescriptionCodeInput}
                    onChange={(e) => setPrescriptionCodeInput(e.target.value)}
                    style={{
                      flex: 1,
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.74rem'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isValidatingPrescription}
                    style={{
                      backgroundColor: '#001FD8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Validar
                  </button>
                </form>
              </div>
            ) : (
              /* Receita Validada */
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #86EFAC',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
                  <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065F46' }}>
                      {prescriptionData?.doctor || 'Dr. Marcelo Santos - CRM/SP 142.891'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#047857' }}>
                      {prescriptionData?.fileName} • {prescriptionData?.status}
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
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        )}

        {/* Card de Segurança Farmacêutica ANVISA Padrão (se não for controlado) */}
        {!hasPrescriptionItems && (
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem'
          }}>
            <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.74rem', color: '#166534', lineHeight: 1.3 }}>
              <strong>{safetyNotice.warningText}</strong>
            </div>
          </div>
        )}

        {/* Feedback visual rápido de ajuste */}
        {chatFeedback && (
          <div style={{
            backgroundColor: '#DCFCE7',
            color: '#065F46',
            padding: '0.5rem 0.75rem',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            border: '1px solid #86EFAC'
          }}>
            <CheckCircle2 size={15} />
            <span>{chatFeedback}</span>
          </div>
        )}

        {/* 3. Bloco da Cesta Recomendada */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '0.9rem',
          border: '1.5px solid #001FD8',
          boxShadow: '0 4px 14px rgba(0, 31, 216, 0.08)'
        }}>
          {/* Header do Kit */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: '#EFF6FF',
                color: '#0022D6',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 800,
                marginBottom: '0.25rem'
              }}>
                <Sparkles size={11} />
                <span>Cesta Inteligente</span>
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
                {journeyTitle}
              </h3>
            </div>
            <div style={{
              backgroundColor: '#F1F5F9',
              padding: '0.2rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#475569'
            }}>
              {recommendedItems.length} {recommendedItems.length === 1 ? 'item' : 'itens'}
            </div>
          </div>

          {/* Resumo de Preços e Botão de Comprar Cesta Completa */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            padding: '0.75rem',
            border: '1px solid #E2E8F0',
            marginBottom: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', textDecoration: 'line-through', marginRight: '0.4rem' }}>
                  De R$ {originalTotal.toFixed(2).replace('.', ',')}
                </span>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#E30613' }}>
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <span style={{
                backgroundColor: '#DCFCE7',
                color: '#008744',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.15rem 0.45rem',
                borderRadius: '6px'
              }}>
                Economia: R$ {savingsTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Botão de Compra em Lote da Cesta Recomendada (Com Trava de Segurança) */}
            <button
              onClick={handleAddAll}
              style={{
                width: '100%',
                backgroundColor: isBasketLocked ? '#64748B' : '#E30613',
                color: '#FFFFFF',
                padding: '0.7rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: isBasketLocked ? 'none' : '0 3px 10px rgba(227, 6, 19, 0.3)',
                marginTop: '0.5rem',
                cursor: isBasketLocked ? 'pointer' : 'pointer',
                border: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {isBasketLocked ? (
                <>
                  <Lock size={16} />
                  <span>🔒 Bloqueado: Anexe a receita para comprar</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>
                    {prescriptionValidated
                      ? `Comprar cesta com receita validada (${recommendedItems.length} itens)`
                      : `Comprar cesta completa (${recommendedItems.length} itens)`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Lista de Produtos do Kit (Vertical, perfeito para tela de celular) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {recommendedItems.map((prod) => {
              const hasAlternative = prod.genericEquivalentId || CATALOG.some((c) => c.category === prod.category && c.id !== prod.id);

              return (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Linha Superior: Imagem + Detalhes + Lixeira */}
                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{
                        width: '56px',
                        height: '56px',
                        objectFit: 'contain',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase' }}>
                          {prod.brand}
                        </span>
                        <button
                          onClick={() => handleRemoveProduct(prod.id)}
                          style={{ color: '#94A3B8', padding: '0.1rem', cursor: 'pointer' }}
                          title="Remover deste kit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        lineHeight: 1.25,
                        margin: '0.15rem 0 0.25rem 0'
                      }}>
                        {prod.name}
                      </div>

                      <div style={{
                        fontSize: '0.68rem',
                        color: '#0369A1',
                        backgroundColor: '#F0F9FF',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        <strong>Ação:</strong> {prod.clinicalRole}
                      </div>

                      {/* Tag de Alerta de Controle Especial */}
                      {(prod.requiresPrescription || prod.isControlled) && (
                        <div style={{
                          marginTop: '0.35rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: prescriptionValidated ? '#ECFDF5' : '#FEF2F2',
                          color: prescriptionValidated ? '#059669' : '#DC2626',
                          border: prescriptionValidated ? '1px solid #A7F3D0' : '1px solid #FECACA',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          fontSize: '0.65rem',
                          fontWeight: 800
                        }}>
                          {prescriptionValidated ? <Check size={11} /> : <Lock size={11} />}
                          <span>{prescriptionValidated ? 'Receita Validada' : (prod.prescriptionType || 'Exige Receita Médica')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Linha de Preços e Ações */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.45rem',
                    borderTop: '1px dashed #F1F5F9'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        De R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#E30613' }}>
                          R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span style={{ fontSize: '0.6rem', color: '#001FD8', fontWeight: 800 }}>
                          Clube
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {hasAlternative && (
                        <button
                          type="button"
                          onClick={() => setAlternativeSelectorId(alternativeSelectorId === prod.id ? null : prod.id)}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#001FD8',
                            backgroundColor: '#EFF6FF',
                            padding: '0.35rem 0.55rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            border: '1px solid #BFDBFE'
                          }}
                        >
                          <Repeat size={12} />
                          <span>Alternativa</span>
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
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              backgroundColor: isProdLocked ? '#E2E8F0' : '#E30613',
                              color: isProdLocked ? '#64748B' : '#FFFFFF',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              cursor: 'pointer',
                              border: isProdLocked ? '1px solid #CBD5E1' : 'none'
                            }}
                          >
                            {isProdLocked ? (
                              <>
                                <Lock size={12} color="#DC2626" />
                                <span>Requer Receita</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={12} />
                                <span>Comprar</span>
                              </>
                            )}
                          </button>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Seletor de Alternativas Farmacêuticas */}
                  {alternativeSelectorId === prod.id && (
                    <div style={{
                      marginTop: '0.35rem',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>
                        Substituir por equivalente ou genérico:
                      </div>
                      {CATALOG
                        .filter((c) => c.category === prod.category && c.id !== prod.id)
                        .slice(0, 2)
                        .map((alt) => (
                          <div
                            key={alt.id}
                            onClick={() => handleSwapProduct(prod.id, alt.id)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.35rem 0.5rem',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              cursor: 'pointer',
                              fontSize: '0.72rem'
                            }}
                          >
                            <span style={{ color: '#0F172A', fontWeight: 600 }}>
                              <strong>{alt.brand}</strong> - {alt.name.slice(0, 26)}...
                            </span>
                            <span style={{ color: '#E30613', fontWeight: 800 }}>
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

        {/* 4. Pílulas de Ajustes Rápidos no Chat */}
        <div style={{ marginTop: '0.2rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '0.4rem' }}>
            Ajustar com 1 toque:
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { label: '💬 Gastar até R$ 50', prompt: 'gastar até 50 reais' },
              { label: '💬 Gastar até R$ 80', prompt: 'gastar até 80 reais' },
              { label: '💊 Trocar por genéricos', prompt: 'trocar tudo por genéricos mais baratos' },
              { label: '📉 Mais econômico', prompt: 'mais barato e econômico' },
              { label: '🔄 Repor habituais', prompt: 'repetir habitual dor e febre' }
            ].map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => handleQuickPrompt(pill.prompt)}
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '20px',
                  backgroundColor: '#FFFFFF',
                  color: '#001FD8',
                  border: '1px solid #BFDBFE',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Inputs ocultos para arquivos de imagem e documento */}
      <input
        ref={chatFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChatPhotoUpload}
      />
      <input
        ref={chatDocInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        style={{ display: 'none' }}
        onChange={handleChatDocUpload}
      />

      {/* 5. Barra Inferior Fixa de Chat com a IA */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '0.55rem 0.75rem 0.75rem 0.75rem',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)',
        zIndex: 30
      }}>
        {/* Preview se tiver anexo no chat */}
        {chatAttachment && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '10px',
            padding: '0.35rem 0.65rem',
            marginBottom: '0.45rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
              {chatAttachment.previewUrl ? (
                <img
                  src={chatAttachment.previewUrl}
                  alt="Anexo"
                  style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                />
              ) : (
                <FileText size={18} color="#001FD8" style={{ flexShrink: 0 }} />
              )}
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                {chatAttachment.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setChatAttachment(null)}
              style={{ color: '#64748B', cursor: 'pointer', padding: '0.1rem' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          {/* Botão Tirar Foto com Câmera */}
          <button
            type="button"
            onClick={onOpenCamera}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#001FD8',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title="Tirar foto do medicamento ou receita"
          >
            <Camera size={17} />
          </button>

          {/* Botão Anexar Foto da Galeria ou Documento */}
          <button
            type="button"
            onClick={() => chatFileInputRef.current?.click()}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              color: '#64748B',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title="Anexar documento ou foto"
          >
            <Paperclip size={16} />
          </button>

          <div style={{
            flex: 1,
            backgroundColor: '#F1F5F9',
            borderRadius: '24px',
            padding: '0.2rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #E2E8F0'
          }}>
            <input
              type="text"
              placeholder="Fale com a IA ou envie foto..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.8rem',
                color: '#1E293B',
                padding: '0.35rem 0'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#001FD8',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0, 31, 216, 0.35)',
              cursor: 'pointer'
            }}
            title="Enviar mensagem"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

    </div>
  );
}

export default AiChatResponseScreen;
