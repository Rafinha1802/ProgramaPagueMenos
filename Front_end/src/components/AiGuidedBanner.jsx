import React, { useState } from 'react';
import { Sparkles, PackagePlus, Wallet, RotateCw, ArrowRight, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';
import { INTENT_PRESETS, EXAMPLE_SEARCH_PROMPTS } from '../data/intentPresets';

export function AiGuidedBanner({ onSelectPreset, onSelectCustomPrompt }) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedTab, setSelectedTab] = useState('montar-kit');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPrompt.trim()) {
      onSelectCustomPrompt(inputPrompt.trim());
    }
  };

  const currentPresetData = INTENT_PRESETS.find(p => p.id === selectedTab) || INTENT_PRESETS[0];

  return (
    <section style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-light)',
      padding: '1.75rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorativo Suave */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '500px',
        height: '100%',
        background: 'radial-gradient(circle at 80% 20%, rgba(0, 119, 200, 0.08) 0%, rgba(216, 26, 36, 0.04) 50%, transparent 80%)',
        pointerEvents: 'none'
      }} />

      <div className="container">
        {/* Caixa Principal de Destaque da IA */}
        <div style={{
          background: 'linear-gradient(135deg, #002B52 0%, #004580 50%, #002244 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.25rem',
          color: '#FFFFFF',
          boxShadow: '0 12px 30px rgba(0, 39, 77, 0.25)',
          position: 'relative'
        }}>
          
          {/* Tag de Apresentação e Diferencial */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles size={16} color="#FDE047" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase', color: '#F8FAFC' }}>
                Nova Compra Guiada por IA • Sem Chatbots Complicados
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: '#93C5FD' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} color="#4ADE80" /> 100% Validado por Farmacêuticos
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={14} color="#FDE047" /> Otimização de Genéricos & Preço
              </span>
            </div>
          </div>

          {/* Título e Explicação Simples do Benefício */}
          <div style={{ maxWidth: '820px', marginBottom: '1.75rem' }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
              marginBottom: '0.6rem',
              lineHeight: 1.2
            }}>
              Não sabe exatamente o que levar? A IA da Pague Menos monta sua cesta ideal.
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#CBD5E1',
              lineHeight: 1.5,
              maxWidth: '740px'
            }}>
              Em vez de pesquisar item por item ou abrir chatbots lentos, diga o que você precisa ou quanto quer gastar. 
              Nossa inteligência consulta o catálogo em tempo real, aplica descontos do Sempre Bem Pague Menos e recomenda uma seleção completa com segurança médica.
            </p>
          </div>

          {/* Campo de Entrada de Linguagem Natural */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.75rem' }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '0.4rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '2px solid rgba(255, 255, 255, 0.8)'
            }}>
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Escreva livremente: ex: 'Kit para pele com acne e protetor até R$ 80' ou 'Remédio para gripe e dor'..."
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.98rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  backgroundColor: 'transparent'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  whiteSpace: 'nowrap',
                  fontSize: '0.92rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span>Montar Minha Cesta</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Abas e Atalhos Guiados: "Montar um kit", "Comprar dentro do orçamento", "Repetir compra" */}
          <div style={{ backgroundColor: 'rgba(0, 20, 43, 0.45)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            
            {/* Seletor de Categorias de Jornada */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {INTENT_PRESETS.map((preset) => {
                const isActive = selectedTab === preset.id;
                let IconComponent = PackagePlus;
                if (preset.id === 'dentro-orcamento') IconComponent = Wallet;
                if (preset.id === 'repetir-compra') IconComponent = RotateCw;

                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedTab(preset.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1.1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'var(--pm-red)' : 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.88rem',
                      border: isActive ? '1px solid #FF4D4D' : '1px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconComponent size={16} />
                    <span>{preset.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-opções em 1 clique para a aba ativa */}
            <div>
              <div style={{ fontSize: '0.78rem', color: '#93C5FD', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HeartHandshake size={14} color="#60A5FA" />
                <span>Escolha uma jornada rápida de compra baseada em intenção:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {currentPresetData.quickOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => onSelectPreset(opt)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.18s ease, background-color 0.18s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>{opt.label}</span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: '#10B981',
                        color: '#064E3B',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        {opt.badge}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                        Teto sugerido: <strong>R$ {opt.budget.toFixed(2).replace('.', ',')}</strong>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#67E8F9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        Ver Cesta <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
