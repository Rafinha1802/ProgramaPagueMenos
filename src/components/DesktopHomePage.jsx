import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Truck,
  Box,
  ShoppingBag,
  CreditCard,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Percent,
  Clock,
  Heart,
  X,
  Paperclip,
  Camera,
  FileText,
  Image as ImageIcon,
  Upload,
  Calendar,
  Gift,
  Bell
} from 'lucide-react';
import { CATALOG } from '../data/catalog';

export function DesktopHomePage({
  onSelectCategory,
  activeCategory,
  onAddToCart,
  onOpenAiWithPrompt,
  onOpenCart,
  aiRecommendation,
  onOpenPrescriptionFlow,
  onShowToast,
  onOpenAuth
}) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiBudget, setAiBudget] = useState('');
  const [preferGenerics, setPreferGenerics] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [currentBubbleTextIndex, setCurrentBubbleTextIndex] = useState(0);
  const [isFabBubbleOpen, setIsFabBubbleOpen] = useState(true);

  const desktopFileInputRef = useRef(null);
  const desktopDocInputRef = useRef(null);

  // Mensagens rotativas dinâmicas do chatbot flutuante
  const bubbleMessages = [
    "Olá! Posso te ajudar a montar sua cesta ou encontrar genéricos?",
    "Precisa de protetor para a praia ou alívio de gripe e dor?",
    "Economize até 95% trocando por genéricos aprovados pela ANVISA!",
    "Envie sua dúvida ou receita médica para nossa Farmacêutica IA."
  ];

  const [activeBannerSlide, setActiveBannerSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBubbleTextIndex((prev) => (prev + 1) % bubbleMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bubbleMessages.length]);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveBannerSlide((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(bannerTimer);
  }, []);

  // Upload de imagem do desktop
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment({
          type: 'photo',
          name: file.name,
          previewUrl: event.target.result,
          intent: preferGenerics ? 'generic' : 'generic',
          sizeText: `${(file.size / 1024).toFixed(0)} KB`
        });
        setShowAttachMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload de documento PDF de receita
  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({
        type: 'document',
        name: file.name,
        previewUrl: null,
        intent: 'prescription',
        sizeText: `${(file.size / 1024).toFixed(0)} KB`
      });
      setShowAttachMenu(false);
    }
  };

  // Exemplos rápidos para testar em 1 clique
  const handleSelectSample = (sampleType) => {
    if (sampleType === 'dorflex') {
      setAttachment({
        type: 'photo',
        name: 'foto_caixa_dorflex.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
        intent: 'generic',
        detectedMedication: 'Dorflex'
      });
      if (!aiPrompt) setAiPrompt('Quero encontrar o genérico mais barato deste medicamento para dor muscular');
    } else if (sampleType === 'rivotril') {
      setAttachment({
        type: 'photo',
        name: 'foto_caixa_rivotril_2mg.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
        intent: 'generic',
        detectedMedication: 'Rivotril'
      });
      if (!aiPrompt) setAiPrompt('Encontrar o genérico equivalente deste calmante');
    } else if (sampleType === 'receita') {
      setAttachment({
        type: 'document',
        name: 'prescricao_medica_digital.pdf',
        previewUrl: null,
        intent: 'prescription',
        detectedMedication: 'Amoxicilina'
      });
      if (!aiPrompt) setAiPrompt('Comprar medicamentos da minha receita médica');
    }
    setShowAttachMenu(false);
  };

  // Envio da busca da IA com suporte a anexo
  const handleAiSubmit = (e) => {
    e.preventDefault();
    let prompt = aiPrompt.trim();
    if (!prompt) {
      if (attachment) {
        if (attachment.intent === 'generic') {
          prompt = `Encontrar genérico equivalente mais barato para o medicamento ${attachment.name}`;
        } else if (attachment.intent === 'repurchase') {
          prompt = `Recomprar medicamento da foto ${attachment.name}`;
        } else {
          prompt = `Medicamentos prescritos na receita médica ${attachment.name}`;
        }
      } else {
        prompt = 'Produtos essenciais de saúde e bem-estar';
      }
    }
    const budget = aiBudget.trim() ? parseFloat(aiBudget) : null;
    onOpenAiWithPrompt(prompt, budget, preferGenerics, attachment);
  };

  // Ofertas em Destaque (5 Cards com degradê FarmaViva)
  const promoCards = [
    {
      id: 'promo-1',
      brand: 'Saúde FarmaViva',
      title: "SHAMPOO INFANTIL JOHNSON'S BABY",
      highlight: '20% DE DESCONTO',
      gradient: 'linear-gradient(135deg, #0A196F 0%, #001242 100%)',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
      tagColor: '#E30613',
      actionPrompt: "Shampoo infantil Johnson's Baby com desconto"
    },
    {
      id: 'promo-2',
      brand: 'Risqué',
      title: 'ESMALTE RISQUÉ DIAMOND GEL',
      highlight: 'LEVE 3 PAGUE 2',
      gradient: 'linear-gradient(135deg, #001FD8 0%, #1E0099 100%)',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
      tagColor: '#0022D6',
      actionPrompt: 'Esmaltes Risqué Diamond Gel'
    },
    {
      id: 'promo-3',
      brand: 'Cetaphil',
      title: 'LOÇÃO HIDRATANTE CETAPHIL',
      highlight: '20% NA 2ª UNIDADE',
      gradient: 'linear-gradient(135deg, #1A0066 0%, #3B0086 100%)',
      image: 'https://images.unsplash.com/photo-1608248597359-009133612803?auto=format&fit=crop&w=400&q=80',
      tagColor: '#6B21A8',
      actionPrompt: 'Hidratante Cetaphil loção e creme'
    },
    {
      id: 'promo-4',
      brand: 'Colgate',
      title: 'ANTISSÉPTICO COLGATE',
      highlight: 'DE: R$ 18,99 POR R$ 8,99 CADA',
      gradient: 'linear-gradient(135deg, #001489 0%, #0052CC 100%)',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
      tagColor: '#0284C7',
      isPiscouPerdeu: true,
      actionPrompt: 'Antisséptico bucal Colgate higiene oral'
    },
    {
      id: 'promo-5',
      brand: 'Especial Genéricos',
      title: 'GENÉRICOS FARMAVIVA',
      highlight: 'LEVE 3 PAGUE 2 • ATÉ 95% OFF',
      gradient: 'linear-gradient(135deg, #4A0072 0%, #7B1FA2 100%)',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      tagColor: '#E30613',
      isGenerico: true,
      actionPrompt: 'Medicamentos genéricos com até 95% de desconto'
    }
  ];

  // Faixa de Benefícios Oficiais (Ícones e textos exatamente como no print)
  const benefits = [
    {
      icon: <Truck size={28} color="#001FD8" strokeWidth={1.8} />,
      title: 'Frete Grátis',
      subtitle: 'a partir R$150*'
    },
    {
      icon: <Box size={28} color="#001FD8" strokeWidth={1.8} />,
      title: 'Clique e Retire',
      subtitle: 'Em até 1 hora*'
    },
    {
      icon: <ShoppingBag size={28} color="#E30613" strokeWidth={1.8} />,
      title: 'Entrega de medicamentos',
      subtitle: 'Todos, onde você estiver'
    },
    {
      icon: <CreditCard size={28} color="#E30613" strokeWidth={1.8} />,
      title: 'Apple pay e Google pay',
      subtitle: 'Confira no checkout'
    },
    {
      icon: <Download size={28} color="#001FD8" strokeWidth={1.8} />,
      title: 'Baixe',
      subtitle: 'Nosso aplicativo'
    }
  ];

  // Carrossel de Categorias Oficiais (Exato como no Print 2)
  const categoryCards = [
    {
      id: 'ofertas',
      title: 'Ofertas',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=320&q=80',
      bgColor: '#F59E0B'
    },
    {
      id: 'emagrecedores',
      title: 'Emagrecedores',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    },
    {
      id: 'Skincare',
      title: 'Skincare',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    },
    {
      id: 'Medicamentos',
      title: 'Azia e Gastrite',
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    },
    {
      id: 'Suplementos',
      title: 'Whey Protein',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    },
    {
      id: 'Skincare',
      title: 'Protetor Solar Facial',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    }
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '4rem' }}>

      {/* ====================================================================
          1. BARRA DA FARMACÊUTICA IA
          ==================================================================== */}
      <section style={{
        background: 'linear-gradient(135deg, #001FD8 0%, #001489 100%)',
        color: '#FFFFFF',
        padding: '1.25rem 0',
        borderBottom: '3px solid #E30613',
        boxShadow: '0 4px 18px rgba(0, 31, 216, 0.25)',
        position: 'relative',
        overflow: 'visible',
        zIndex: 20
      }}>
        {/* Glow decorativo (contido em wrapper com overflow hidden) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '5%',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(227, 6, 19, 0.3) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
        </div>

        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Título & Identificação Farmacêutica */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'rgba(255,255,255,0.18)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                <Sparkles size={13} color="#FDE047" />
                <span>Atendimento com IA Farmacêutica</span>
                <span style={{ color: '#86EFAC' }}>• CRF/SP 48.219 Ativo</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px', margin: 0 }}>
                O que você precisa hoje? Monte sua cesta inteligente com 1 clique
              </h2>
            </div>

            {/* Atalhos Rápidos da IA */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {[
                { label: '🏖️ Praia & Proteção Solar', prompt: 'vou a praia e quero protetor e cuidados com a pele até 100 reais' },
                { label: '🤒 Gripe & Dor no Corpo', prompt: 'estou com sintomas de gripe, dor no corpo e febre' },
                { label: '🧴 Skincare Pele Oleosa', prompt: 'rotina para pele oleosa com acne e protetor toque seco' },
                { label: '💊 Genéricos com 95% OFF', prompt: 'trocar medicamentos habituais por genéricos econômicos' }
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => onOpenAiWithPrompt(chip.prompt, null, chip.prompt.includes('genéricos'))}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs ocultos de arquivos para desktop */}
          <input
            ref={desktopFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
          <input
            ref={desktopDocInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            style={{ display: 'none' }}
            onChange={handleDocUpload}
          />

          {/* Campo de Busca Inteligente / Chat Dinâmico */}
          <form onSubmit={handleAiSubmit} style={{ marginTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div style={{
                flex: '1',
                minWidth: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '0.35rem 0.65rem 0.35rem 1rem',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                position: 'relative'
              }}>
                <MessageSquare size={17} color="#001FD8" style={{ marginRight: '0.65rem', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Descreva sua situação ou anexe a foto/receita do medicamento..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.88rem',
                    color: '#1E293B',
                    backgroundColor: 'transparent',
                    padding: '0.45rem 0'
                  }}
                />

                {/* Botão de Anexar Imagem ou Documento na mesma caixa */}
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: attachment ? '#FEF2F2' : '#EFF6FF',
                    color: attachment ? '#DC2626' : '#001FD8',
                    border: attachment ? '1.5px solid #FECACA' : '1px solid #BFDBFE',
                    borderRadius: '10px',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                    marginLeft: '0.4rem'
                  }}
                  title="Anexar foto do medicamento ou documento da receita"
                >
                  <Paperclip size={14} />
                  <span>{attachment ? 'Alterar Anexo' : 'Anexar Imagem / Receita'}</span>
                </button>

                {/* Menu Dropdown de Anexos no Desktop */}
                {showAttachMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '0.75rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    zIndex: 200,
                    minWidth: '310px',
                    border: '1px solid #E2E8F0',
                    animation: 'fadeIn 0.15s ease-out'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                      Anexar Medicamento ou Receita:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => desktopFileInputRef.current?.click()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.5rem 0.65rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          color: '#001FD8',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <ImageIcon size={16} />
                        <span>Foto do Remédio</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => desktopDocInputRef.current?.click()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.5rem 0.65rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          color: '#DC2626',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={16} />
                        <span>Receita (PDF)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Limite de Gastos (Opcional) */}
              <div style={{
                width: '160px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '0.35rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
              }}>
                <DollarSign size={16} color="#008744" style={{ marginRight: '0.2rem', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 800, marginRight: '0.3rem' }}>R$</span>
                <input
                  type="number"
                  placeholder="Teto (ex: 100)"
                  value={aiBudget}
                  onChange={(e) => setAiBudget(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#1E293B'
                  }}
                />
              </div>

              {/* Toggle de Genéricos */}
              <div
                onClick={() => setPreferGenerics(!preferGenerics)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: preferGenerics ? 'rgba(74, 222, 128, 0.25)' : 'rgba(255,255,255,0.15)',
                  border: preferGenerics ? '1.5px solid #4ADE80' : '1px solid rgba(255,255,255,0.25)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#FFFFFF'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  backgroundColor: preferGenerics ? '#4ADE80' : '#FFFFFF',
                  color: '#001FD8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900
                }}>
                  {preferGenerics ? '✓' : ''}
                </div>
                <span>Priorizar Genéricos</span>
              </div>

              {/* Botão de Ação Dinâmico */}
              <button
                type="submit"
                style={{
                  backgroundColor: '#E30613',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.65rem 1.45rem',
                  borderRadius: '14px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(227, 6, 19, 0.45)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Sparkles size={16} color="#FDE047" />
                <span>{attachment ? 'Processar com IA' : 'Montar Cesta com IA'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* PREVIEW DO ANEXO NO DESKTOP COM INTENÇÃO SELECIONÁVEL */}
            {attachment && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                borderRadius: '14px',
                padding: '0.65rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                border: '1.5px solid #60A5FA',
                color: '#0F172A',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {attachment.previewUrl ? (
                    <img
                      src={attachment.previewUrl}
                      alt="Anexo"
                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: '42px', height: '42px', backgroundColor: '#EFF6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8', flexShrink: 0 }}>
                      <FileText size={22} />
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>
                        {attachment.name}
                      </span>
                      <span style={{ fontSize: '0.66rem', color: '#059669', backgroundColor: '#ECFDF5', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                        Anexo Pronto
                      </span>
                    </div>

                    {/* Botões de Intenção: Genérico, Recompra, Receita */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>Objetivo:</span>

                      <button
                        type="button"
                        onClick={() => setAttachment({ ...attachment, intent: 'generic' })}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: attachment.intent === 'generic' ? '#001FD8' : '#F1F5F9',
                          color: attachment.intent === 'generic' ? '#FFFFFF' : '#475569',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        💊 Encontrar Genérico Equivalente
                      </button>

                      <button
                        type="button"
                        onClick={() => setAttachment({ ...attachment, intent: 'repurchase' })}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: attachment.intent === 'repurchase' ? '#001FD8' : '#F1F5F9',
                          color: attachment.intent === 'repurchase' ? '#FFFFFF' : '#475569',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        🔄 Comprar Novamente
                      </button>

                      <button
                        type="button"
                        onClick={() => setAttachment({ ...attachment, intent: 'prescription' })}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: attachment.intent === 'prescription' ? '#E30613' : '#F1F5F9',
                          color: attachment.intent === 'prescription' ? '#FFFFFF' : '#475569',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        📋 Validar Receita Médica
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Remover anexo"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </form>

        </div>
      </section>

      {/* ====================================================================
          1.1 NOTIFICAÇÕES & AÇÕES RÁPIDAS (EXATO CONFORME SOLICITADO NO PRINT)
          ==================================================================== */}
      <section style={{ padding: '1.25rem 0 0.5rem 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.15rem'
          }}>
            {/* Card 1: Busque produtos usando sua receita (com badge Novo verde) */}
            <div
              onClick={() => {
                if (typeof onOpenPrescriptionFlow === 'function') {
                  onOpenPrescriptionFlow();
                } else if (desktopFileInputRef?.current) {
                  desktopFileInputRef.current.click();
                }
              }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.25rem 1.35rem',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '118px',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 22px rgba(0, 31, 216, 0.12)';
                e.currentTarget.style.borderColor = '#93C5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.05)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#001FD8'
                }}>
                  <FileText size={22} strokeWidth={2.2} />
                </div>
                <span style={{
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px',
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                }}>
                  Novo
                </span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.3
                }}>
                  Busque produtos usando sua receita
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Envie foto ou PDF para leitura por IA
                </div>
              </div>
            </div>

            {/* Card 2: Configure alertas de medicamentos */}
            <div
              onClick={() => {
                if (typeof onShowToast === 'function') {
                  onShowToast('⏰ Lembrete de medicamentos ativado! Você receberá alertas nos horários configurados.');
                }
              }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.25rem 1.35rem',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '118px',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 22px rgba(0, 31, 216, 0.12)';
                e.currentTarget.style.borderColor = '#93C5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.05)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#001FD8'
                }}>
                  <Calendar size={22} strokeWidth={2.2} />
                </div>
                <span style={{
                  backgroundColor: '#E0E7FF',
                  color: '#3730A3',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px',
                  letterSpacing: '0.02em'
                }}>
                  Alertas
                </span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.3
                }}>
                  Configure alertas de medicamentos
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Nunca mais esqueça seus horários
                </div>
              </div>
            </div>

            {/* Card 3: Economize trocando por genéricos */}
            <div
              onClick={() => onOpenAiWithPrompt('Quero encontrar os genéricos mais baratos aprovados pela ANVISA.')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.25rem 1.35rem',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '118px',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 22px rgba(0, 31, 216, 0.12)';
                e.currentTarget.style.borderColor = '#93C5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.05)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706'
                }}>
                  <Percent size={22} strokeWidth={2.4} />
                </div>
                <span style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px'
                }}>
                  Até 95% OFF
                </span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.3
                }}>
                  Economize trocando por genéricos
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Mesmo efeito ativo com super economia
                </div>
              </div>
            </div>

            {/* Card 4: Clique e Retire Express em 1 hora */}
            <div
              onClick={() => {
                if (typeof onShowToast === 'function') {
                  onShowToast('📦 Retire Express: Mais de 850 lojas prontas para retirada em 1 hora!');
                }
              }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '1.25rem 1.35rem',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '118px',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 22px rgba(0, 31, 216, 0.12)';
                e.currentTarget.style.borderColor = '#93C5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.05)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16A34A'
                }}>
                  <Clock size={22} strokeWidth={2.2} />
                </div>
                <span style={{
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.22rem 0.65rem',
                  borderRadius: '999px'
                }}>
                  Grátis
                </span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.3
                }}>
                  Clique e Retire Express em 1 hora
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Sem custo de frete na farmácia mais perto
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          1.2 BANNERS DE PROPAGANDA OFICIAIS FARMAVIVA (EXATOS COMO NO PRINT)
          ==================================================================== */}
      <section style={{ padding: '1.25rem 0 1rem 0' }}>
        <div className="container">
          {/* Header com indicador do carrossel */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '8px',
                height: '24px',
                backgroundColor: '#001FD8',
                borderRadius: '4px'
              }} />
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.3px',
                margin: 0
              }}>
                Campanhas & Ofertas em Destaque
              </h2>
            </div>
            {/* Controles de slide */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveBannerSlide((prev) => (prev === 0 ? 1 : 0))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
                title="Banner anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span
                  onClick={() => setActiveBannerSlide(0)}
                  style={{
                    width: activeBannerSlide === 0 ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    backgroundColor: activeBannerSlide === 0 ? '#001FD8' : '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
                <span
                  onClick={() => setActiveBannerSlide(1)}
                  style={{
                    width: activeBannerSlide === 1 ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    backgroundColor: activeBannerSlide === 1 ? '#001FD8' : '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              <button
                onClick={() => setActiveBannerSlide((prev) => (prev === 1 ? 0 : 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
                title="Próximo banner"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Container do Slide */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.25rem'
          }}>
            {activeBannerSlide === 0 ? (
              <>
                {/* Banner 1: ALIMENTO INFANTIL COM ATÉ 60% OFF NA 2ª UNIDADE (EXATO PRINT) */}
                <div
                  onClick={() => onOpenAiWithPrompt('Quero ofertas de fórmulas infantis como Aptanutri e Nestonutri.')}
                  style={{
                    background: 'linear-gradient(135deg, #004DE6 0%, #002BB8 65%, #001B7A 100%)',
                    borderRadius: '22px',
                    padding: '1.6rem 1.8rem',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '190px',
                    boxShadow: '0 10px 28px rgba(0, 43, 184, 0.28)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.25s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.015)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {/* Detalhe de fundo translúcido */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Lado Esquerdo do Banner: Tipografia idêntica ao print */}
                  <div style={{ zIndex: 2, maxWidth: '290px' }}>
                    <div style={{
                      fontSize: '1.28rem',
                      fontWeight: 900,
                      letterSpacing: '-0.3px',
                      textTransform: 'uppercase',
                      lineHeight: 1.15,
                      color: '#FFFFFF'
                    }}>
                      ALIMENTO INFANTIL
                    </div>
                    <div style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      color: '#93C5FD',
                      marginTop: '0.35rem',
                      letterSpacing: '0.04em'
                    }}>
                      COM ATÉ
                    </div>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: 900,
                      color: '#FF2A85',
                      lineHeight: 1,
                      margin: '0.2rem 0',
                      letterSpacing: '-1px',
                      textShadow: '0 2px 10px rgba(255, 42, 133, 0.4)'
                    }}>
                      60% OFF
                    </div>
                    <div style={{
                      fontSize: '0.98rem',
                      fontWeight: 900,
                      letterSpacing: '0.02em',
                      color: '#FFFFFF',
                      textTransform: 'uppercase'
                    }}>
                      NA 2ª UNIDADE
                    </div>
                  </div>

                  {/* Lado Direito: Ilustração das latas Aptanutri 3 e Nestonutri 1-3 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 2,
                    position: 'relative'
                  }}>
                    {/* Lata 1: Aptanutri 3 */}
                    <div style={{
                      width: '90px',
                      height: '120px',
                      background: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.85)',
                      boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 4px 10px 4px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Tampa da lata metálica */}
                      <div style={{
                        width: '74px',
                        height: '7px',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '4px',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
                      }} />
                      {/* Rótulo */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          color: '#FDE047',
                          letterSpacing: '0.02em',
                          lineHeight: 1.1
                        }}>
                          Aptanutri
                        </div>
                        <div style={{
                          fontSize: '1.45rem',
                          fontWeight: 900,
                          color: '#FFFFFF',
                          lineHeight: 1,
                          marginTop: '2px'
                        }}>
                          3
                        </div>
                        <div style={{
                          fontSize: '0.58rem',
                          fontWeight: 700,
                          color: '#BAE6FD',
                          marginTop: '2px'
                        }}>
                          800g
                        </div>
                      </div>
                      {/* Faixa inferior */}
                      <div style={{
                        fontSize: '0.52rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        color: '#FFFFFF',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        Fórmula
                      </div>
                    </div>

                    {/* Lata 2: Nestonutri 1-3 */}
                    <div style={{
                      width: '90px',
                      height: '120px',
                      background: 'linear-gradient(180deg, #15803D 0%, #166534 100%)',
                      borderRadius: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.85)',
                      boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 4px 10px 4px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Tampa da lata metálica */}
                      <div style={{
                        width: '74px',
                        height: '7px',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '4px',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
                      }} />
                      {/* Rótulo */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '0.6rem',
                          fontWeight: 900,
                          color: '#FFFFFF',
                          lineHeight: 1.1
                        }}>
                          Nestonutri
                        </div>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          color: '#FDE047',
                          lineHeight: 1,
                          marginTop: '3px'
                        }}>
                          1–3
                        </div>
                        <div style={{
                          fontSize: '0.58rem',
                          fontWeight: 700,
                          color: '#BBF7D0',
                          marginTop: '2px'
                        }}>
                          800g
                        </div>
                      </div>
                      {/* Faixa inferior */}
                      <div style={{
                        fontSize: '0.52rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        color: '#FFFFFF',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        Nutrição
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner 2: FESTIVAL DERMO & BELEZA (EXATO PRINT) */}
                <div
                  onClick={() => onOpenAiWithPrompt('Quero ver ofertas de dermocosméticos e protetor solar do Festival Dermo.')}
                  style={{
                    background: 'linear-gradient(135deg, #1E1B4B 0%, #17153D 60%, #0F0D2E 100%)',
                    borderRadius: '22px',
                    padding: '1.6rem 1.8rem',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '190px',
                    boxShadow: '0 10px 28px rgba(30, 27, 75, 0.35)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.25s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.015)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {/* Detalhe de fundo */}
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, rgba(236, 72, 153, 0) 70%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Lado Esquerdo */}
                  <div style={{ zIndex: 2, maxWidth: '290px' }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#FF2A85',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.24rem 0.75rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.6rem',
                      boxShadow: '0 2px 8px rgba(255, 42, 133, 0.4)'
                    }}>
                      Festival Dermo & Beleza
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      letterSpacing: '-0.4px',
                      lineHeight: 1.15,
                      color: '#FFFFFF'
                    }}>
                      COMBINE PRODUTOS
                    </div>
                    <div style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#67E8F9',
                      marginTop: '0.4rem',
                      lineHeight: 1.2
                    }}>
                      E GANHE 25% OFF
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#CBD5E1',
                      marginTop: '0.5rem'
                    }}>
                      La Roche-Posay, CeraVe, Vichy & mais
                    </div>
                  </div>

                  {/* Lado Direito: Frascos de Dermocosméticos */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '8px',
                    zIndex: 2,
                    position: 'relative'
                  }}>
                    {/* Frasco Serum */}
                    <div style={{
                      width: '46px',
                      height: '110px',
                      background: 'linear-gradient(180deg, #F43F5E 0%, #BE123C 100%)',
                      borderRadius: '10px 10px 14px 14px',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 3px 8px 3px',
                      border: '1.5px solid rgba(255,255,255,0.7)'
                    }}>
                      <div style={{
                        width: '18px',
                        height: '14px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '3px'
                      }} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.5rem', fontWeight: 900, color: '#FFFFFF' }}>B5</div>
                        <div style={{ fontSize: '0.42rem', color: '#FECDD3' }}>Sérum</div>
                      </div>
                      <div style={{ width: '80%', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                    </div>

                    {/* Frasco Hidratante CeraVe */}
                    <div style={{
                      width: '62px',
                      height: '130px',
                      background: 'linear-gradient(180deg, #0284C7 0%, #075985 100%)',
                      borderRadius: '12px 12px 16px 16px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 4px 8px 4px',
                      border: '1.5px solid rgba(255,255,255,0.85)'
                    }}>
                      <div style={{
                        width: '28px',
                        height: '16px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.56rem', fontWeight: 900, color: '#FFFFFF' }}>Loção</div>
                        <div style={{ fontSize: '0.46rem', color: '#BAE6FD' }}>473ml</div>
                      </div>
                      <div style={{
                        fontSize: '0.48rem',
                        fontWeight: 800,
                        backgroundColor: '#0284C7',
                        color: '#FFFFFF',
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        Dermo
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Banner 3: GENÉRICOS COM ANVISA - LEVE 3 PAGUE 2 */}
                <div
                  onClick={() => onOpenAiWithPrompt('Quero ver a promoção Leve 3 Pague 2 de Genéricos.')}
                  style={{
                    background: 'linear-gradient(135deg, #00875A 0%, #005A3C 60%, #003D28 100%)',
                    borderRadius: '22px',
                    padding: '1.6rem 1.8rem',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '190px',
                    boxShadow: '0 10px 28px rgba(0, 135, 90, 0.28)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.25s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.015)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <div style={{ zIndex: 2, maxWidth: '290px' }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#FDE047',
                      color: '#0F172A',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      padding: '0.24rem 0.75rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.6rem'
                    }}>
                      Tarja Amarela ANVISA
                    </div>
                    <div style={{
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      letterSpacing: '-0.3px',
                      lineHeight: 1.15,
                      color: '#FFFFFF'
                    }}>
                      GENÉRICOS SELECIONADOS
                    </div>
                    <div style={{
                      fontSize: '2.1rem',
                      fontWeight: 900,
                      color: '#4ADE80',
                      lineHeight: 1,
                      margin: '0.35rem 0'
                    }}>
                      LEVE 3, PAGUE 2
                    </div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: '#D1FAE5'
                    }}>
                      Dipirona, Losartana, Omeprazol & mais
                    </div>
                  </div>

                  {/* Caixa Genérico com Tarja Amarela */}
                  <div style={{
                    width: '130px',
                    height: '95px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    border: '2px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '8px',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#0F172A' }}>MEDICAMENTO</span>
                      <ShieldCheck size={16} color="#00875A" />
                    </div>
                    {/* Tarja Amarela com G maiúsculo */}
                    <div style={{
                      backgroundColor: '#FACC15',
                      height: '32px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      gap: '6px',
                      border: '1px solid #EAB308'
                    }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000000', lineHeight: 1 }}>G</span>
                      <span style={{ fontSize: '0.52rem', fontWeight: 900, color: '#000000', lineHeight: 1.1 }}>
                        Medicamento<br />Genérico
                      </span>
                    </div>
                    <div style={{ fontSize: '0.52rem', color: '#64748B', textAlign: 'right' }}>
                      Lei nº 9.787/99
                    </div>
                  </div>
                </div>

                {/* Banner 4: CUPOM BEMVINDO15 */}
                <div
                  onClick={() => {
                    navigator.clipboard?.writeText('BEMVINDO15');
                    if (typeof onShowToast === 'function') {
                      onShowToast('🎉 Cupom BEMVINDO15 copiado com sucesso! Aproveite R$ 15 OFF.');
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #E30613 0%, #A80009 60%, #700006 100%)',
                    borderRadius: '22px',
                    padding: '1.6rem 1.8rem',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '190px',
                    boxShadow: '0 10px 28px rgba(227, 6, 19, 0.3)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.25s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.015)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <div style={{ zIndex: 2, maxWidth: '290px' }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#FFFFFF',
                      color: '#E30613',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      padding: '0.24rem 0.75rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.6rem'
                    }}>
                      Primeira Compra
                    </div>
                    <div style={{
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      letterSpacing: '-0.3px',
                      lineHeight: 1.15,
                      color: '#FFFFFF'
                    }}>
                      R$ 15 DE DESCONTO
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#FEE2E2',
                      marginTop: '0.35rem'
                    }}>
                      Em compras acima de R$ 90 no site
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      marginTop: '0.65rem',
                      border: '1px dashed #FECACA'
                    }}>
                      <span style={{ fontSize: '0.78rem', color: '#FEE2E2' }}>Cupom:</span>
                      <strong style={{ fontSize: '0.92rem', color: '#FFFFFF', letterSpacing: '0.06em' }}>BEMVINDO15</strong>
                    </div>
                  </div>

                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.35)',
                    zIndex: 2
                  }}>
                    <Gift size={48} color="#FFFFFF" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CARROSSEL DE CARDS PROMOCIONAIS COM DEGRADÊ (EXATO COMO PRINT 1)
          ==================================================================== */}
      <section style={{ padding: '2rem 0 1.25rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            overflowX: 'auto'
          }}>
            {promoCards.map((card) => (
              <div
                key={card.id}
                onClick={() => onOpenAiWithPrompt(card.actionPrompt)}
                style={{
                  background: card.gradient,
                  borderRadius: '18px',
                  padding: '1.25rem 1rem',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 26px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
                }}
              >
                {/* Tag Superior */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {card.brand}
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 900, lineHeight: 1.25, letterSpacing: '-0.3px', margin: 0 }}>
                    {card.title}
                  </h3>
                </div>

                {/* Imagem do Produto no centro */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{
                      height: '110px',
                      width: '110px',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      padding: '4px'
                    }}
                  />
                </div>

                {/* Faixa Inferior de Desconto & Marca Pague Menos */}
                <div>
                  <div style={{
                    backgroundColor: card.tagColor,
                    color: '#FFFFFF',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    marginBottom: '0.45rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                  }}>
                    {card.highlight}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, color: '#E2E8F0' }}>
                    <span style={{ color: '#E30613', fontWeight: 900 }}>+</span> FarmaViva
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. FAIXA DE BENEFÍCIOS
          ==================================================================== */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '1.25rem 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            {benefits.map((b, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ marginBottom: '0.2rem' }}>
                  {b.icon}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  {b.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
                  {b.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. BANNER PRINCIPAL PISCOU PERDEU
          ==================================================================== */}
      <section style={{ padding: '1.75rem 0 0.75rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(90deg, #001FD8 0%, #00126B 60%, #000B42 100%)',
            borderRadius: '24px',
            padding: '1.75rem 2.25rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 31, 216, 0.22)'
          }}>
            {/* Esquerda: Logo Piscou Perdeu com Despertador */}
            <div style={{ zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <div style={{
                  backgroundColor: '#E30613',
                  color: '#FFFFFF',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}>
                  Ofertas Relâmpago
                </div>
                <span style={{ fontSize: '0.8rem', color: '#93C5FD', fontWeight: 700 }}>
                  Atualizadas a cada 1 hora
                </span>
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-1px', margin: 0 }}>
                PISCOU<br /><span style={{ color: '#FDE047' }}>PERDEU</span>
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#E2E8F0', marginTop: '0.65rem', maxWidth: '380px' }}>
                Preços especiais válidos apenas hoje com retirada em até 1h na sua loja mais próxima.
              </p>
            </div>

            {/* Centro / Direita: Produtos do Piscou Perdeu com preços */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 2, flexWrap: 'wrap' }}>

              {/* Produto 1: Escova Dental */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '0.85rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backdropFilter: 'blur(8px)' }}>
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=200&q=80"
                  alt="Escova Dental"
                  style={{ width: '54px', height: '54px', objectFit: 'contain' }}
                />
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#CBD5E1', textDecoration: 'line-through' }}>DE: R$ 27,99</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FDE047' }}>POR R$ 6,49</div>
                  <div style={{ fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 700 }}>CADA</div>
                </div>
              </div>

              {/* Produto 2: Desodorante Clinical */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '0.85rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backdropFilter: 'blur(8px)' }}>
                <img
                  src="https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=200&q=80"
                  alt="Desodorante Clinical"
                  style={{ width: '54px', height: '54px', objectFit: 'contain' }}
                />
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#CBD5E1', textDecoration: 'line-through' }}>DE: R$ 37,99</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FDE047' }}>POR R$ 14,99</div>
                  <div style={{ fontSize: '0.65rem', color: '#FFFFFF', fontWeight: 700 }}>CADA</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          5. NAVEGUE POR CATEGORIA
          ==================================================================== */}
      <section style={{ padding: '2.5rem 0 1rem 0' }}>
        <div className="container">

          {/* Header da Seção: Navegue / Por Categoria + Setas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ color: '#E30613', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Navegue
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px', margin: 0 }}>
                Por Categoria
              </h2>
            </div>

            {/* Setas de Navegação Circular do Carrossel */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#001FD8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#001FD8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Cards de Categorias (6 Cards com Imagem e Botão Azul Embaixo) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem'
          }}>
            {categoryCards.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCategory(cat.id === 'ofertas' ? 'all' : cat.id)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                {/* Imagem da Categoria */}
                <div style={{
                  height: '140px',
                  backgroundColor: cat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '0.75rem'
                }}>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Botão Azul com o Nome da Categoria */}
                <div style={{
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  padding: '0.65rem 0.5rem',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '-0.2px'
                }}>
                  {cat.title}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          6. SEÇÃO "MELHORES OFERTAS PARA VOCÊ!"
          ==================================================================== */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">

          {/* Header da Vitrine com Filtro Dinâmico */}
          <div id="catalog-section" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: '#E30613', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {activeCategory && activeCategory !== 'all' ? 'Departamento Selecionado' : 'Aproveite as'}
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px', margin: '0.2rem 0' }}>
                {activeCategory === 'Medicamentos' && 'Medicamentos e Saúde'}
                {activeCategory === 'Skincare' && 'Dermo e Beleza'}
                {activeCategory === 'Baby' && 'Mamães e Bebês'}
                {activeCategory === 'Higiene' && 'Higiene Pessoal'}
                {activeCategory === 'Suplementos' && 'Vida Saudável & Suplementos'}
                {activeCategory === 'conveniencia' && 'Conveniência & Snacks'}
                {activeCategory === 'servicos' && 'Serviços de Saúde & FarmaViva Clinic'}
                {activeCategory === 'exclusivas' && 'Marcas Exclusivas FarmaViva'}
                {(!activeCategory || activeCategory === 'all' || activeCategory === 'ofertas') && 'Melhores Ofertas para Você!'}
              </h2>
              <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                {((!activeCategory || activeCategory === 'all')
                  ? CATALOG
                  : activeCategory === 'ofertas'
                    ? CATALOG.filter(p => p.discountBadge || p.offerTag)
                    : CATALOG.filter(p => p.category?.toLowerCase() === activeCategory?.toLowerCase() || p.type?.toLowerCase() === activeCategory?.toLowerCase())
                ).length} produtos com pronta entrega e retirada em 1h
              </span>
            </div>

            {activeCategory && activeCategory !== 'all' && (
              <button
                onClick={() => onSelectCategory('all')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#EFF6FF',
                  color: '#001FD8',
                  border: '1px solid #BFDBFE',
                  padding: '0.5rem 1.15rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <span>✕ Ver Todas as Ofertas / Limpar Filtro</span>
              </button>
            )}
          </div>

          {/* Grid Oficial de Produtos FarmaViva */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.15rem'
          }}>
            {((!activeCategory || activeCategory === 'all')
              ? CATALOG.slice(0, 15)
              : activeCategory === 'ofertas'
                ? CATALOG.filter(p => p.discountBadge || p.offerTag)
                : CATALOG.filter(p => p.category?.toLowerCase() === activeCategory?.toLowerCase() || p.type?.toLowerCase() === activeCategory?.toLowerCase())
            ).map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                {/* Badge de Oferta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{
                    backgroundColor: '#FDE8EA',
                    color: '#E30613',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px'
                  }}>
                    {prod.discountBadge || 'Super oferta'}
                  </span>
                  <Heart size={16} color="#CBD5E1" style={{ cursor: 'pointer' }} />
                </div>

                {/* Imagem do Produto */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem 0' }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      height: '130px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Dados do Produto */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase' }}>
                    {prod.brand}
                  </div>
                  <h4 style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#1E293B',
                    lineHeight: 1.35,
                    margin: '0.25rem 0 0.65rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.2rem'
                  }}>
                    {prod.name}
                  </h4>

                  {/* Preços */}
                  <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                      De R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#001FD8', lineHeight: 1.1 }}>
                      R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#008744', fontWeight: 800, marginTop: '0.15rem' }}>
                      ★ Clube Sempre Bem
                    </div>
                  </div>

                  {/* Botão Comprar */}
                  <button
                    type="button"
                    onClick={() => onAddToCart(prod)}
                    style={{
                      width: '100%',
                      backgroundColor: '#E30613',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.55rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      marginTop: '0.75rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(227, 6, 19, 0.25)'
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>Comprar</span>
                  </button>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          7. CHATBOT FLUTUANTE DINÂMICO (BOTTOM-RIGHT FAB)
          ==================================================================== */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.65rem'
      }}>
        {/* Balão de Fala Dinâmico Interativo */}
        {isFabBubbleOpen && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #001FD8',
            borderRadius: '16px 16px 4px 16px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 24px rgba(0, 31, 216, 0.2)',
            maxWidth: '280px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onOpenAiWithPrompt('Preciso de ajuda farmacêutica')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 800, color: '#001FD8', marginBottom: '0.2rem' }}>
                <Sparkles size={11} color="#001FD8" />
                <span>Dra. IA Pague Menos</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.35, margin: 0 }}>
                "{bubbleMessages[currentBubbleTextIndex]}"
              </p>
              <span style={{ fontSize: '0.7rem', color: '#001FD8', fontWeight: 800, marginTop: '0.35rem', display: 'inline-block' }}>
                Clique para conversar →
              </span>
            </div>
            <button
              onClick={() => setIsFabBubbleOpen(false)}
              style={{ color: '#94A3B8', padding: '0.1rem', cursor: 'pointer', border: 'none', background: 'transparent' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Botão Redondo Flutuante da Farmacêutica IA */}
        <button
          onClick={() => onOpenAiWithPrompt('Preciso de atendimento e recomendações de farmácia')}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#001FD8',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(0, 31, 216, 0.45)',
            border: '3px solid #FFFFFF',
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Abrir Farmacêutica IA Pague Menos"
        >
          <Sparkles size={26} color="#FDE047" />

          {/* Ponto Verde Pulsante de Status Online */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2px solid #FFFFFF'
          }} />
        </button>
      </div>

    </div>
  );
}

export default DesktopHomePage;
