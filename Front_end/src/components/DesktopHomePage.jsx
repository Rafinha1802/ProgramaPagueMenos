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

export function DesktopHomePage({
  onSelectCategory,
  activeCategory,
  onAddToCart,
  onOpenAiWithPrompt,
  onOpenCart,
  aiRecommendation,
  onOpenPrescriptionFlow,
  onShowToast,
  onOpenAuth,
  products = [],
  backendStatus = null,
  isAiLoading = false
}) {
  const currentCatalog = products && products.length > 0 ? products : [];
  const [currentBubbleTextIndex, setCurrentBubbleTextIndex] = useState(0);
  const [isFabBubbleOpen, setIsFabBubbleOpen] = useState(true);
  const [neutrogenaSlide, setNeutrogenaSlide] = useState(0);
  const bubbleMessages = [
    "Olá! Posso te ajudar a montar sua cesta ou encontrar genéricos?",
    "Precisa de protetor para a praia ou alívio de gripe e dor?",
    "Economize até 95% trocando por genéricos aprovados pela ANVISA!",
    "Envie sua dúvida ou receita médica para nossa Farmacêutica IA."
  ];

  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [categoryPage, setCategoryPage] = useState(0);

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

  // Carrossel de Categorias Oficiais Pague Menos (Design Fiel ao Print)
  const categoryPages = [
    [
      {
        id: 'ofertas',
        title: 'Ofertas',
        image: '/categories/cat_ofertas.jpg',
        bgColor: '#FFAE00',
        actionPrompt: 'Ver todas as ofertas da Pague Menos'
      },
      {
        id: 'emagrecedores',
        title: 'Emagrecedores',
        image: '/categories/cat_emagrecedores.jpg',
        bgColor: '#FFFFFF',
        actionPrompt: 'Canetas emagrecedoras e tratamentos para perda de peso'
      },
      {
        id: 'Skincare',
        title: 'Skincare',
        image: '/categories/cat_skincare.jpg',
        bgColor: '#FFFFFF',
        actionPrompt: 'Séruns, hidratantes e dermocosméticos para skincare'
      },
      {
        id: 'Medicamentos',
        title: 'Azia e Gastrite',
        image: '/categories/cat_azia_gastrite.jpg',
        bgColor: '#FFFFFF',
        actionPrompt: 'Medicamentos para azia, queimação, refluxo e gastrite'
      },
      {
        id: 'Suplementos',
        title: 'Whey Protein',
        image: '/categories/cat_whey_protein.jpg',
        bgColor: '#FFFFFF',
        actionPrompt: 'Whey protein concentrado e isolado, creatina e suplementos'
      },
      {
        id: 'Skincare',
        title: 'Protetor Solar Facial',
        image: '/categories/cat_protetor_solar.jpg',
        bgColor: '#FFFFFF',
        actionPrompt: 'Protetor solar facial toque seco com FPS alto'
      }
    ],
    [
      {
        id: 'Mamães & Bebês',
        title: 'Infantil & Bebê',
        image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=320&q=80',
        bgColor: '#FFFFFF',
        actionPrompt: 'Fórmulas infantis, fraldas e cuidados com o bebê'
      },
      {
        id: 'Vitaminas',
        title: 'Vitaminas & Cabelos',
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=320&q=80',
        bgColor: '#FFFFFF',
        actionPrompt: 'Polivitamínicos, Biotina e vitaminas para imunidade e cabelos'
      },
      {
        id: 'Higiene & Beleza',
        title: 'Higiene Diária',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=320&q=80',
        bgColor: '#FFFFFF',
        actionPrompt: 'Higiene bucal, sabonetes e desodorantes em promoção'
      },
      {
        id: 'Medicamentos',
        title: 'Gripes e Resfriados',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=320&q=80',
        bgColor: '#FFFFFF',
        actionPrompt: 'Antigripais, descongestionantes nasais e vitamina C efervescente'
      },
      {
        id: 'Medicamentos',
        title: 'Dor e Febre',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=320&q=80',
        bgColor: '#FFFFFF',
        actionPrompt: 'Analgésicos, Dipirona, Paracetamol e Ibuprofeno'
      },
      {
        id: 'Cuidados Diários',
        title: 'Primeiros Socorros',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=320&q=80',
        bgColor: '#FFFFFF',
        actionPrompt: 'Curativos, álcool 70, termômetros e gaze'
      }
    ]
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '4rem' }}>

      {/* ====================================================================
          1. NOTIFICAÇÕES & AÇÕES RÁPIDAS
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
          5. NAVEGUE POR CATEGORIA (Design Fiel ao Print Oficial Pague Menos)
          ==================================================================== */}
      <section style={{ padding: '2rem 0 1.25rem 0', backgroundColor: '#F8FAFC' }}>
        <div className="container">

          {/* Header da Seção: Navegue em Vermelho, Por Categoria em Cinza e Linha Divisória */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.65rem' }}>
            <div style={{
              color: '#E30613',
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
              lineHeight: 1.2,
              marginBottom: '2px'
            }}>
              Navegue
            </div>
            <h2 style={{
              fontSize: '1.55rem',
              fontWeight: 800,
              color: '#475569',
              letterSpacing: '-0.3px',
              margin: 0
            }}>
              Por Categoria
            </h2>
          </div>

          {/* Carrossel Relativo com Setas Flutuantes nas Pontas */}
          <div style={{ position: 'relative' }}>
            {/* Seta Esquerda Flutuante */}
            <button
              type="button"
              onClick={() => setCategoryPage((prev) => (prev === 0 ? categoryPages.length - 1 : prev - 1))}
              aria-label="Categoria anterior"
              style={{
                position: 'absolute',
                left: '-18px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                color: '#0052CC',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F7FF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={22} strokeWidth={2.4} />
            </button>

            {/* Seta Direita Flutuante */}
            <button
              type="button"
              onClick={() => setCategoryPage((prev) => (prev === categoryPages.length - 1 ? 0 : prev + 1))}
              aria-label="Próxima categoria"
              style={{
                position: 'absolute',
                right: '-18px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                color: '#0052CC',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F7FF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={22} strokeWidth={2.4} />
            </button>

            {/* Grid dos 6 Cards da Página Ativa */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.85rem'
            }}>
              {categoryPages[categoryPage].map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (cat.actionPrompt && typeof onOpenAiWithPrompt === 'function') {
                      onOpenAiWithPrompt(cat.actionPrompt);
                    } else if (typeof onSelectCategory === 'function') {
                      onSelectCategory(cat.id === 'ofertas' ? 'all' : cat.id);
                    }
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 82, 204, 0.12)';
                    e.currentTarget.style.borderColor = '#BFDBFE';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  {/* Container da Imagem */}
                  <div style={{
                    height: '142px',
                    backgroundColor: cat.bgColor || '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: cat.bgColor && cat.bgColor !== '#FFFFFF' ? '0' : '0.65rem',
                    position: 'relative'
                  }}>
                    <img
                      src={cat.image}
                      alt={cat.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: cat.bgColor && cat.bgColor !== '#FFFFFF' ? 'cover' : 'contain'
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Barra Azul Inferior com o Nome da Categoria */}
                  <div style={{
                    backgroundColor: '#0052CC',
                    color: '#FFFFFF',
                    padding: '0.68rem 0.5rem',
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    letterSpacing: '-0.2px',
                    borderRadius: '0 0 9px 9px',
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '44px'
                  }}>
                    {cat.title}
                  </div>
                </div>
              ))}
            </div>

            {/* Indicador de Paginação Inferior (Pill Ativo + Bolinha Inativa) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '1.25rem'
            }}>
              {categoryPages.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCategoryPage(dotIdx)}
                  aria-label={`Ir para página ${dotIdx + 1} de categorias`}
                  style={{
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    width: categoryPage === dotIdx ? '28px' : '6px',
                    height: '6px',
                    borderRadius: categoryPage === dotIdx ? '999px' : '50%',
                    backgroundColor: categoryPage === dotIdx ? '#0052CC' : '#CBD5E1',
                    transition: 'all 0.25s ease'
                  }}
                />
              ))}
            </div>
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
                {(currentCatalog.filter(p => (p.brand || '').toUpperCase().includes('NEUTROGENA')).length > 0
                  ? currentCatalog.filter(p => (p.brand || '').toUpperCase().includes('NEUTROGENA')).slice(0, 6)
                  : currentCatalog.slice(0, 6)
                ).map((prod, idx, arr) => (
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
                  ? currentCatalog
                  : activeCategory === 'ofertas'
                    ? currentCatalog.filter(p => p.discountBadge || p.offerTag)
                    : currentCatalog.filter(p => (p.category || '').toLowerCase().includes(activeCategory?.toLowerCase()) || (p.categoryLabel || '').toLowerCase().includes(activeCategory?.toLowerCase()))
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
              ? currentCatalog.slice(0, 20)
              : activeCategory === 'ofertas'
                ? currentCatalog.filter(p => p.discountBadge || p.offerTag).slice(0, 20)
                : currentCatalog.filter(p => (p.category || '').toLowerCase().includes(activeCategory?.toLowerCase()) || (p.categoryLabel || '').toLowerCase().includes(activeCategory?.toLowerCase())).slice(0, 20)
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
                    className="btn-add-product-cart"
                    data-testid="add-to-cart-btn"
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


    </div>
  );
}

export default DesktopHomePage;
