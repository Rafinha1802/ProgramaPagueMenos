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
  Bell,
  Zap,
  Flame,
  Check
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
  const [neutrogenaSlide, setNeutrogenaSlide] = useState(0);
  const [isPiscouPerdeuModalOpen, setIsPiscouPerdeuModalOpen] = useState(false);
  const [piscouCountdown, setPiscouCountdown] = useState(3284); // ~54 min
  const [piscouCategory, setPiscouCategory] = useState('all');
  const [addedFlashId, setAddedFlashId] = useState(null);

  // Timer regressivo das Ofertas Relâmpago Piscou Perdeu (renova a cada 1 hora)
  useEffect(() => {
    const flashTimer = setInterval(() => {
      setPiscouCountdown((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(flashTimer);
  }, []);

  const formatCountdown = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };
  const { h: flashH, m: flashM, s: flashS } = formatCountdown(piscouCountdown);

  const PISCOU_PERDEU_ITEMS = [
    {
      id: 'piscou-dorflex',
      catalogId: 'prod-1',
      name: 'Dorflex Analgésico e Relaxante Muscular 36 Comprimidos',
      shortName: 'Dorflex 36 Comprimidos',
      brand: 'SANOFI',
      category: 'medicamentos',
      categoryLabel: 'Medicamentos',
      originalPrice: 27.99,
      flashPrice: 6.49,
      discountPct: 77,
      image: '/products/dorflex.jpg',
      soldPercent: 91,
      stockLeft: 4,
      badge: '⚡ Top 1 Mais Vendido'
    },
    {
      id: 'piscou-secret',
      catalogId: 'pm-secret-clinical',
      name: 'Gel Desodorante Antitranspirante Clinical Strength Secret 45g',
      shortName: 'Desodorante Clinical Secret 45g',
      brand: 'SECRET',
      category: 'higiene',
      categoryLabel: 'Higiene & Cuidados',
      originalPrice: 59.90,
      flashPrice: 14.99,
      discountPct: 75,
      image: '/products/secret-clinical.jpg',
      soldPercent: 95,
      stockLeft: 3,
      badge: '🔥 75% OFF'
    },
    {
      id: 'piscou-neosaldina',
      catalogId: 'prod-2',
      name: 'Neosaldina Alívio de Dores de Cabeça e Enxaqueca 30 Drágeas',
      shortName: 'Neosaldina 30 Drágeas',
      brand: 'COSMED',
      category: 'medicamentos',
      categoryLabel: 'Medicamentos',
      originalPrice: 38.90,
      flashPrice: 9.90,
      discountPct: 74,
      image: '/products/neosaldina.jpg',
      soldPercent: 84,
      stockLeft: 7,
      badge: '⚡ Destaque Dor'
    },
    {
      id: 'piscou-vitamina-c',
      catalogId: 'pm-vitamina-c',
      name: 'Vitamina C 1g + Zinco 10mg Efervescente 30 Comprimidos - Pague Menos',
      shortName: 'Vitamina C + Zinco Pague Menos',
      brand: 'PAGUE MENOS CARE',
      category: 'suplementos',
      categoryLabel: 'Suplementos',
      originalPrice: 49.90,
      flashPrice: 16.90,
      discountPct: 66,
      image: '/products/vitamina-c-pm.jpg',
      soldPercent: 78,
      stockLeft: 9,
      badge: '💊 Imunidade'
    },
    {
      id: 'piscou-dipirona',
      catalogId: 'prod-4',
      name: 'Dipirona Monoidratada Gotas 500mg/ml 20ml - EMS Genérico',
      shortName: 'Dipirona Gotas 20ml EMS',
      brand: 'EMS GENÉRICO',
      category: 'medicamentos',
      categoryLabel: 'Medicamentos',
      originalPrice: 16.50,
      flashPrice: 3.99,
      discountPct: 76,
      image: '/products/dipirona-ems.jpg',
      soldPercent: 93,
      stockLeft: 5,
      badge: '⭐ Genérico ANVISA'
    },
    {
      id: 'piscou-cerave',
      catalogId: 'prod-3',
      name: 'Loção Facial CeraVe com Ceramidas e Ácido Hialurônico 52ml',
      shortName: 'CeraVe Facial 52ml',
      brand: 'CERAVE',
      category: 'dermo',
      categoryLabel: 'Dermocosméticos',
      originalPrice: 89.90,
      flashPrice: 39.90,
      discountPct: 56,
      image: '/products/cerave.jpg',
      soldPercent: 87,
      stockLeft: 6,
      badge: '✨ Dermo Favorito'
    },
    {
      id: 'piscou-nivea-men',
      catalogId: 'pm-nivea-men',
      name: 'Desodorante Antitranspirante Aerosol Nivea Men Deep Black Carbon 150ml',
      shortName: 'Nivea Men Deep 150ml',
      brand: 'NIVEA',
      category: 'higiene',
      categoryLabel: 'Higiene & Cuidados',
      originalPrice: 24.90,
      flashPrice: 8.90,
      discountPct: 64,
      image: '/products/nivea-men.jpg',
      soldPercent: 81,
      stockLeft: 8,
      badge: '🛡️ Proteção 48h'
    },
    {
      id: 'piscou-neutrogena',
      catalogId: 'pm-neutrogena-facial-matte',
      name: 'Protetor Solar Facial Neutrogena Sun Fresh Pele Mista a Oleosa FPS 70',
      shortName: 'Neutrogena Sun Fresh FPS 70',
      brand: 'NEUTROGENA',
      category: 'dermo',
      categoryLabel: 'Dermocosméticos',
      originalPrice: 89.90,
      flashPrice: 49.90,
      discountPct: 45,
      image: '/products/neutrogena-sunfresh-facial.png',
      soldPercent: 96,
      stockLeft: 2,
      badge: '☀️ Alta Demanda'
    }
  ];

  const handleAddPiscouToCart = (item, e) => {
    if (e) e.stopPropagation();
    const catalogItem = CATALOG.find((c) => c.id === item.catalogId) || {
      id: item.catalogId || item.id,
      name: item.name,
      brand: item.brand,
      price: item.flashPrice,
      clubPrice: item.flashPrice,
      originalPrice: item.originalPrice,
      image: item.image,
      installments: `1x de R$ ${item.flashPrice.toFixed(2).replace('.', ',')}`,
      discountBadge: `↓ ${item.discountPct}%`,
      badge: 'Oferta Piscou Perdeu'
    };

    onAddToCart({
      ...catalogItem,
      price: item.flashPrice,
      clubPrice: item.flashPrice,
      isPiscouPerdeu: true
    });

    setAddedFlashId(item.id);
    setTimeout(() => setAddedFlashId(null), 1800);

    if (onShowToast) {
      onShowToast(`⚡ ${item.shortName} adicionado à sacola por R$ ${item.flashPrice.toFixed(2).replace('.', ',')}!`);
    }
  };

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

  // Ofertas em Destaque (5 Cards com degradê Pague Menos)
  const promoCards = [
    {
      id: 'promo-1',
      brand: 'Saúde Pague Menos',
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
      title: 'GENÉRICOS PAGUE MENOS',
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
          1.1 NOTIFICAÇÕES & AÇÕES RÁPIDAS
          ==================================================================== */}
      <section style={{ padding: '1.25rem 0 0.5rem 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
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
          1.2 BANNERS DE PROPAGANDA OFICIAIS PAGUE MENOS
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
                {/* Banner 1: ALIMENTO INFANTIL COM ATÉ 60% OFF NA 2ª UNIDADE */}
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

                {/* Banner 2: FESTIVAL DERMO & BELEZA */}
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
          2. CARROSSEL DE CARDS PROMOCIONAIS COM DEGRADÊ
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
                    <span style={{ color: '#E30613', fontWeight: 900 }}>+</span> Pague Menos
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
            background: 'radial-gradient(circle at 85% 20%, rgba(253, 224, 71, 0.22) 0%, transparent 45%), radial-gradient(circle at 10% 80%, rgba(0, 110, 255, 0.28) 0%, transparent 50%), linear-gradient(105deg, #00128B 0%, #001FD8 40%, #04092E 100%)',
            borderRadius: '24px',
            padding: '2rem 2.25rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0, 31, 216, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
            gap: '1.75rem',
            flexWrap: 'wrap'
          }}>
            {/* Marca d'água sutil de raio no fundo */}
            <div style={{
              position: 'absolute',
              right: '340px',
              top: '-30px',
              opacity: 0.05,
              pointerEvents: 'none',
              transform: 'rotate(15deg)'
            }}>
              <Zap size={280} color="#FFFFFF" fill="#FFFFFF" />
            </div>

            {/* Esquerda: Logo Piscou Perdeu com Despertador e Contador Regressivo */}
            <div style={{ zIndex: 2, flex: '1 1 360px', maxWidth: '440px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                <div style={{
                  backgroundColor: '#E30613',
                  color: '#FFFFFF',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '999px',
                  fontWeight: 900,
                  fontSize: '0.76rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 0 16px rgba(227, 6, 19, 0.65)'
                }}>
                  <Zap size={14} fill="#FDE047" color="#FDE047" />
                  <span>OFERTAS RELÂMPAGO</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                    boxShadow: '0 0 8px #22C55E',
                    display: 'inline-block'
                  }} />
                  <span style={{ fontSize: '0.8rem', color: '#93C5FD', fontWeight: 700 }}>
                    Atualizadas a cada 1 hora
                  </span>
                </div>
              </div>

              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-1.5px', margin: 0 }}>
                PISCOU<br />
                <span style={{
                  color: '#FDE047',
                  textShadow: '0 0 25px rgba(253, 224, 71, 0.5)'
                }}>
                  PERDEU
                </span>
              </h2>

              {/* Temporizador Regressivo Visual */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600 }}>
                  Termina em:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(253, 224, 71, 0.4)',
                    borderRadius: '8px',
                    padding: '0.25rem 0.55rem',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    color: '#FDE047',
                    fontFamily: 'monospace'
                  }}>
                    {flashH}h
                  </div>
                  <span style={{ color: '#FDE047', fontWeight: 900 }}>:</span>
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(253, 224, 71, 0.4)',
                    borderRadius: '8px',
                    padding: '0.25rem 0.55rem',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    color: '#FDE047',
                    fontFamily: 'monospace'
                  }}>
                    {flashM}m
                  </div>
                  <span style={{ color: '#FDE047', fontWeight: 900 }}>:</span>
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    border: '1px solid rgba(253, 224, 71, 0.4)',
                    borderRadius: '8px',
                    padding: '0.25rem 0.55rem',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    color: '#FDE047',
                    fontFamily: 'monospace'
                  }}>
                    {flashS}s
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginTop: '0.55rem', maxWidth: '380px', lineHeight: 1.35 }}>
                Preços especiais válidos apenas hoje com retirada em até 1h na sua loja mais próxima.
              </p>

              {/* Botão de Ação que abre o Modal de Ofertas */}
              <button
                type="button"
                onClick={() => setIsPiscouPerdeuModalOpen(true)}
                style={{
                  marginTop: '0.9rem',
                  backgroundColor: '#FDE047',
                  color: '#00128B',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  padding: '0.6rem 1.15rem',
                  borderRadius: '999px',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(253, 224, 71, 0.45)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.backgroundColor = '#FEF08A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#FDE047';
                }}
              >
                <Flame size={16} fill="#00128B" />
                <span>Ver todas as 8 ofertas relâmpago</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Centro / Direita: Produtos do Piscou Perdeu com packshots limpos e ação rápida */}
            <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.9rem', zIndex: 2, flexWrap: 'wrap' }}>
              {PISCOU_PERDEU_ITEMS.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setIsPiscouPerdeuModalOpen(true)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '18px',
                    padding: '0.85rem 0.95rem',
                    width: '182px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
                    e.currentTarget.style.borderColor = 'rgba(253, 224, 71, 0.6)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  {/* Badge de Desconto */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#E30613',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.68rem',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(227, 6, 19, 0.5)'
                  }}>
                    -{item.discountPct}%
                  </div>

                  {/* Foto Limpa do Packshot em Base Branca */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '0.35rem',
                    height: '84px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.55rem',
                    marginTop: '0.3rem'
                  }}>
                    <img
                      src={item.image}
                      alt={item.shortName}
                      style={{
                        maxHeight: '76px',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Detalhes */}
                  <div>
                    <div style={{
                      fontSize: '0.66rem',
                      color: '#93C5FD',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      {item.brand}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                      marginBottom: '0.35rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }} title={item.name}>
                      {item.shortName}
                    </div>

                    {/* Preços */}
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#CBD5E1', textDecoration: 'line-through' }}>
                        DE: R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                      </div>
                      <div style={{ fontSize: '1.22rem', fontWeight: 900, color: '#FDE047', lineHeight: 1.1 }}>
                        POR R$ {item.flashPrice.toFixed(2).replace('.', ',')}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#FFFFFF', fontWeight: 700 }}>
                        CADA
                      </div>
                    </div>

                    {/* Barra de urgência de estoque */}
                    <div style={{ marginTop: '0.45rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#FDE047', fontWeight: 700, marginBottom: '0.2rem' }}>
                        <span>Restam {item.stockLeft} un</span>
                        <span>{item.soldPercent}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.soldPercent}%`, height: '100%', backgroundColor: '#FDE047', borderRadius: '999px' }} />
                      </div>
                    </div>
                  </div>

                  {/* Botão de Adicionar à Sacola */}
                  <button
                    type="button"
                    onClick={(e) => handleAddPiscouToCart(item, e)}
                    style={{
                      width: '100%',
                      backgroundColor: addedFlashId === item.id ? '#22C55E' : '#001FD8',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.5rem',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                    onMouseEnter={(e) => {
                      if (addedFlashId !== item.id) e.currentTarget.style.backgroundColor = '#001489';
                    }}
                    onMouseLeave={(e) => {
                      if (addedFlashId !== item.id) e.currentTarget.style.backgroundColor = '#001FD8';
                    }}
                  >
                    {addedFlashId === item.id ? (
                      <>
                        <Check size={13} />
                        <span>Adicionado!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} />
                        <span>+ Sacola</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
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
          5.1 VITRINE ESPECIAL NEUTROGENA SUN FRESH (COMO NO PRINT OFICIAL)
          ==================================================================== */}
      <section style={{ padding: '0.5rem 0 1.5rem 0' }}>
        <div className="container">
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '1.75rem 1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            {/* Header da Vitrine */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '6px',
                  height: '28px',
                  backgroundColor: '#004CB7',
                  borderRadius: '4px'
                }} />
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px', margin: 0 }}>
                    Especial Neutrogena Sun Fresh
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
                    Proteção solar com toque seco, efeito matte e rápida absorção
                  </p>
                </div>
              </div>

              <span style={{
                backgroundColor: '#EFF6FF',
                color: '#004CB7',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid #BFDBFE'
              }}>
                Linha Completa Facial & Corporal
              </span>
            </div>

            {/* Carrossel de Produtos */}
            <div style={{ position: 'relative' }}>
              {/* Botão Esquerda */}
              <button
                type="button"
                onClick={() => setNeutrogenaSlide(0)}
                style={{
                  position: 'absolute',
                  left: '-16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#004CB7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                  zIndex: 10,
                  transition: 'all 0.15s ease',
                  opacity: neutrogenaSlide === 0 ? 0.5 : 1
                }}
                disabled={neutrogenaSlide === 0}
                title="Voltar produtos"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>

              {/* Botão Direita */}
              <button
                type="button"
                onClick={() => setNeutrogenaSlide(1)}
                style={{
                  position: 'absolute',
                  right: '-16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#004CB7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                  zIndex: 10,
                  transition: 'all 0.15s ease',
                  opacity: neutrogenaSlide === 1 ? 0.5 : 1
                }}
                disabled={neutrogenaSlide === 1}
                title="Avançar produtos"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>

              {/* Grid dos Cards com Divisórias Verticais */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                border: '1px solid #F1F5F9',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {CATALOG.filter(p => p.brand === 'NEUTROGENA').map((prod, idx, arr) => (
                  <div
                    key={prod.id}
                    style={{
                      padding: '1.25rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFFFF',
                      borderRight: idx < arr.length - 1 ? '1px solid #F1F5F9' : 'none',
                      transition: 'background-color 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    {/* Imagem do Produto em Fundo Branco */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '145px',
                      marginBottom: '0.85rem'
                    }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          maxHeight: '135px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </div>

                    {/* Título do Produto */}
                    <h4 style={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#1E293B',
                      lineHeight: 1.35,
                      margin: '0 0 0.85rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.3rem'
                    }} title={prod.name}>
                      {prod.name}
                    </h4>

                    {/* Linha Marca + Botão Circular de Adicionar à Cesta */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        color: '#0F172A',
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase'
                      }}>
                        {prod.brand}
                      </span>

                      <button
                        type="button"
                        onClick={() => onAddToCart(prod)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: '#004CB7',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 3px 8px rgba(0, 76, 183, 0.35)',
                          transition: 'transform 0.15s ease, background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.08)';
                          e.currentTarget.style.backgroundColor = '#003A8C';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.backgroundColor = '#004CB7';
                        }}
                        title={`Adicionar ${prod.name} à cesta`}
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>

                    {/* Preço em Destaque Azul & Parcelamento */}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{
                        fontSize: '1.38rem',
                        fontWeight: 900,
                        color: '#004CB7',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.1
                      }}>
                        R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                      </div>
                      <div style={{
                        fontSize: '0.74rem',
                        color: '#64748B',
                        marginTop: '0.2rem',
                        fontWeight: 500
                      }}>
                        {prod.installments || '3x sem juros'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores do Slider (Pílula Azul + Ponto Cinza) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '1.25rem' }}>
                <span
                  onClick={() => setNeutrogenaSlide(0)}
                  style={{
                    width: neutrogenaSlide === 0 ? '24px' : '6px',
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: neutrogenaSlide === 0 ? '#004CB7' : '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
                <span
                  onClick={() => setNeutrogenaSlide(1)}
                  style={{
                    width: neutrogenaSlide === 1 ? '24px' : '6px',
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: neutrogenaSlide === 1 ? '#004CB7' : '#CBD5E1',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

            </div>
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
                {activeCategory === 'servicos' && 'Serviços de Saúde & Clinic Farma Pague Menos'}
                {activeCategory === 'exclusivas' && 'Marcas Exclusivas Pague Menos'}
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

          {/* Grid Oficial de Produtos Pague Menos */}
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
                  padding: '1.15rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  position: 'relative',
                  transition: 'box-shadow 0.15s ease, transform 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Badge de Oferta e Coração */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{
                    backgroundColor: '#FDE8EA',
                    color: '#E30613',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    {prod.discountBadge || 'Super oferta'}
                  </span>
                  <Heart size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
                </div>

                {/* Imagem do Produto em Fundo Branco Puro */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', margin: '0.35rem 0 0.85rem 0' }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      maxHeight: '135px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Título do Produto */}
                <h4 style={{
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#1E293B',
                  lineHeight: 1.35,
                  margin: '0 0 0.75rem 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '2.3rem'
                }} title={prod.name}>
                  {prod.name}
                </h4>

                {/* Linha: Marca + Botão Circular de Adicionar à Cesta */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.65rem'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 900, fontStyle: 'italic', color: '#0F172A', textTransform: 'uppercase' }}>
                    {prod.brand}
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddToCart(prod)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#004CB7',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0, 76, 183, 0.35)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Adicionar à cesta"
                  >
                    <ShoppingBag size={17} />
                  </button>
                </div>

                {/* Preços e Parcelamento */}
                <div style={{ marginTop: 'auto', paddingTop: '0.4rem', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                    De R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ fontSize: '1.32rem', fontWeight: 900, color: '#004CB7', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                    R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                    {prod.installments || '1x sem juros'}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ====================================================================
          MODAL INTERATIVO: PISCOU PERDEU (OFERTAS RELÂMPAGO)
          ==================================================================== */}
      {isPiscouPerdeuModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 13, 35, 0.82)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
          onClick={() => setIsPiscouPerdeuModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '1060px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
              overflow: 'hidden',
              border: '1px solid #E2E8F0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com Gradiente Piscou Perdeu */}
            <div style={{
              background: 'radial-gradient(circle at 85% 20%, rgba(253, 224, 71, 0.25) 0%, transparent 45%), linear-gradient(105deg, #00128B 0%, #001FD8 50%, #000B42 100%)',
              color: '#FFFFFF',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span style={{
                    backgroundColor: '#E30613',
                    color: '#FFFFFF',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    letterSpacing: '0.5px'
                  }}>
                    <Zap size={13} fill="#FDE047" color="#FDE047" />
                    OFERTAS RELÂMPAGO
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#93C5FD', fontWeight: 700 }}>
                    Atualizadas de hora em hora
                  </span>
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                  PISCOU <span style={{ color: '#FDE047' }}>PERDEU</span>
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#E2E8F0', margin: '0.35rem 0 0 0' }}>
                  Preços promocionais válidos enquanto durar o estoque com retirada em 1h.
                </p>
              </div>

              {/* Lado Direito: Temporizador & Botão Fechar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(253, 224, 71, 0.45)',
                  borderRadius: '14px',
                  padding: '0.6rem 1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.68rem', color: '#CBD5E1', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    Renovação em
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1.25rem', fontWeight: 900, color: '#FDE047', fontFamily: 'monospace' }}>
                    <span>{flashH}h</span>
                    <span>:</span>
                    <span>{flashM}m</span>
                    <span>:</span>
                    <span>{flashS}s</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPiscouPerdeuModalOpen(false)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Fechar modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filtros de Categoria dentro do Modal */}
            <div style={{
              padding: '0.85rem 1.75rem',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'center',
              overflowX: 'auto'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', marginRight: '0.3rem', textTransform: 'uppercase' }}>
                Filtrar:
              </span>
              {[
                { id: 'all', label: 'Todas as Ofertas (8)' },
                { id: 'medicamentos', label: 'Medicamentos (3)' },
                { id: 'higiene', label: 'Higiene & Cuidados (2)' },
                { id: 'dermo', label: 'Dermocosméticos (2)' },
                { id: 'suplementos', label: 'Suplementos (1)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPiscouCategory(cat.id)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: piscouCategory === cat.id ? '1px solid #001FD8' : '1px solid #CBD5E1',
                    backgroundColor: piscouCategory === cat.id ? '#001FD8' : '#FFFFFF',
                    color: piscouCategory === cat.id ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid com Todos os Produtos Relâmpago */}
            <div style={{
              padding: '1.5rem 1.75rem',
              overflowY: 'auto',
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))',
              gap: '1.25rem',
              backgroundColor: '#FFFFFF'
            }}>
              {PISCOU_PERDEU_ITEMS
                .filter((p) => piscouCategory === 'all' || p.category === piscouCategory)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#001FD8';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 31, 216, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Badge de Desconto & Demanda */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span style={{
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        fontWeight: 900,
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        -{item.discountPct}% OFF
                      </span>

                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Foto Limpa do Packshot */}
                    <div style={{
                      height: '110px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem'
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          maxHeight: '105px',
                          maxWidth: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>

                    {/* Informações */}
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {item.brand}
                      </div>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', minHeight: '2.4rem', lineHeight: 1.3, margin: '0.2rem 0 0.5rem 0' }}>
                        {item.name}
                      </h4>

                      {/* Barra de Estoque Urgente */}
                      <div style={{ marginBottom: '0.65rem', backgroundColor: '#F8FAFC', padding: '0.4rem 0.55rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', fontWeight: 800, color: '#DC2626', marginBottom: '0.25rem' }}>
                          <span>Restam apenas {item.stockLeft} un</span>
                          <span>{item.soldPercent}% vendido</span>
                        </div>
                        <div style={{ width: '100%', height: '5px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${item.soldPercent}%`, height: '100%', backgroundColor: '#DC2626', borderRadius: '999px' }} />
                        </div>
                      </div>

                      {/* Preços */}
                      <div style={{ marginBottom: '0.85rem' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                          De R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                          <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#001FD8' }}>
                            R$ {item.flashPrice.toFixed(2).replace('.', ',')}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>
                            cada
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botão de Adicionar à Sacola */}
                    <button
                      type="button"
                      onClick={(e) => handleAddPiscouToCart(item, e)}
                      style={{
                        width: '100%',
                        backgroundColor: addedFlashId === item.id ? '#16A34A' : '#001FD8',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.65rem 0.75rem',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 4px 12px rgba(0, 31, 216, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        if (addedFlashId !== item.id) e.currentTarget.style.backgroundColor = '#00159E';
                      }}
                      onMouseLeave={(e) => {
                        if (addedFlashId !== item.id) e.currentTarget.style.backgroundColor = '#001FD8';
                      }}
                    >
                      {addedFlashId === item.id ? (
                        <>
                          <Check size={16} />
                          <span>Adicionado!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Adicionar à Sacola</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
            </div>

            {/* Footer do Modal */}
            <div style={{
              padding: '1rem 2rem',
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.82rem' }}>
                <Truck size={18} color="#001FD8" />
                <span>
                  <strong>Retire Grátis em até 1h</strong> na sua loja Pague Menos mais próxima ou receba via Entrega Expressa.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsPiscouPerdeuModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Continuar Comprando
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPiscouPerdeuModalOpen(false);
                    onOpenCart();
                  }}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#001FD8',
                    color: '#FFFFFF',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 12px rgba(0, 31, 216, 0.3)'
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>Ver Minha Sacola</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default DesktopHomePage;
