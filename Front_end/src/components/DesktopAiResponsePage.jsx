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
  X,
  Plus,
  Minus,
  Edit2,
  ChevronDown,
  Info,
  ExternalLink
} from 'lucide-react';
import { runAiCommerceEngineAsync } from '../services/aiCommerceEngine';

export function DesktopAiResponsePage({
  recommendation,
  onUpdateEngine,
  onAddToCart,
  onAddBatchToCart,
  onBackToStore,
  onOpenCart,
  cartItemsCount,
  onOpenCamera = () => {},
  products = [],
  isAiLoading = false,
  userSession
}) {
  const userName = userSession?.name ? userSession.name.split(' ')[0] : 'Rafaella';

  // Etapa atual da consulta: 1 = Relato, 2 = Segurança (Print 1), 3 = Próximos Passos / Produtos (Print 2)
  const [currentStep, setCurrentStep] = useState(2);

  // Etapa 1: Dados do relato
  const [duration, setDuration] = useState('Desde ontem');
  const [intensity, setIntensity] = useState('Leve • 1-3 de 10');

  // Etapa 2: Dados de segurança
  const [hasAlertSigns, setHasAlertSigns] = useState('Não'); // 'Sim' | 'Não' | 'Não sei dizer'
  const [patientAge, setPatientAge] = useState('24 anos');
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [hasAllergy, setHasAllergy] = useState('Sim, alergia a dipirona');
  const [tookMedicationToday, setTookMedicationToday] = useState('Não tomei nenhum medicamento hoje');
  const [isPregnantOrNursing, setIsPregnantOrNursing] = useState('Não');

  // Cesta de produtos adicionados
  const [basketItems, setBasketItems] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [chatAttachment, setChatAttachment] = useState(null);
  const chatFileInputRef = useRef(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Produtos do catálogo recomendados para revisão com o farmacêutico (Exatos do Print 2)
  const CATALOG_OPTIONS = [
    {
      id: 'prod-paracetamol',
      name: 'Paracetamol',
      activePrinciple: 'paracetamol',
      description: 'Analgésico e antitérmico de uso geral para dor e febre.',
      price: 8.90,
      clubPrice: 8.90,
      originalPrice: 11.90,
      image: '/products/dipirona-ems.jpg'
    },
    {
      id: 'prod-tylenol',
      name: 'Tylenol',
      activePrinciple: 'paracetamol',
      description: 'Analgésico e antitérmico de uso geral para dor e febre.',
      price: 19.90,
      clubPrice: 19.90,
      originalPrice: 24.50,
      image: '/products/dorflex.jpg'
    },
    {
      id: 'prod-advil',
      name: 'Advil',
      activePrinciple: 'ibuprofeno',
      description: 'Anti-inflamatório não esteroidal, também usado para dor e febre.',
      price: 24.90,
      clubPrice: 24.90,
      originalPrice: 29.90,
      image: '/products/benegrip.jpg'
    },
    {
      id: 'prod-alivium',
      name: 'Alivium',
      activePrinciple: 'ibuprofeno',
      description: 'Anti-inflamatório não esteroidal, também usado para dor e febre.',
      price: 18.90,
      clubPrice: 18.90,
      originalPrice: 22.90,
      image: '/products/neosaldina.jpg'
    },
    {
      id: 'prod-flanax',
      name: 'Flanax',
      activePrinciple: 'naproxeno sódico',
      description: 'Anti-inflamatório não esteroidal de uso geral para dor e inflamação.',
      price: 22.90,
      clubPrice: 22.90,
      originalPrice: 27.90,
      image: '/products/dorflex.jpg'
    }
  ];

  const attachment = recommendation?.attachment;
  const analysis = attachment?.analysisResult;

  // Produto construído dinamicamente a partir da foto da câmera analisada pela IA
  const analyzedProduct = analysis ? {
    id: 'prod-photo-analyzed',
    name: analysis.equivalentGeneric || analysis.detectedMedication,
    activePrinciple: analysis.activePrinciple,
    description: analysis.usageAdvice || 'Medicamento identificado com inteligência artificial e OCR pela Dra. Sofia.',
    price: analysis.genericPrice || 8.90,
    clubPrice: analysis.genericPrice || 8.90,
    originalPrice: analysis.referencePrice || 14.50,
    image: attachment.previewUrl,
    isGeneric: Boolean(analysis.equivalentGeneric),
    savingsPct: analysis.savingsPct,
    requiresPrescription: analysis.requiresPrescription,
    anvisaRegistry: analysis.anvisaRegistry,
    badge: analysis.savingsPct ? `Economia de ${analysis.savingsPct}%` : 'Identificado na Câmera'
  } : null;

  // Lista dinâmica de opções incluindo o produto da foto no topo
  const displayCatalogOptions = analyzedProduct
    ? [analyzedProduct, ...CATALOG_OPTIONS.filter((p) => p.name.toLowerCase() !== analyzedProduct.name.toLowerCase())]
    : CATALOG_OPTIONS;

  // Se houver foto da câmera analisada e a cesta estiver vazia, auto-adicionar à cesta
  useEffect(() => {
    if (analyzedProduct && basketItems.length === 0) {
      setBasketItems([{ ...analyzedProduct, quantity: 1, selected: true }]);
    }
  }, [attachment]);

  // Adicionar / Remover item da cesta da consulta
  const handleToggleBasketItem = (prod) => {
    setBasketItems((prev) => {
      const exists = prev.find((item) => item.id === prod.id);
      if (exists) {
        showToast(`${prod.name} removido da cesta.`);
        return prev.filter((item) => item.id !== prod.id);
      } else {
        showToast(`${prod.name} adicionado à cesta.`);
        return [...prev, { ...prod, quantity: 1, selected: true }];
      }
    });
  };

  const updateBasketQty = (prodId, delta) => {
    setBasketItems((prev) =>
      prev.map((item) => {
        if (item.id === prodId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const toggleSelectBasketItem = (prodId) => {
    setBasketItems((prev) =>
      prev.map((item) =>
        item.id === prodId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const allSelected = basketItems.length > 0 && basketItems.every((i) => i.selected);
  const toggleSelectAll = () => {
    const nextVal = !allSelected;
    setBasketItems((prev) => prev.map((i) => ({ ...i, selected: nextVal })));
  };

  const selectedItems = basketItems.filter((i) => i.selected);
  const basketTotal = selectedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  // Finalizar compra / levar à sacola
  const handleCheckoutSelected = () => {
    if (selectedItems.length === 0) return;
    if (onAddBatchToCart) {
      onAddBatchToCart(selectedItems, true);
    } else if (onAddToCart) {
      selectedItems.forEach((item) => onAddToCart(item, true));
    }
  };

  // Enviar mensagem livre no chat
  const handleSendCustomMessage = (e) => {
    if (e) e.preventDefault();
    if (!customInput.trim() && !chatAttachment) return;
    showToast(`Dúvida enviada para a Dra. Sofia: "${customInput.trim()}"`);
    setCustomInput('');
    setChatAttachment(null);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '1rem 0 3.5rem 0', fontFamily: 'inherit' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>

        {/* Toast Notificação */}
        {feedbackToast && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '0.65rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.82rem',
            fontWeight: 700,
            zIndex: 99999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Sparkles size={15} color="#FDE047" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* 1. Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#64748B', marginBottom: '1rem' }}>
          <span onClick={onBackToStore} style={{ cursor: 'pointer', color: '#001FD8' }}>Início</span>
          <span>/</span>
          <span>Serviços de Saúde</span>
          <span>/</span>
          <strong style={{ color: '#001FD8' }}>Consulta farmacêutica</strong>
        </div>

        {/* 2. Top Banner Azul Royal: Atendimento Farmacêutico Digital */}
        <div style={{
          backgroundColor: '#0022D6',
          borderRadius: '18px',
          padding: '1.25rem 1.75rem',
          color: '#FFFFFF',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.15rem',
          boxShadow: '0 8px 24px rgba(0, 34, 214, 0.22)'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Stethoscope size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#BFDBFE', fontWeight: 600, marginBottom: '0.2rem' }}>
              Você solicitou à IA Farmacêutica
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, letterSpacing: '-0.3px' }}>
              Atendimento Farmacêutico Digital
            </h1>
          </div>
        </div>

        {/* 3. Grid Principal de 2 Colunas (Converse com a IA | Revise sua cesta) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.85fr)',
          gap: '1.75rem',
          alignItems: 'start'
        }}>

          {/* ====================================================================
              COLUNA ESQUERDA: CONVERSE COM A IA
              ==================================================================== */}
          <div>
            {/* Header: Converse com a IA / ● Online */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Converse com a IA
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                <span>Online</span>
              </div>
            </div>

            {/* Container Branco Principal */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '1.65rem',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.35rem'
            }}>

              {/* ================================================================
                  ETAPA 2: INFORMAÇÕES DE SEGURANÇA (EXATO DO PRINT 1)
                  ================================================================ */}
              {currentStep === 2 && (
                <>
                  {/* Topo do Card com Badge Etapa 2 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.4px' }}>
                        Vamos entender sua dor de cabeça
                      </h3>
                      <span style={{
                        backgroundColor: '#EFF6FF',
                        color: '#001FD8',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        border: '1px solid #BFDBFE'
                      }}>
                        Etapa 2 • Segurança
                      </span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                      Vamos confirmar informações importantes antes de qualquer orientação sobre medicamentos.
                    </p>
                  </div>

                  {/* Card da Foto Analisada pela Câmera & OCR */}
                  {attachment && (
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1.5px solid #86EFAC',
                      borderRadius: '16px',
                      padding: '1rem 1.15rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      boxShadow: '0 4px 14px rgba(34, 197, 94, 0.08)'
                    }}>
                      <div style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '2px solid #16A34A',
                        flexShrink: 0
                      }}>
                        <img
                          src={attachment.previewUrl}
                          alt="Foto da Câmera"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                          <span style={{
                            backgroundColor: '#16A34A',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            ✓ Foto Analisada com Sucesso pela IA
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>
                            {analysis?.brand || 'Reconhecimento Óptico Farmacêutico'}
                          </span>
                        </div>
                        <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#0F172A' }}>
                          {analysis?.detectedMedication || attachment.detectedMedication || attachment.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#334155', marginTop: '0.15rem' }}>
                          <strong>Princípio Ativo: </strong>{analysis?.activePrinciple || 'Identificado na foto'} • <strong>ANVISA: </strong>{analysis?.anvisaRegistry || 'Homologado'}
                        </div>
                        {analysis?.equivalentGeneric && (
                          <div style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 800, marginTop: '0.25rem' }}>
                            💡 Troca recomendada: {analysis.equivalentGeneric} (Economize {analysis.savingsPct}% — R$ {analysis.genericPrice?.toFixed(2)})
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resumo do Relato Anterior */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '0.95rem 1.15rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                        Seu relato: dor de cabeça
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#001FD8',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Revisar respostas
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}>
                        <CheckCircle2 size={18} color="#001FD8" />
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Duração da dor</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#001FD8' }}>{duration}</div>
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}>
                        <CheckCircle2 size={18} color="#001FD8" />
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Intensidade</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#001FD8' }}>{intensity}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso / Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#001FD8', fontWeight: 700 }}>
                      <CheckCircle2 size={16} color="#001FD8" />
                      <span>Seu relato</span>
                    </div>
                    <div style={{ flex: 1, height: '2px', backgroundColor: '#001FD8' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#001FD8', fontWeight: 800 }}>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#001FD8',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem'
                      }}>2</span>
                      <span>Segurança</span>
                    </div>
                    <div style={{ flex: 1, height: '2px', backgroundColor: '#E2E8F0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94A3B8', fontWeight: 600 }}>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#F1F5F9',
                        color: '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem'
                      }}>3</span>
                      <span>Próximos passos</span>
                    </div>
                  </div>

                  {/* Mensagem da Farmacêutica IA */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      backgroundColor: '#001FD8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Sparkles size={17} color="#FDE047" />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.86rem', color: '#1E293B', lineHeight: 1.45 }}>
                        Obrigada pelas respostas, {userName}. Preencha o bloco abaixo para continuarmos. Se não souber alguma informação, conte isso na conversa.
                      </p>
                      <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>
                        Dra. Sofia (Farmacêutica IA) • Agora
                      </span>
                    </div>
                  </div>

                  {/* Bloco Formulário: Informações de Segurança */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '1.35rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                        <ShieldCheck size={18} color="#001FD8" />
                        <span>Informações de segurança</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Aguardando suas respostas</span>
                    </div>

                    {/* Sinais de Alerta */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 800, color: '#001FD8', marginBottom: '0.2rem' }}>
                        <AlertTriangle size={14} color="#001FD8" />
                        <span>Primeiro, sinais de alerta</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                        Você apresenta algum destes sinais agora?
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35, marginBottom: '0.65rem' }}>
                        Dor súbita e muito intensa, fraqueza, confusão, dificuldade para falar, febre com rigidez na nuca ou dor após uma pancada.
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                        {['Sim', 'Não', 'Não sei dizer'].map((opt) => {
                          const isSel = hasAlertSigns === opt;
                          return (
                            <div
                              key={opt}
                              onClick={() => setHasAlertSigns(opt)}
                              style={{
                                padding: '0.55rem 0.85rem',
                                borderRadius: '10px',
                                border: isSel ? '2px solid #001FD8' : '1.5px solid #E2E8F0',
                                backgroundColor: isSel ? '#EFF6FF' : '#FFFFFF',
                                color: isSel ? '#001FD8' : '#1E293B',
                                fontSize: '0.8rem',
                                fontWeight: isSel ? 800 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem'
                              }}
                            >
                              <div style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                border: isSel ? '5px solid #001FD8' : '2px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                flexShrink: 0
                              }} />
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4 Campos em Grid (2x2) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      {/* Campo 1: Idade */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                          Qual é a sua idade?
                        </label>
                        <div style={{
                          backgroundColor: '#F8FAFC',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: '10px',
                          padding: '0.55rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          color: '#0F172A',
                          fontWeight: 600
                        }}>
                          {isEditingAge ? (
                            <input
                              type="text"
                              value={patientAge}
                              onChange={(e) => setPatientAge(e.target.value)}
                              onBlur={() => setIsEditingAge(false)}
                              autoFocus
                              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.82rem', fontWeight: 700 }}
                            />
                          ) : (
                            <span onClick={() => setIsEditingAge(true)} style={{ cursor: 'pointer' }}>{patientAge}</span>
                          )}
                          <Edit2 size={14} color="#64748B" style={{ cursor: 'pointer' }} onClick={() => setIsEditingAge(true)} />
                        </div>
                      </div>

                      {/* Campo 2: Alergia a medicamento */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                          Você tem alergia a algum medicamento?
                        </label>
                        <select
                          value={hasAllergy}
                          onChange={(e) => setHasAllergy(e.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #E2E8F0',
                            borderRadius: '10px',
                            padding: '0.55rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#0F172A',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Sim, alergia a dipirona">Sim, alergia a dipirona</option>
                          <option value="Não tenho alergias">Não tenho alergias</option>
                          <option value="Sim, alergia a AAS / Ácido Acetilsalicílico">Sim, alergia a AAS</option>
                          <option value="Sim, alergia a Anti-inflamatórios (AINEs)">Sim, alergia a AINEs</option>
                        </select>
                      </div>

                      {/* Campo 3: Medicamento hoje */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                          Você usa ou tomou algum medicamento hoje?
                        </label>
                        <select
                          value={tookMedicationToday}
                          onChange={(e) => setTookMedicationToday(e.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #E2E8F0',
                            borderRadius: '10px',
                            padding: '0.55rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#0F172A',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Não tomei nenhum medicamento hoje">Não tomei nenhum medicamento hoje</option>
                          <option value="Sim, tomei analgésico nas últimas 6h">Sim, tomei analgésico nas últimas 6h</option>
                          <option value="Uso medicamentos contínuos (pressão/diabetes)">Uso medicamentos contínuos</option>
                        </select>
                      </div>

                      {/* Campo 4: Grávida ou amamentando */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                          Você está grávida ou amamentando?
                        </label>
                        <select
                          value={isPregnantOrNursing}
                          onChange={(e) => setIsPregnantOrNursing(e.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #E2E8F0',
                            borderRadius: '10px',
                            padding: '0.55rem 0.85rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#0F172A',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Não">Não</option>
                          <option value="Sim, estou gestante">Sim, estou gestante</option>
                          <option value="Sim, estou amamentando">Sim, estou amamentando</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Info size={13} />
                      <span>As informações serão avaliadas antes de qualquer orientação. Esta etapa não confirma o uso de medicamentos.</span>
                    </div>
                  </div>

                  {/* Alerta de Urgência */}
                  <div style={{
                    backgroundColor: '#FFFBEB',
                    border: '1.5px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'flex-start'
                  }}>
                    <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400E', marginBottom: '0.2rem' }}>
                        Dor súbita e muito intensa? Procure urgência.
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#B45309', lineHeight: 1.35 }}>
                        Se houver fraqueza, confusão, dificuldade para falar, febre com rigidez na nuca ou dor após uma pancada, não espere pela conversa. Procure atendimento de urgência ou ligue 192.
                      </div>
                    </div>
                  </div>

                  {/* Botão de Continuar */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    style={{
                      width: '100%',
                      backgroundColor: '#001FD8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(0, 31, 216, 0.3)'
                    }}
                  >
                    <span>→ Continuar</span>
                  </button>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', marginTop: '-0.75rem' }}>
                    Preencha as informações de segurança para continuar.
                  </div>
                </>
              )}

              {/* ================================================================
                  ETAPA 1: REVISÃO DE RELATO (Se o usuário quiser mudar)
                  ================================================================ */}
              {currentStep === 1 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      Vamos entender sua dor de cabeça
                    </h3>
                    <span style={{ backgroundColor: '#EFF6FF', color: '#001FD8', fontSize: '0.74rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '999px' }}>
                      Etapa 1 • Seu relato
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                      Há quanto tempo você está com dor?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                      {['Há poucas horas', 'Desde ontem', 'Há 2 dias ou mais', 'Não sei dizer'].map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setDuration(opt)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: duration === opt ? '2px solid #001FD8' : '1.5px solid #E2E8F0',
                            backgroundColor: duration === opt ? '#EFF6FF' : '#FFFFFF',
                            color: duration === opt ? '#001FD8' : '#1E293B',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.82rem'
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                      Como está a dor agora?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                      {[
                        { label: 'Leve • 1-3 de 10', title: 'Leve' },
                        { label: 'Moderada • 4-6 de 10', title: 'Moderada' },
                        { label: 'Intensa • 7-10 de 10', title: 'Intensa' }
                      ].map((opt) => (
                        <div
                          key={opt.title}
                          onClick={() => setIntensity(opt.label)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '10px',
                            border: intensity === opt.label ? '2px solid #001FD8' : '1.5px solid #E2E8F0',
                            backgroundColor: intensity === opt.label ? '#EFF6FF' : '#FFFFFF',
                            color: intensity === opt.label ? '#001FD8' : '#1E293B',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.82rem'
                          }}
                        >
                          {opt.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    style={{
                      backgroundColor: '#001FD8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Salvar e Ir para Segurança →
                  </button>
                </>
              )}

              {/* ================================================================
                  ETAPA 3: PRODUTOS PARA REVISAR COM O FARMACÊUTICO (EXATO DO PRINT 2)
                  ================================================================ */}
              {currentStep === 3 && (
                <>
                  {/* Topo do Card com Badge Etapa 3 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.4px' }}>
                        Produtos para revisar com o farmacêutico
                      </h3>
                      <span style={{
                        backgroundColor: '#EFF6FF',
                        color: '#001FD8',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        border: '1px solid #BFDBFE'
                      }}>
                        Etapa 3 • Próximos passos
                      </span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                      Compare as opções do catálogo e leve suas escolhas para avaliação farmacêutica
                    </p>
                  </div>

                  {/* Barra de Progresso Completa */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#001FD8', fontWeight: 700 }}>
                      <CheckCircle2 size={16} color="#001FD8" />
                      <span>Seu relato</span>
                    </div>
                    <div style={{ flex: 1, height: '2px', backgroundColor: '#001FD8' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#001FD8', fontWeight: 700 }}>
                      <CheckCircle2 size={16} color="#001FD8" />
                      <span>Segurança</span>
                    </div>
                    <div style={{ flex: 1, height: '2px', backgroundColor: '#001FD8' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#001FD8', fontWeight: 800 }}>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#001FD8',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem'
                      }}>3</span>
                      <span>Próximos passos</span>
                    </div>
                  </div>

                  {/* Resumo Consolidado do Paciente */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '0.85rem 1.15rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>
                        {userName}, {patientAge} • Dor de cabeça {duration.toLowerCase()} • {intensity}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Sem sinais de alerta relatados • {tookMedicationToday} • {isPregnantOrNursing === 'Não' ? 'Não está grávida nem amamentando.' : isPregnantOrNursing}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#001FD8',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Revisar respostas
                    </button>
                  </div>

                  {/* Mensagem da Dra. Sofia de Orientação Farmacêutica */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      backgroundColor: '#001FD8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Sparkles size={17} color="#FDE047" />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.86rem', color: '#1E293B', lineHeight: 1.45 }}>
                        {userName}, estas são opções do catálogo para revisar com um farmacêutico. Nenhuma está aprovada para o seu caso; são alternativas, não produtos para usar juntos.
                      </p>
                      <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>
                        Dra. Sofia (Farmacêutica IA) • Agora
                      </span>
                    </div>
                  </div>

                  {/* Alerta de Alergia à Dipirona */}
                  {hasAllergy.includes('dipirona') && (
                    <div style={{
                      backgroundColor: '#FFFBEB',
                      border: '1.5px solid #FDE68A',
                      borderRadius: '12px',
                      padding: '0.85rem 1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#B45309', marginBottom: '0.25rem' }}>
                        <AlertTriangle size={15} color="#D97706" />
                        <span>Alergia à dipirona: é necessária avaliação farmacêutica antes de usar.</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#92400E', lineHeight: 1.4 }}>
                        Atenção especial aos anti-inflamatórios. Não use dipirona se houver alergia comprovada.<br />
                        Mesmo princípio ativo = alternativas; não combine, não associe ibuprofeno e naproxeno.
                      </div>
                    </div>
                  )}

                  {/* Seção: Explore as Opções (Grid 3 colunas com 5 remédios + 1 card de conversa) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Explore as opções
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{displayCatalogOptions.length + 1} opções</span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.95rem'
                    }}>
                      {/* Cards de Medicamentos */}
                      {displayCatalogOptions.map((prod) => {
                        const inBasket = basketItems.some((i) => i.id === prod.id);
                        return (
                          <div
                            key={prod.id}
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '14px',
                              border: inBasket ? '2px solid #001FD8' : '1.5px solid #E2E8F0',
                              padding: '1rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: inBasket ? '0 4px 14px rgba(0, 31, 216, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                              position: 'relative'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  style={{
                                    width: '54px',
                                    height: '54px',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    padding: '2px'
                                  }}
                                />
                                <span style={{
                                  fontSize: '0.66rem',
                                  fontWeight: 700,
                                  color: '#001FD8',
                                  backgroundColor: '#EFF6FF',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '6px'
                                }}>
                                  Catálogo
                                </span>
                              </div>

                              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>
                                {prod.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#001FD8', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Princípio ativo: {prod.activePrinciple}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.35, marginBottom: '0.85rem' }}>
                                {prod.description}
                              </div>
                            </div>

                            <div>
                              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.65rem' }}>
                                R$ {prod.price.toFixed(2).replace('.', ',')}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleBasketItem(prod)}
                                style={{
                                  width: '100%',
                                  backgroundColor: inBasket ? '#10B981' : '#001FD8',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '10px',
                                  padding: '0.55rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.35rem',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {inBasket ? (
                                  <>
                                    <Check size={14} />
                                    <span>Adicionado</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={14} />
                                    <span>Adicionar à cesta</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Card 6: A escolha começa com uma conversa */}
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '14px',
                        border: '1.5px dashed #CBD5E1',
                        padding: '1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'left'
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: '#EFF6FF',
                          color: '#001FD8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '0.75rem'
                        }}>
                          <MessageSquare size={18} />
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                          A escolha começa com uma conversa.
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: 1.4 }}>
                          Compare o princípio ativo, não apenas a marca. O farmacêutico precisa avaliar sua alergia antes de orientar o uso.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Info size={13} color="#001FD8" />
                    <span>Adicionar à cesta não substitui a avaliação farmacêutica e não confirma que o produto é adequado para você.</span>
                  </div>
                </>
              )}

              {/* Input Inferior de Mensagem / Câmera / Anexo (Presente nas duas telas) */}
              <div style={{
                borderTop: '1px solid #F1F5F9',
                paddingTop: '1rem'
              }}>
                <form onSubmit={handleSendCustomMessage}>
                  <input
                    type="file"
                    ref={chatFileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setChatAttachment({ name: file.name });
                    }}
                  />

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '999px',
                    border: '1.5px solid #E2E8F0',
                    padding: '0.3rem 0.6rem 0.3rem 1.15rem'
                  }}>
                    <input
                      type="text"
                      placeholder="Quer contar mais outro sintoma? Tire dúvidas sobre as opções..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.84rem',
                        color: '#0F172A',
                        outline: 'none',
                        padding: '0.45rem 0'
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={onOpenCamera}
                        style={{ border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer', padding: '0.3rem' }}
                        title="Tirar foto"
                      >
                        <Camera size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        style={{ border: 'none', background: 'transparent', color: '#64748B', cursor: 'pointer', padding: '0.3rem' }}
                        title="Anexar arquivo"
                      >
                        <Paperclip size={18} />
                      </button>

                      <button
                        type="submit"
                        disabled={!customInput.trim()}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: customInput.trim() ? '#001FD8' : '#CBD5E1',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: customInput.trim() ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem',
                    fontSize: '0.72rem',
                    color: '#64748B',
                    padding: '0 0.5rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.85rem' }}>
                      <span onClick={onOpenCamera} style={{ color: '#001FD8', fontWeight: 700, cursor: 'pointer' }}>
                        Câmera
                      </span>
                      <span onClick={() => chatFileInputRef.current?.click()} style={{ color: '#001FD8', fontWeight: 700, cursor: 'pointer' }}>
                        Anexar receita ou medicamento
                      </span>
                    </div>
                    <span>Enter para enviar</span>
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.4rem', padding: '0 0.5rem' }}>
                    Se surgirem alertas muito intensos: fraqueza, confusão, dificuldade para falar, febre com rigidez na nuca, procure urgência ou ligue 192.
                  </div>
                </form>
              </div>

            </div>
          </div>

          {/* ====================================================================
              COLUNA DIREITA: REVISE SUA CESTA
              ==================================================================== */}
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.85rem 0' }}>
              Revise sua cesta
            </h2>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '1.5rem',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Header do Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#001FD8', fontSize: '0.74rem', fontWeight: 800 }}>
                  <Sparkles size={13} color="#001FD8" />
                  <span>Cesta Inteligente Pague Menos</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>
                  {basketItems.length} itens
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                Consulta Farmacêutica Digital
              </h3>

              {/* ================================================================
                  ESTADO: CESTA VAZIA (Exato dos dois prints)
                  ================================================================ */}
              {basketItems.length === 0 && (
                <div style={{
                  padding: '2rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#001FD8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <ShoppingBag size={26} />
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                    Sua cesta está vazia
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45, maxWidth: '280px', margin: '0 0 1.25rem 0' }}>
                    {currentStep === 2
                      ? 'As recomendações vêm após entendermos seus sintomas e as informações de segurança.'
                      : 'Você pode adicionar medicamentos para conversar com o farmacêutico antes de usar.'}
                  </p>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#EFF6FF',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '20px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#001FD8'
                  }}>
                    {currentStep === 2 ? (
                      <>
                        <CheckCircle2 size={15} color="#001FD8" />
                        <span>Entendendo seus sintomas</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={15} color="#001FD8" />
                        <span>Avaliação farmacêutica necessária</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ================================================================
                  ESTADO: COM PRODUTOS ADICIONADOS
                  ================================================================ */}
              {basketItems.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {basketItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: item.selected ? '1.5px solid #001FD8' : '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleSelectBasketItem(item.id)}
                          style={{ accentColor: '#001FD8', cursor: 'pointer' }}
                        />
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#F8FAFC' }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '0.15rem 0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => updateBasketQty(item.id, -1)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.1rem', color: '#475569' }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800 }}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateBasketQty(item.id, 1)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.1rem', color: '#475569' }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bloco de Totais */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748B' }}>
                    Total da cesta
                  </span>
                  <span style={{ fontSize: '1.85rem', fontWeight: 900, color: '#E30613', letterSpacing: '-0.5px' }}>
                    R$ {basketItems.length > 0 ? basketTotal.toFixed(2).replace('.', ',') : '0,00'}
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  {basketItems.length === 0 ? (
                    'Nenhum produto adicionado'
                  ) : (
                    `★ Preço exclusivo Sempre Bem (${selectedItems.length} de ${basketItems.length} selecionados)`
                  )}
                </div>
              </div>

              {/* Botão de Compra */}
              <button
                type="button"
                disabled={selectedItems.length === 0}
                onClick={handleCheckoutSelected}
                style={{
                  width: '100%',
                  backgroundColor: selectedItems.length > 0 ? '#001FD8' : '#94A3B8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: selectedItems.length > 0 ? '0 4px 14px rgba(0, 31, 216, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShoppingBag size={16} />
                <span>
                  {selectedItems.length > 0
                    ? `Comprar Selecionados (${selectedItems.length} itens • R$ ${basketTotal.toFixed(2).replace('.', ',')})`
                    : 'Selecione ao menos 1 item para comprar'}
                </span>
              </button>

              <div style={{ fontSize: '0.68rem', color: '#94A3B8', textAlign: 'center', marginTop: '-0.45rem' }}>
                Adicionar à cesta não substitui a avaliação farmacêutica e não autoriza o uso.
              </div>

              {/* Linha inferior de Checkbox */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.74rem',
                color: '#64748B',
                borderTop: '1px solid #F8FAFC',
                paddingTop: '0.5rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: basketItems.length > 0 ? 'pointer' : 'default' }}>
                  <input
                    type="checkbox"
                    disabled={basketItems.length === 0}
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    style={{ accentColor: '#001FD8' }}
                  />
                  <span>
                    Selecionar todos ({selectedItems.length}/{basketItems.length})
                  </span>
                </label>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>
                  Subtotal: R$ {basketTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

            </div>

            {/* Card Inferior: Vamos revisar juntos? (Exato do Print 2) */}
            <div style={{
              marginTop: '1.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: '1.35rem',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                Vamos revisar juntos?
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                Informe sua alergia à dipirona ao farmacêutico e tire suas dúvidas antes de escolher.
              </p>

              <button
                type="button"
                onClick={() => showToast('Conectando ao farmacêutico de plantão via chat oficial...')}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  color: '#001FD8',
                  border: '1.5px solid #001FD8',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <MessageSquare size={16} />
                <span>Falar com um farmacêutico</span>
              </button>
            </div>
          </div>

        </div>

        {/* 4. Rodapé da Consulta */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0',
          fontSize: '0.74rem',
          color: '#94A3B8',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>Farma Viva AI pode cometer erros. Consulte sempre um profissional de saúde.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#001FD8', fontWeight: 700, cursor: 'pointer' }}>
            <span>Falar com um farmacêutico</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DesktopAiResponsePage;
