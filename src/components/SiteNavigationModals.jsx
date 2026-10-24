import React, { useState } from 'react';
import {
  MapPin,
  Store,
  Smartphone,
  HelpCircle,
  X,
  Search,
  Phone,
  Clock,
  QrCode,
  Download,
  MessageCircle,
  Headphones,
  CheckCircle2,
  Truck,
  Sparkles,
  ChevronRight
} from 'lucide-react';

// ============================================================================
// 1. MODAL: NOSSAS LOJAS PAGUE MENOS
// ============================================================================
export function StoresModal({ isOpen, onClose, onSelectStore }) {
  const [storeQuery, setStoreQuery] = useState('');

  if (!isOpen) return null;

  const stores = [
    {
      id: 'store-1',
      name: 'Pague Menos Paulista - Flagship 24 Horas',
      address: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP',
      distance: '650m da sua localização',
      hours: 'Aberto 24 Horas • Todos os dias',
      phone: '(11) 3289-4100',
      badge: 'Retirada Express em 1h',
      services: ['Vacinação', 'Farmacêutico 24h', 'Estacionamento Grátis', 'Drive-Thru']
    },
    {
      id: 'store-2',
      name: 'Pague Menos Jardins - Oscar Freire',
      address: 'Rua Oscar Freire, 920 - Cerqueira César, São Paulo - SP',
      distance: '1,2 km',
      hours: 'Seg a Sáb: 07h às 23h • Dom: 08h às 22h',
      phone: '(11) 3062-8812',
      badge: 'Retirada Express em 1h',
      services: ['Dermo Consultoria', 'Aferição de Pressão', 'Bioimpedância']
    },
    {
      id: 'store-3',
      name: 'Pague Menos Higienópolis - Shopping Pátio',
      address: 'Av. Higienópolis, 618 - Higienópolis, São Paulo - SP',
      distance: '1,8 km',
      hours: 'Seg a Dom: 08h às 23h',
      phone: '(11) 3823-2200',
      badge: 'Retirada Express em 1h',
      services: ['Clinic Farma', 'Vacinas', 'Testes Rápidos']
    },
    {
      id: 'store-4',
      name: 'Pague Menos Pinheiros - Faria Lima',
      address: 'Av. Brigadeiro Faria Lima, 1485 - Pinheiros, São Paulo - SP',
      distance: '2,9 km',
      hours: 'Aberto 24 Horas',
      phone: '(11) 3815-9944',
      badge: 'Retirada Express em 1h',
      services: ['Drive-Thru', 'Farmácia Popular', 'Estacionamento']
    }
  ];

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(storeQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(storeQuery.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '640px',
        width: '100%',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8' }}>
              <Store size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Encontre Nossas Lojas
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
                Mais de 850 farmácias com Retirada em 1h e Farmacêutico Presente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ backgroundColor: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900 }}
          >
            ✕
          </button>
        </div>

        {/* Campo de Busca */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Digite seu CEP, bairro ou rua..."
            value={storeQuery}
            onChange={(e) => setStoreQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 2.6rem',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Lista de Lojas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((s) => (
            <div
              key={s.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '1.25rem',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{s.name}</strong>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>{s.address}</div>
                </div>
                <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  {s.badge}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: '#64748B', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} color="#001FD8" /> {s.hours}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Phone size={14} color="#059669" /> {s.phone}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#001FD8', fontWeight: 700 }}>
                  <MapPin size={14} /> {s.distance}
                </span>
              </div>

              {/* Serviços disponíveis */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {s.services.map((serv, idx) => (
                  <span key={idx} style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                    {serv}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  if (onSelectStore) onSelectStore(s);
                  onClose();
                }}
                style={{
                  marginTop: '0.4rem',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Escolher Esta Loja para Retirada Grátis
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. MODAL: BAIXE NOSSO APP
// ============================================================================
export function AppDownloadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        padding: '2.25rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900 }}
        >
          ✕
        </button>

        <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8', margin: '0 auto 1rem auto' }}>
          <Smartphone size={32} />
        </div>

        <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
          Cupom de R$ 20 OFF no Primeiro Pedido
        </span>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: '0.75rem 0 0.4rem 0' }}>
          Baixe o App Pague Menos
        </h3>

        <p style={{ fontSize: '0.88rem', color: '#64748B', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
          Aponte a câmera do seu celular para o QR Code abaixo para baixar gratuitamente no iOS e Android.
        </p>

        {/* QR Code Simulado Estilizado */}
        <div style={{
          width: '180px',
          height: '180px',
          margin: '0 auto 1.5rem auto',
          backgroundColor: '#FFFFFF',
          border: '2px solid #001FD8',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          boxShadow: '0 8px 24px rgba(0, 31, 216, 0.15)'
        }}>
          <QrCode size={130} color="#001FD8" />
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#001FD8', marginTop: '4px' }}>
            ESCANEAR QR CODE
          </span>
        </div>

        <div style={{
          backgroundColor: '#F8FAFC',
          padding: '0.85rem 1.25rem',
          borderRadius: '14px',
          border: '1px dashed #CBD5E1',
          marginBottom: '1.25rem'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Use o cupom exclusivo do aplicativo: </span>
          <strong style={{ fontSize: '0.95rem', color: '#001FD8', letterSpacing: '1px' }}>APP20OFF</strong>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#001FD8',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.85rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Entendi, vou baixar!
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 3. MODAL: PRECISA DE AJUDA / SAC / CENTRAL DE ATENDIMENTO
// ============================================================================
export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '580px',
        width: '100%',
        padding: '2.25rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900 }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8' }}>
            <HelpCircle size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Central de Atendimento Pague Menos
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
              Estamos prontos para te ajudar em todos os canais oficiais
            </p>
          </div>
        </div>

        {/* Canais de Contato Rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ border: '1px solid #CBD5E1', borderRadius: '14px', padding: '1rem', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', marginBottom: '0.4rem' }}>
              <MessageCircle size={20} />
              <strong style={{ fontSize: '0.9rem' }}>WhatsApp Pague Menos</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
              (11) 98765-4321<br />Atendimento 24 horas por IA e farmacêuticos
            </div>
          </div>

          <div style={{ border: '1px solid #CBD5E1', borderRadius: '14px', padding: '1rem', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#001FD8', marginBottom: '0.4rem' }}>
              <Headphones size={20} />
              <strong style={{ fontSize: '0.9rem' }}>SAC Telefônico Grátis</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
              0800 701 4000<br />Segunda a Sábado das 08h às 21h
            </div>
          </div>
        </div>

        {/* Dúvidas Frequentes */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
          Dúvidas Frequentes
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <details style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem', cursor: 'pointer' }}>
            <summary style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
              Como funciona a Entrega Turbo em 45 minutos?
            </summary>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.4 }}>
              Nossos motoboys saem diretamente da loja mais próxima da sua residência. Para compras aprovadas até as 21h, a entrega ocorre em até 45 minutos!
            </p>
          </details>

          <details style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem', cursor: 'pointer' }}>
            <summary style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
              Como envio minha receita médica para comprar remédios?
            </summary>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.4 }}>
              Basta clicar no botão "Busque produtos usando sua receita" na página inicial ou durante o checkout. Aceitamos fotos nítidas ou arquivos PDF.
            </p>
          </details>

          <details style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem', cursor: 'pointer' }}>
            <summary style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
              Posso trocar medicamentos em lojas físicas?
            </summary>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.4 }}>
              Conforme normas da ANVISA (RDC 44/2009), medicamentos não controlados com lacre inviolado e cupom fiscal podem ser trocados em até 7 dias em qualquer filial.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MODAL: INFORMAR CEP / LOCALIZAÇÃO
// ============================================================================
export function CepLocationModal({ isOpen, onClose, onSaveCep }) {
  const [cepInput, setCepInput] = useState('');
  const [calculated, setCalculated] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = (e) => {
    e.preventDefault();
    if (cepInput.trim().length >= 8) {
      setCalculated(true);
      if (onSaveCep) onSaveCep(cepInput);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900 }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8' }}>
            <MapPin size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Calcular Frete & Prazos
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
              Veja as lojas mais próximas e opções de entrega turbo
            </p>
          </div>
        </div>

        <form onSubmit={handleCalculate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="Ex: 01310-200"
            value={cepInput}
            onChange={(e) => setCepInput(e.target.value)}
            style={{
              flex: 1,
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#001FD8',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Calcular
          </button>
        </form>

        {calculated && (
          <div style={{ border: '1px solid #BFDBFE', borderRadius: '14px', padding: '1rem', backgroundColor: '#EFF6FF', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E40AF', fontWeight: 800, fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>CEP Atendido com Entrega Turbo em 45 minutos!</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.4rem', lineHeight: 1.4 }}>
              • <strong>Retirada Express em Loja:</strong> Grátis em até 1 hora na Pague Menos Paulista.<br />
              • <strong>Entrega Turbo:</strong> R$ 4,90 (Grátis para compras acima de R$ 99).
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.85rem',
            borderRadius: '12px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Confirmar Localização
        </button>
      </div>
    </div>
  );
}
