import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { CATALOG } from '../data/catalog';

export function DesktopHomePage({
  onSelectCategory,
  activeCategory,
  onAddToCart,
  onOpenAiWithPrompt,
  onOpenCart,
  aiRecommendation
}) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiBudget, setAiBudget] = useState('');
  const [preferGenerics, setPreferGenerics] = useState(false);
  const [currentBubbleTextIndex, setCurrentBubbleTextIndex] = useState(0);
  const [isFabBubbleOpen, setIsFabBubbleOpen] = useState(true);

  // Mensagens rotativas dinâmicas do chatbot flutuante
  const bubbleMessages = [
    "Olá! Posso te ajudar a montar sua cesta ou encontrar genéricos?",
    "Precisa de protetor para a praia ou alívio de gripe e dor?",
    "Economize até 95% trocando por genéricos aprovados pela ANVISA!",
    "Envie sua dúvida ou receita médica para nossa Farmacêutica IA."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBubbleTextIndex((prev) => (prev + 1) % bubbleMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Envio da busca da IA
  const handleAiSubmit = (e) => {
    e.preventDefault();
    const prompt = aiPrompt.trim() || 'Produtos essenciais de saúde e bem-estar';
    const budget = aiBudget.trim() ? parseFloat(aiBudget) : null;
    onOpenAiWithPrompt(prompt, budget, preferGenerics);
  };

  // Ofertas em Destaque (5 Cards com degradê FarmaViva)
  const promoCards = [
    {
      id: 'promo-1',
      brand: 'Saúde FarmaViva',
      title: "SHAMPOO INFANTIL JOHNSON'S BABY",
      highlight: '20% DE DESCONTO',
      gradient: 'linear-gradient(135deg, #0A196F 0%, #001242 100%)',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
      tagColor: '#E30613',
      actionPrompt: "Shampoo infantil Johnson's Baby com desconto"
    },
    {
      id: 'promo-2',
      brand: 'Risqué',
      title: 'ESMALTE RISQUÉ DIAMOND GEL',
      highlight: 'LEVE 3 PAGUE 2',
      gradient: 'linear-gradient(135deg, #001FD8 0%, #1E0099 100%)',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=300&q=80',
      tagColor: '#0022D6',
      actionPrompt: 'Esmaltes Risqué Diamond Gel'
    },
    {
      id: 'promo-3',
      brand: 'Cetaphil',
      title: 'LOÇÃO HIDRATANTE CETAPHIL',
      highlight: '20% NA 2ª UNIDADE',
      gradient: 'linear-gradient(135deg, #1A0066 0%, #3B0086 100%)',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80',
      tagColor: '#6B21A8',
      actionPrompt: 'Hidratante Cetaphil loção e creme'
    },
    {
      id: 'promo-4',
      brand: 'Colgate',
      title: 'ANTISSÉPTICO COLGATE',
      highlight: 'DE: R$ 18,99 POR R$ 8,99 CADA',
      gradient: 'linear-gradient(135deg, #001489 0%, #0052CC 100%)',
      image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=300&q=80',
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
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
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
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&q=80',
      bgColor: '#F59E0B'
    },
    {
      id: 'emagrecedores',
      title: 'Emagrecedores',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    },
    {
      id: 'Skincare',
      title: 'Skincare',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    },
    {
      id: 'Medicamentos',
      title: 'Azia e Gastrite',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=320&q=80',
      bgColor: '#FFFFFF'
    },
    {
      id: 'Suplementos',
      title: 'Whey Protein',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=320&q=80',
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
          1. BARRA DINÂMICA DA FARMACÊUTICA IA (MODERNA, INTERATIVA E ELEGANTE)
          ==================================================================== */}
      <section style={{
        background: 'linear-gradient(135deg, #001FD8 0%, #001489 100%)',
        color: '#FFFFFF',
        padding: '1.25rem 0',
        borderBottom: '3px solid #E30613',
        boxShadow: '0 4px 18px rgba(0, 31, 216, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow decorativo */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '5%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(227, 6, 19, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

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

          {/* Campo de Busca Inteligente / Chat Dinâmico */}
          <form onSubmit={handleAiSubmit} style={{ marginTop: '0.9rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{
              flex: '1',
              minWidth: '280px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '0.35rem 1rem',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
            }}>
              <MessageSquare size={17} color="#001FD8" style={{ marginRight: '0.65rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Ex: 'vou à praia e quero protetor e hidratação', 'remédio para dor de cabeça'..."
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
              <span>Montar Cesta com IA</span>
              <ArrowRight size={16} />
            </button>
          </form>

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
          4. BANNER PRINCIPAL PISCOU PERDEU (EXATO COMO NO PRINT 1)
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
                  src="https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=150&q=80"
                  alt="Escova"
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
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80"
                  alt="Clinical"
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
          5. NAVEGUE POR CATEGORIA (CARROSSEL EXATO COMO NO PRINT 2)
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

                {/* Botão Azul com o Nome da Categoria (Exato como no Print) */}
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
          6. SEÇÃO "MELHORES OFERTAS PARA VOCÊ!" (EXATO COMO NO PRINT 2)
          ==================================================================== */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ color: '#E30613', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Aproveite as
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px', margin: 0 }}>
              Melhores Ofertas para Você!
            </h2>
          </div>

          {/* Grid Oficial de Produtos Pague Menos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.15rem'
          }}>
            {CATALOG.slice(0, 10).map((prod) => (
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
