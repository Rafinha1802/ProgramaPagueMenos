import React from 'react';
import { Phone, Mail, ShieldCheck, Heart, MapPin, ExternalLink } from 'lucide-react';

export function Footer({ onOpenSafetyModal, onOpenAiGuide }) {
  return (
    <footer style={{ backgroundColor: 'var(--pm-blue-dark)', color: '#E2E8F0', paddingTop: '3rem', paddingBottom: '2rem', borderTop: '4px solid var(--pm-red)' }}>
      <div className="container">
        
        {/* Grid Institucional */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Coluna 1: Pague Menos */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}>
                <img
                  src="/paguemenos-logo.png"
                  alt="Pague Menos"
                  style={{
                    height: '32px',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '1rem' }}>
              Empreendimentos Pague Menos S.A. Presente em todo o Brasil promovendo saúde, cuidado preventivo e inteligência farmacêutica.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={14} color="#38BDF8" /> Televendas: <strong>4002-8282</strong>
            </div>
          </div>

          {/* Coluna 2: Inovação & IA Commerce */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Inovação no Varejo Farma
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <li>
                <button onClick={onOpenAiGuide} style={{ color: '#93C5FD', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>Compra Guiada por IA</span>
                  <ExternalLink size={12} />
                </button>
              </li>
              <li style={{ color: '#94A3B8' }}>Jornadas de Intenção e Orçamento</li>
              <li style={{ color: '#94A3B8' }}>Otimizador de Genéricos Homologados</li>
              <li style={{ color: '#94A3B8' }}>Clinic Farma: Consultórios Farmacêuticos</li>
            </ul>
          </div>

          {/* Coluna 3: Serviços e Conveniência */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Entrega e Conveniência
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#94A3B8' }}>
              <li>⚡ Entrega Turbo em até 1 hora</li>
              <li>🏬 Clique & Retire (Grátis em 30 min)</li>
              <li>💛 Programa de Fidelidade Sempre Bem</li>
              <li>📄 Envio e Validação de Receita Digital</li>
            </ul>
          </div>

          {/* Coluna 4: Responsabilidade Técnica */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Responsabilidade Técnica
            </h4>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontSize: '0.78rem',
              lineHeight: 1.45,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ color: '#4ADE80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={14} /> Farmacêutico Online
              </div>
              <div>Dra. Camila Nogueira • CRF/SP 48.912</div>
              <div>AFE ANVISA: 7.12345.0</div>
              <button
                onClick={onOpenSafetyModal}
                style={{ color: '#60A5FA', textDecoration: 'underline', marginTop: '0.4rem', display: 'block', fontSize: '0.75rem' }}
              >
                Ver regras de dispensação e compliance
              </button>
            </div>
          </div>

        </div>

        {/* Rodapé Legal ANVISA */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '1.5rem',
          fontSize: '0.75rem',
          color: '#94A3B8',
          textAlign: 'center',
          lineHeight: 1.6
        }}>
          <p style={{ fontWeight: 700, color: '#FEF08A', marginBottom: '0.4rem' }}>
            SE PERSISTIREM OS SINTOMAS, O MÉDICO DEVERÁ SER CONSULTADO. MEDICAMENTO GENÉRICO - LEI Nº 9.787/99.
          </p>
          <p>
            Empreendimentos Pague Menos S/A | CNPJ: 06.626.253/0001-51 | As informações contidas neste site não devem ser usadas para automedicação e não substituem o diagnóstico médico.
          </p>
        </div>

      </div>
    </footer>
  );
}
