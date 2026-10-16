import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, DollarSign, MessageSquare, Check } from 'lucide-react';

export function AiCommerceSearchBar({
  onSendPrompt,
  onOpenExperience,
  hasActiveRecommendation = false,
  onOpenExistingRecommendation = () => {}
}) {
  const [situationInput, setSituationInput] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [preferGenerics, setPreferGenerics] = useState(false);

  const budgetPresets = [
    { label: 'Sem limite', value: '' },
    { label: 'Até R$ 50', value: '50' },
    { label: 'Até R$ 80', value: '80' },
    { label: 'Até R$ 120', value: '120' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const prompt = situationInput.trim() || 'Produtos essenciais de saúde e bem-estar';
    const budget = budgetInput.trim() ? parseFloat(budgetInput.replace(',', '.')) : null;

    onSendPrompt(prompt, budget, preferGenerics);
  };

  const handleSelectBudgetPreset = (val) => {
    setBudgetInput(val);
  };

  return (
    <div style={{ padding: '0 1rem', marginBottom: '1.25rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #001FD8 0%, #0017A3 100%)',
        borderRadius: '20px',
        padding: '1.2rem 1.15rem 1.15rem 1.15rem',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(0, 31, 216, 0.22)',
        border: '1.5px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decoração de fundo sutil */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(227, 6, 19, 0.35) 0%, rgba(227, 6, 19, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Tag Superior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            padding: '0.22rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.3px',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={12} color="#FDE047" />
            <span>Chat IA Farmacêutica</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', color: '#93C5FD', fontWeight: 600 }}>
            <ShieldCheck size={13} color="#4ADE80" />
            <span>CRF/SP Ativo</span>
          </div>
        </div>

        {/* Título e Explicação */}
        <div style={{ marginBottom: '0.9rem' }}>
          <h3 style={{
            fontSize: '1.08rem',
            fontWeight: 800,
            lineHeight: 1.3,
            color: '#FFFFFF',
            letterSpacing: '-0.3px'
          }}>
            O que você precisa hoje?
          </h3>
          <p style={{ fontSize: '0.76rem', color: '#E2E8F0', marginTop: '0.2rem', lineHeight: 1.35 }}>
            Escreva o que procura para sua situação e, se desejar, informe o total que quer gastar.
          </p>
        </div>

        {/* Formulário Direto de Chat com a IA */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* 1. O que quer / Situação */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#F1F5F9',
              marginBottom: '0.35rem'
            }}>
              <MessageSquare size={13} color="#FDE047" />
              <span>O que você quer ou para qual situação?</span>
            </label>
            <div style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '0.35rem 0.65rem',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
            }}>
              <input
                type="text"
                placeholder="Ex: 'Gripe e dor no corpo', 'Pele oleosa e acne', 'Kit viagem'..."
                value={situationInput}
                onChange={(e) => setSituationInput(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  fontSize: '0.84rem',
                  color: '#1E293B',
                  backgroundColor: 'transparent',
                  padding: '0.35rem 0'
                }}
              />
            </div>
          </div>

          {/* 2. Valor total que quer gastar (Opcional) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#F1F5F9'
              }}>
                <DollarSign size={13} color="#4ADE80" />
                <span>Valor total que quer gastar <span style={{ opacity: 0.8, fontWeight: 500 }}>(opcional)</span>:</span>
              </label>
              {budgetInput && (
                <span style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 800 }}>
                  Teto: R$ {budgetInput}
                </span>
              )}
            </div>

            <div style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '0.3rem 0.65rem',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', marginRight: '0.35rem' }}>R$</span>
              <input
                type="number"
                min="10"
                max="1000"
                step="5"
                placeholder="Ex: 80 (ou deixe em branco se não quiser limitar)"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  fontSize: '0.84rem',
                  color: '#1E293B',
                  backgroundColor: 'transparent',
                  padding: '0.35rem 0'
                }}
              />
            </div>

            {/* Chips rápidos de orçamento para clicar em 1 toque */}
            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
              {budgetPresets.map((preset) => {
                const isSelected = budgetInput === preset.value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectBudgetPreset(preset.value)}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)',
                      color: isSelected ? '#001FD8' : '#FFFFFF',
                      border: isSelected ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected && <Check size={10} style={{ display: 'inline', marginRight: '3px' }} />}
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Rápido de Genéricos (Opcional) */}
          <div
            onClick={() => setPreferGenerics(!preferGenerics)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: preferGenerics ? 'rgba(74, 222, 128, 0.18)' : 'rgba(255, 255, 255, 0.1)',
              border: preferGenerics ? '1px solid #4ADE80' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '0.4rem 0.65rem',
              cursor: 'pointer',
              marginTop: '0.1rem'
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              backgroundColor: preferGenerics ? '#4ADE80' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              fontSize: '11px',
              fontWeight: 900
            }}>
              {preferGenerics ? '✓' : ''}
            </div>
            <div style={{ fontSize: '0.73rem', color: '#FFFFFF', flex: 1 }}>
              <strong>Priorizar genéricos</strong> <span style={{ opacity: 0.85, fontSize: '0.68rem' }}>(mesma fórmula por até metade do preço)</span>
            </div>
          </div>

          {/* Botão de Envio para a IA */}
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              width: '100%',
              backgroundColor: 'var(--pm-app-red)',
              color: '#FFFFFF',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(227, 6, 19, 0.4)',
              transition: 'transform 0.15s ease',
              marginTop: '0.2rem',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={17} color="#FDE047" />
            <span>Montar minha cesta com IA</span>
            <ArrowRight size={17} />
          </button>

          {/* Atalho para reabrir resposta da IA anterior se já existir */}
          {hasActiveRecommendation && (
            <button
              type="button"
              onClick={onOpenExistingRecommendation}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                color: '#FFFFFF',
                padding: '0.55rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                marginTop: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={14} color="#FDE047" />
              <span>Ver resposta da Farmacêutica IA em tela cheia →</span>
            </button>
          )}
        </form>

      </div>
    </div>
  );
}
