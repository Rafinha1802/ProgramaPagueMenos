import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  MessageSquare,
  Check,
  Camera,
  Paperclip,
  FileText,
  Image as ImageIcon,
  X,
  Upload,
  Repeat
} from 'lucide-react';

export function AiCommerceSearchBar({
  onSendPrompt,
  onOpenExperience,
  hasActiveRecommendation = false,
  onOpenExistingRecommendation = () => {},
  onOpenCamera = () => {}
}) {
  const [situationInput, setSituationInput] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [preferGenerics, setPreferGenerics] = useState(false);
  const [attachment, setAttachment] = useState(null); // { type, name, previewUrl, intent }
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);

  const budgetPresets = [
    { label: 'Sem limite', value: '' },
    { label: 'Até R$ 50', value: '50' },
    { label: 'Até R$ 80', value: '80' },
    { label: 'Até R$ 120', value: '120' }
  ];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    let prompt = situationInput.trim();
    if (!prompt) {
      if (attachment) {
        if (attachment.intent === 'generic') {
          prompt = `Encontrar genérico equivalente mais barato para o medicamento ${attachment.name}`;
        } else if (attachment.intent === 'repurchase') {
          prompt = `Recomprar medicamento da imagem ${attachment.name}`;
        } else {
          prompt = `Produtos e medicamentos prescritos na receita médica ${attachment.name}`;
        }
      } else {
        prompt = 'Produtos essenciais de saúde e bem-estar';
      }
    }
    const budget = budgetInput.trim() ? parseFloat(budgetInput.replace(',', '.')) : null;

    onSendPrompt(prompt, budget, preferGenerics, attachment);
  };

  const handleSelectBudgetPreset = (val) => {
    setBudgetInput(val);
  };

  // Upload de foto do aparelho (Galeria)
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

  // Upload de documento (Receita Médica em PDF)
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

  // Exemplos rápidos para testar em 1 toque
  const handleSelectSample = (sampleType) => {
    if (sampleType === 'dorflex') {
      setAttachment({
        type: 'photo',
        name: 'foto_caixa_dorflex.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
        intent: 'generic',
        detectedMedication: 'Dorflex'
      });
      if (!situationInput) setSituationInput('Quero ver o genérico mais barato deste remédio para dor muscular');
    } else if (sampleType === 'rivotril') {
      setAttachment({
        type: 'photo',
        name: 'foto_rivotril_2mg.jpg',
        previewUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
        intent: 'generic',
        detectedMedication: 'Rivotril'
      });
      if (!situationInput) setSituationInput('Buscar o genérico deste calmante que tomo habitualmente');
    } else if (sampleType === 'receita') {
      setAttachment({
        type: 'document',
        name: 'receita_digital_amoxicilina.pdf',
        previewUrl: null,
        intent: 'prescription',
        detectedMedication: 'Amoxicilina'
      });
      if (!situationInput) setSituationInput('Preciso comprar os remédios da minha receita médica');
    }
    setShowAttachMenu(false);
  };

  return (
    <div style={{ padding: '0 1rem', marginBottom: '1.25rem' }}>
      {/* Inputs ocultos de arquivos para galeria e documentos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        style={{ display: 'none' }}
        onChange={handleDocUpload}
      />

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
            <span>Farmacêutica IA FarmaViva</span>
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
            Descreva sua situação, tire foto do remédio ou anexe sua receita para ver o genérico ou recomprar:
          </p>
        </div>

        {/* Formulário Direto de Chat com a IA */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* 1. O que quer / Situação + Botões de Foto e Anexo Integrados */}
          <div>
            <div style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '0.35rem 0.5rem 0.35rem 0.75rem',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              gap: '0.4rem'
            }}>
              <MessageSquare size={16} color="#001FD8" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Ex: 'Dor nas costas', 'Gripe e febre' ou use a câmera..."
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

              {/* Botões de Ação na mesma barra: Câmera + Anexo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  type="button"
                  onClick={onOpenCamera}
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#001FD8',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: 'pointer'
                  }}
                  title="Tirar foto do medicamento ou receita"
                >
                  <Camera size={14} color="#001FD8" />
                  <span style={{ fontSize: '0.68rem' }}>Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  style={{
                    backgroundColor: attachment ? '#FEF2F2' : '#F8FAFC',
                    color: attachment ? '#DC2626' : '#64748B',
                    border: attachment ? '1px solid #FECACA' : '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.35rem 0.45rem',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  title="Anexar documento ou foto da galeria"
                >
                  <Paperclip size={14} />
                </button>
              </div>
            </div>

            {/* Menu Dropdown de Opções de Anexo */}
            {showAttachMenu && (
              <div style={{
                marginTop: '0.45rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '0.55rem',
                color: '#1E293B',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                animation: 'fadeIn 0.15s ease-out'
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', padding: '0 0.25rem' }}>
                  Anexar Medicamento ou Receita:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.55rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#001FD8',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}
                  >
                    <ImageIcon size={14} />
                    <span>Galeria de Fotos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      docInputRef.current?.click();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.55rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#DC2626',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}
                  >
                    <FileText size={14} />
                    <span>Receita (PDF)</span>
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW DO ARQUIVO ANEXADO COM SELETOR DE INTENÇÃO */}
            {attachment && (
              <div style={{
                marginTop: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#0F172A',
                borderRadius: '12px',
                padding: '0.55rem 0.75rem',
                boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                border: '1.5px solid #60A5FA'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                    {attachment.previewUrl ? (
                      <img
                        src={attachment.previewUrl}
                        alt="Anexo"
                        style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #CBD5E1', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: '38px', height: '38px', backgroundColor: '#EFF6FF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8', flexShrink: 0 }}>
                        <FileText size={20} />
                      </div>
                    )}

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        {attachment.name}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#64748B' }}>
                        {attachment.type === 'document' ? 'Documento PDF Anexado' : 'Foto anexada com sucesso'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    style={{ color: '#94A3B8', padding: '0.2rem', cursor: 'pointer' }}
                    title="Remover anexo"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Escolha do Objetivo com este anexo */}
                <div style={{ marginTop: '0.45rem', paddingTop: '0.45rem', borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#475569', marginBottom: '0.3rem' }}>
                    O que fazer com este anexo?
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setAttachment({ ...attachment, intent: 'generic' })}
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '0.22rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: attachment.intent === 'generic' ? '#001FD8' : '#F1F5F9',
                        color: attachment.intent === 'generic' ? '#FFFFFF' : '#334155',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      💊 Ver Genérico Mais Barato
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttachment({ ...attachment, intent: 'repurchase' })}
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '0.22rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: attachment.intent === 'repurchase' ? '#001FD8' : '#F1F5F9',
                        color: attachment.intent === 'repurchase' ? '#FFFFFF' : '#334155',
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
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '0.22rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: attachment.intent === 'prescription' ? '#E30613' : '#F1F5F9',
                        color: attachment.intent === 'prescription' ? '#FFFFFF' : '#334155',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      📋 Validar Receita Médica
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            <span>{attachment ? 'Processar anexo e montar cesta com IA' : 'Montar minha cesta com IA'}</span>
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
export default AiCommerceSearchBar;
