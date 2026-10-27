import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  Trash2,
  Repeat,
  DollarSign,
  AlertTriangle,
  Plus,
  ArrowRight,
  Send,
  MessageSquare,
  X
} from 'lucide-react';

export function AiGuidedExperience({
  recommendation,
  onUpdateEngine,
  onAddToCart,
  onAddBatchToCart,
  onCloseExperience,
  products = []
}) {
  const catalogList = products && products.length > 0 ? products : [];
  const [alternativeSelectorId, setAlternativeSelectorId] = useState(null);
  const [customAddedMessage, setCustomAddedMessage] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [chatFeedback, setChatFeedback] = useState(null);

  if (!recommendation) return null;

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
  } = recommendation;

  // Troca individual de produto por substituto
  const handleSwapProduct = (currentProdId, replacementProdId) => {
    const newItems = recommendedItems.map((item) =>
      item.id === currentProdId ? (catalogList.find((p) => String(p.id) === String(replacementProdId)) || item) : item
    ).filter(Boolean);

    onUpdateEngine({
      customSelectedIds: newItems.map((i) => i.id)
    });
    setAlternativeSelectorId(null);
  };

  // Remover item individual do kit
  const handleRemoveProduct = (prodId) => {
    const newItems = recommendedItems.filter((i) => i.id !== prodId);
    onUpdateEngine({
      customSelectedIds: newItems.map((i) => i.id)
    });
  };

  // Adicionar todo o kit ao carrinho com abertura direta da sacola
  const handleAddAll = () => {
    onAddBatchToCart(recommendedItems, true);
    setCustomAddedMessage('Kit adicionado com sucesso ao seu carrinho!');
    setTimeout(() => setCustomAddedMessage(null), 3500);
  };

  // Envio direto pelo chat para ajustar situação, o que quer ou valor total
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      onUpdateEngine({ prompt: customInput.trim(), customSelectedIds: null });
      setChatFeedback(`Ajuste aplicado: "${customInput.trim()}"`);
      setTimeout(() => setChatFeedback(null), 3500);
      setCustomInput('');
    }
  };

  // Envio por atalhos rápidos do chat
  const handlePillClick = (promptText) => {
    onUpdateEngine({ prompt: promptText, customSelectedIds: null });
    setChatFeedback(`Ajuste aplicado: "${promptText}"`);
    setTimeout(() => setChatFeedback(null), 3500);
  };

  return (
    <section style={{
      backgroundColor: '#F8FAFC',
      borderBottom: '2px solid var(--border-light)',
      padding: '0.85rem 0',
      position: 'relative'
    }}>
      <div style={{ padding: '0 0.85rem' }}>
        
        {/* Topo da Experiência: Card Principal da IA */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '1rem',
          boxShadow: '0 2px 10px rgba(0, 31, 216, 0.08)',
          marginBottom: '1rem',
          border: '1px solid #E2E8F0'
        }}>
          
          {/* Header com Título da Seleção e Botão Fechar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#EFF6FF', color: '#0022D6', padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                <Sparkles size={11} color="#0022D6" />
                <span>Cesta Recomendada por IA</span>
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', lineHeight: 1.25 }}>
                {journeyTitle}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={onCloseExperience}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #E2E8F0'
                }}
                title="Fechar experiência"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Balão de Orientação Farmacêutica Inteligente */}
          <div style={{
            backgroundColor: '#F0F7FF',
            border: '1px solid #CFE2FE',
            borderRadius: '14px',
            padding: '0.85rem',
            marginBottom: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                backgroundColor: '#0022D6',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={13} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0022D6' }}>
                Orientação Farmacêutica Pague Menos
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#1E293B', lineHeight: 1.45 }}>
              {rationale}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px dashed #BFDBFE', fontSize: '0.68rem', color: '#008744', fontWeight: 700 }}>
              <span>✓ Eficácia terapêutica validada</span>
              <span>CRF/SP ativo</span>
            </div>
          </div>

          {/* Sessão Conversacional Direta no Chat com a IA (Substitui controles manuais) */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            padding: '0.85rem',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '0.85rem'
          }}>
            
            {/* Status e Resumo do Pedido */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
                Pedido:
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#001FD8',
                backgroundColor: '#EFF6FF',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid #BFDBFE'
              }}>
                "{appliedPrompt || 'Cesta de Saúde e Cuidados'}"
              </span>
              {targetBudget ? (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#008744',
                  backgroundColor: '#DCFCE7',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #86EFAC'
                }}>
                  Teto: R$ {targetBudget.toFixed(0)}
                </span>
              ) : (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#64748B',
                  backgroundColor: '#F1F5F9',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px'
                }}>
                  Sem teto de gastos
                </span>
              )}
              {preferGenerics && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#065F46',
                  backgroundColor: '#D1FAE5',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px'
                }}>
                  Genéricos ativos
                </span>
              )}
            </div>

            {/* Mensagem da IA Farmacêutica com Produtos Recomendados da Farmácia */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              backgroundColor: '#FFFFFF',
              padding: '0.75rem',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Sparkles size={14} color="#FDE047" />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#1E293B', lineHeight: 1.4 }}>
                  <strong>IA Pague Menos:</strong> Encontrei estes produtos em estoque na farmácia para sua situação. Você pode clicar em <strong>Comprar</strong> para ir direto ao carrinho ou ajustar sua necessidade pelo chat:
                </div>
              </div>

              {/* Lista dos Produtos da Farmácia Recomendados no Chat */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.2rem' }}>
                {recommendedItems.map((prod) => (
                  <div
                    key={prod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      padding: '0.5rem 0.65rem',
                      border: '1px solid #E2E8F0',
                      gap: '0.5rem'
                    }}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#E30613', fontWeight: 800 }}>
                          R$ {prod.clubPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: '#008744', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '0.05rem 0.3rem', borderRadius: '4px' }}>
                          ✓ Disponível na loja
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(prod, true)}
                      style={{
                        backgroundColor: '#E30613',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.4rem 0.65rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(227, 6, 19, 0.25)',
                        cursor: 'pointer'
                      }}
                      title="Comprar produto e ir para o carrinho"
                    >
                      <ShoppingBag size={12} />
                      <span>Comprar</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Botão de Comprar Todos os Recomendados no Chat */}
              <button
                type="button"
                onClick={handleAddAll}
                style={{
                  width: '100%',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  padding: '0.55rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  marginTop: '0.2rem',
                  cursor: 'pointer'
                }}
              >
                <ShoppingBag size={14} />
                <span>Comprar todos recomendados ({recommendedItems.length} itens) e ir ao carrinho</span>
              </button>
            </div>

            {/* Feedback temporário de mensagem */}
            {chatFeedback && (
              <div style={{
                fontSize: '0.73rem',
                fontWeight: 700,
                color: '#008744',
                backgroundColor: '#DCFCE7',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <CheckCircle2 size={13} />
                <span>{chatFeedback}</span>
              </div>
            )}

            {/* Barra de Chat Direto */}
            <form onSubmit={handleCustomSubmit}>
              <div style={{
                display: 'flex',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #001FD8',
                padding: '0.2rem 0.35rem 0.2rem 0.75rem',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0, 31, 216, 0.08)'
              }}>
                <input
                  type="text"
                  placeholder="Escreva: 'gastar até R$ 60', 'trocar por genéricos', 'tirar sorine'..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    fontSize: '0.78rem',
                    color: '#1E293B',
                    backgroundColor: 'transparent',
                    padding: '0.4rem 0'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#001FD8',
                    color: '#FFFFFF',
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  title="Enviar mensagem para IA"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>

            {/* Pílulas de Ações Rápidas no Chat */}
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
                  onClick={() => handlePillClick(pill.prompt)}
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#001FD8',
                    border: '1px solid #BFDBFE',
                    cursor: 'pointer'
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Camada de Segurança Farmacêutica & Alerta ANVISA */}
        <div style={{
          backgroundColor: safetyNotice.hasPrescriptionRequired ? '#FFFBEB' : '#F0FDF4',
          border: safetyNotice.hasPrescriptionRequired ? '1px solid #FCD34D' : '1px solid #BBF7D0',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {safetyNotice.hasPrescriptionRequired ? (
              <AlertTriangle size={18} color="#D97706" />
            ) : (
              <ShieldCheck size={18} color="#059669" />
            )}
            <div style={{ fontSize: '0.84rem', color: safetyNotice.hasPrescriptionRequired ? '#92400E' : '#166534' }}>
              <strong>{safetyNotice.warningText}</strong>
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            {safetyNotice.disclaimer}
          </div>
        </div>

        {/* Grid de Produtos Recomendados pela IA */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Produtos Selecionados para Esta Cesta</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                ({recommendedItems.length} {recommendedItems.length === 1 ? 'item' : 'itens'})
              </span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Substitua ou remova qualquer item individualmente
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {recommendedItems.map((product) => {
              const isGeneric = product.isGeneric;
              const hasAlternative = product.genericEquivalentId || catalogList.some((c) => (c.category === product.category || c.categoryLabel === product.categoryLabel) && String(c.id) !== String(product.id));

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Selos do Produto */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="badge-ai">
                        <Sparkles size={11} />
                        Sugerido pela IA
                      </span>
                      {isGeneric && (
                        <span className="badge-generic">
                          Genérico
                        </span>
                      )}
                      {product.requiresPrescription && (
                        <span className="badge-rx">
                          Tarja Vermelha
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      title="Remover deste kit"
                      style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--pm-red)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Imagem e Dados Principais */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '84px',
                        height: '84px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#F1F5F9',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pm-blue)', textTransform: 'uppercase' }}>
                        {product.brand}
                      </div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                        {product.name}
                      </h4>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#0369A1',
                        backgroundColor: '#F0F9FF',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        lineHeight: 1.3
                      }}>
                        <strong>Ação:</strong> {product.clinicalRole}
                      </div>
                    </div>
                  </div>

                  {/* Preços e Economia */}
                  <div style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        De R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pm-red)' }}>
                          R$ {product.clubPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="badge-club">Clube Sempre Bem</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--pm-green)', fontWeight: 700 }}>
                        Economia: R$ {(product.originalPrice - product.clubPrice).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {/* Ações do Card: Trocar por Substituto ou Adicionar Individual */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {hasAlternative && (
                      <button
                        onClick={() => setAlternativeSelectorId(alternativeSelectorId === product.id ? null : product.id)}
                        style={{
                          flex: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--pm-blue)',
                          backgroundColor: 'var(--pm-blue-light)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Repeat size={13} />
                        <span>Ver alternativa</span>
                      </button>
                    )}

                    <button
                      onClick={() => onAddToCart(product, true)}
                      style={{
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        backgroundColor: '#E30613',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 8px rgba(227, 6, 19, 0.25)',
                        cursor: 'pointer'
                      }}
                      title="Comprar produto recomendado e ir para o carrinho"
                    >
                      <ShoppingBag size={14} />
                      <span>Comprar (Ir para o carrinho)</span>
                    </button>
                  </div>

                  {/* Menu Pop-in de Alternativas Farmacêuticas */}
                  {alternativeSelectorId === product.id && (
                    <div style={{
                      marginTop: '0.75rem',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem'
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        Opções equivalentes no catálogo:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {catalogList
                          .filter((c) => (c.category === product.category || c.categoryLabel === product.categoryLabel) && String(c.id) !== String(product.id))
                          .slice(0, 2)
                          .map((alt) => (
                            <div
                              key={alt.id}
                              onClick={() => handleSwapProduct(product.id, alt.id)}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.4rem 0.6rem',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '4px',
                                border: '1px solid var(--border-light)',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                            >
                              <div>
                                <strong style={{ color: 'var(--text-main)' }}>{alt.brand}</strong> - {alt.name.slice(0, 32)}...
                              </div>
                              <div style={{ color: 'var(--pm-red)', fontWeight: 700 }}>
                                R$ {alt.clubPrice.toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Barra de Ação do Kit Completo (Adicionar todos ao Carrinho Compartilhado) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          border: '2px solid var(--pm-red-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
              Resumo da Cesta Inteligente ({recommendedItems.length} itens)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--pm-red)', letterSpacing: '-0.5px' }}>
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                R$ {originalTotal.toFixed(2).replace('.', ',')}
              </span>
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#065F46',
                backgroundColor: '#D1FAE5',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)'
              }}>
                Você economiza R$ {savingsTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Entrega em até 1 hora ou retire grátis na loja Pague Menos
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {customAddedMessage && (
              <span style={{ color: 'var(--pm-green)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} />
                {customAddedMessage}
              </span>
            )}
            <button
              onClick={handleAddAll}
              className="btn-primary"
              style={{
                fontSize: '0.95rem',
                padding: '0.85rem 1.6rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 6px 20px rgba(216, 26, 36, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ShoppingBag size={20} />
              <span>Comprar cesta recomendada ({recommendedItems.length} itens) e ir ao carrinho</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
