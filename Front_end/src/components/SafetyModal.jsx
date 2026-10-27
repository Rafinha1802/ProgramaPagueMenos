import React from 'react';
import { X, ShieldCheck, AlertCircle, FileText, CheckCircle, Scale, Heart } from 'lucide-react';

export function SafetyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          backgroundColor: 'var(--pm-blue-dark)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck size={24} color="#4ADE80" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Camada de Segurança Farmacêutica & Compliance
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#93C5FD' }}>
                Diretrizes de Proteção ao Consumidor e Normas Sanitárias ANVISA
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo Explicativo */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: '#1E40AF'
          }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Scale size={16} /> O Compromisso Pague Menos de IA Responsável
            </h4>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>
              Nossa inteligência artificial não substitui a consulta médica nem o diagnóstico clínico. Ela atua como um assistente consultivo para facilitar a navegação em produtos de consumo livre, autocuidado responsável e otimização financeira com genéricos de qualidade comprovada.
            </p>
          </div>

          {/* Pilares */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#ECFDF5', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={18} color="#059669" />
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.88rem' }}>
                  1. Foco em Medicamentos Isentos de Prescrição (MIPs)
                </strong>
                <span style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                  A IA recomenda livremente produtos para sintomas leves e rotinas de prevenção (analgésicos, antitérmicos, cuidados com pele e vitaminas), sempre respeitando dosagens seguras.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#FEF2F2', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertCircle size={18} color="#DC2626" />
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.88rem' }}>
                  2. Trava Sanitária para Medicamentos Tarjados (RDC 20/2011 e Portaria 344)
                </strong>
                <span style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                  Nenhum medicamento sujeito a retenção de receita (antibióticos ou psicotrópicos) é dispensado sem o envio digital prévio ou a retenção da 2ª via física pelo entregador ou farmacêutico.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#F0F9FF', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={18} color="#0284C7" />
              </div>
              <div>
                <strong style={{ color: 'var(--text-main)', display: 'block', fontSize: '0.88rem' }}>
                  3. Supervisão Farmacêutica e Aviso Obrigatório
                </strong>
                <span style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                  Presença permanente de Farmacêutico Responsável (CRF ativo). Em todas as recomendações é veiculado o aviso legal: <em>“SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO.”</em>
                </span>
              </div>
            </div>

          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', textAlign: 'right' }}>
            <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              Entendido
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
