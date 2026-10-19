import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Receipt,
  Truck,
  ArrowLeft,
  LogOut,
  Bell,
  Heart,
  ShieldCheck,
  Award,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter
} from 'lucide-react';

export function UserProfilePage({
  userSession,
  onLogout,
  onBackToStore,
  onAddToCart,
  onShowToast,
  onOpenPrescriptionFlow,
  isMobile = false
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses', 'payments', 'prescriptions', 'alerts'
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [selectedOrderForNFe, setSelectedOrderForNFe] = useState(null);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  // Dados cadastrais editáveis
  const [formData, setFormData] = useState({
    name: userSession?.name || 'Rafaella Guedes',
    email: userSession?.email || 'rafaella.guedes@email.com',
    cpf: userSession?.cpf || '458.912.384-12',
    phone: userSession?.phone || '(11) 98765-4321',
    birthDate: '14/08/1994',
    gender: 'Feminino'
  });

  // Histórico completo de pedidos do cliente FarmaViva
  const ordersHistory = [
    {
      id: 'FV-98421',
      date: '18/10/2026',
      time: '15:42',
      status: 'Entregue',
      statusColor: '#059669',
      statusBg: '#DCFCE7',
      deliveryType: 'Entrega Turbo Express (45 min)',
      paymentMethod: 'Pix à Vista',
      address: 'Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP',
      total: 72.60,
      discount: 15.00,
      subtotal: 87.60,
      freight: 0.00,
      items: [
        {
          id: 'pm-nivea-sun',
          name: 'Protetor Solar Nivea Sun Protect & Toque Seco FPS50 200ml',
          brand: 'NIVEA',
          quantity: 1,
          price: 34.90,
          image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=200&q=80'
        },
        {
          id: 'prod-07',
          name: 'Dipirona Monoidratada 500mg/ml Gotas 20ml - EMS Genérico',
          brand: 'EMS',
          quantity: 2,
          price: 8.90,
          image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=200&q=80'
        },
        {
          id: 'prod-14',
          name: 'Vitamina C 1g + Zinco 10mg FarmaViva 30 Efervescentes',
          brand: 'FarmaViva',
          quantity: 1,
          price: 19.90,
          image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&q=80'
        }
      ]
    },
    {
      id: 'FV-84192',
      date: '02/10/2026',
      time: '11:20',
      status: 'Entregue',
      statusColor: '#059669',
      statusBg: '#DCFCE7',
      deliveryType: 'Retirada Express em Loja (Loja Jardins)',
      paymentMethod: 'Cartão de Crédito Mastercard (2x)',
      address: 'Retirado na Loja FarmaViva - Rua Augusta, 1420',
      total: 201.70,
      discount: 22.00,
      subtotal: 223.70,
      freight: 0.00,
      items: [
        {
          id: 'pm-aptanutri',
          name: 'Fórmula Infantil Aptanutri Profutura 3 DHA ARA de 1 a 3 anos 800g',
          brand: 'APTANUTRI',
          quantity: 2,
          price: 94.90,
          image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=200&q=80'
        },
        {
          id: 'pm-evercare-disco',
          name: 'Algodão em Discos 100% Puro Dupla Face 100 un - Ever Care',
          brand: 'Ever Care',
          quantity: 1,
          price: 11.90,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80'
        }
      ]
    },
    {
      id: 'FV-72310',
      date: '15/09/2026',
      time: '19:15',
      status: 'Entregue',
      statusColor: '#059669',
      statusBg: '#DCFCE7',
      deliveryType: 'Entrega Convencional no Mesmo Dia',
      paymentMethod: 'Cartão de Crédito Visa (1x)',
      address: 'Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP',
      total: 61.80,
      discount: 10.00,
      subtotal: 71.80,
      freight: 0.00,
      items: [
        {
          id: 'prod-08',
          name: 'Dorflex 36 Comprimidos (Dipirona + Orfenadrina + Cafeína)',
          brand: 'Sanofi',
          quantity: 1,
          price: 27.90,
          image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&q=80'
        },
        {
          id: 'prod-06',
          name: 'Neosaldina 30 Drágeas (Dipirona + Isometepteno + Cafeína)',
          brand: 'Cosmed',
          quantity: 1,
          price: 33.90,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80'
        }
      ]
    },
    {
      id: 'FV-65109',
      date: '28/08/2026',
      time: '09:30',
      status: 'Entregue',
      statusColor: '#059669',
      statusBg: '#DCFCE7',
      deliveryType: 'Entrega Turbo Express',
      paymentMethod: 'Pix à Vista',
      address: 'Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP',
      total: 114.80,
      discount: 18.00,
      subtotal: 132.80,
      freight: 0.00,
      items: [
        {
          id: 'prod-04',
          name: 'Loção Facial Hidratante CeraVe 52ml',
          brand: 'CeraVe',
          quantity: 1,
          price: 64.90,
          image: 'https://images.unsplash.com/photo-1608248597359-009133612803?auto=format&fit=crop&w=200&q=80'
        },
        {
          id: 'prod-01',
          name: 'Gel de Limpeza Facial Actine Darrow 140g',
          brand: 'Darrow',
          quantity: 1,
          price: 49.90,
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80'
        }
      ]
    }
  ];

  // Ação: Recomprar pedido completo
  const handleRepeatOrder = (order) => {
    order.items.forEach((item) => {
      onAddToCart({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: item.image,
        category: 'Medicamentos'
      });
    });
    if (onShowToast) {
      onShowToast(`🛍️ ${order.items.length} itens do Pedido #${order.id} adicionados à sua cesta!`);
    }
  };

  // Salvar dados cadastrais
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast('✅ Seus dados cadastrais foram atualizados com sucesso!');
    }
  };

  // Filtragem dos pedidos por busca
  const filteredOrders = ordersHistory.filter((order) => {
    const term = orderSearchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.date.includes(term) ||
      order.items.some((item) => item.name.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: isMobile ? '0.75rem 0 5rem 0' : '2rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: isMobile ? '100%' : '1180px', padding: isMobile ? '0 0.85rem' : '0 1.5rem' }}>
        
        {/* Barra de Topo / Navegação Voltar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '0.85rem' : '1.5rem' }}>
          <button
            onClick={onBackToStore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: isMobile ? '0.45rem 0.8rem' : '0.55rem 1rem',
              borderRadius: '12px',
              color: '#001FD8',
              fontWeight: 800,
              fontSize: isMobile ? '0.78rem' : '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <ArrowLeft size={isMobile ? 15 : 16} />
            <span>{isMobile ? 'Voltar' : 'Voltar para a Loja'}</span>
          </button>

          <button
            onClick={onLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              padding: isMobile ? '0.45rem 0.8rem' : '0.55rem 0.95rem',
              borderRadius: '12px',
              color: '#DC2626',
              fontWeight: 700,
              fontSize: isMobile ? '0.76rem' : '0.82rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={isMobile ? 14 : 15} />
            <span>Sair</span>
          </button>
        </div>

        {/* 1. Header do Perfil do Cliente */}
        <div style={{
          background: 'linear-gradient(135deg, #001FD8 0%, #001594 70%, #000E5E 100%)',
          borderRadius: isMobile ? '18px' : '24px',
          padding: isMobile ? '1.15rem 1rem' : '2rem 2.5rem',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(0, 31, 216, 0.22)',
          marginBottom: isMobile ? '0.85rem' : '1.75rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Círculo decorativo */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '1rem' : '1.5rem',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Avatar & Informações Principais */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.85rem' : '1.25rem', width: '100%' }}>
              <div style={{
                width: isMobile ? '56px' : '76px',
                height: isMobile ? '56px' : '76px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: '#001FD8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '1.5rem' : '2.2rem',
                fontWeight: 900,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                border: '3px solid #93C5FD',
                flexShrink: 0
              }}>
                {formData.name.charAt(0)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: isMobile ? '1.2rem' : '1.85rem', fontWeight: 900, margin: 0, letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formData.name}
                  </h1>
                  <span style={{
                    backgroundColor: '#FDE047',
                    color: '#0F172A',
                    fontSize: isMobile ? '0.66rem' : '0.72rem',
                    fontWeight: 900,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Award size={12} color="#D97706" />
                    Cliente Ouro
                  </span>
                </div>
                <div style={{ fontSize: isMobile ? '0.74rem' : '0.85rem', color: '#BAE6FD', marginTop: '0.2rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.1rem' : '1rem' }}>
                  <span>E-mail: <strong>{formData.email}</strong></span>
                  <span>CPF: <strong>{formData.cpf}</strong></span>
                </div>
              </div>
            </div>

            {/* Badges de Benefícios do Usuário */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: isMobile ? '0.4rem' : '1rem',
              backgroundColor: 'rgba(255,255,255,0.12)',
              padding: isMobile ? '0.65rem 0.5rem' : '0.85rem 1.25rem',
              borderRadius: isMobile ? '14px' : '16px',
              backdropFilter: 'blur(8px)',
              width: isMobile ? '100%' : 'auto',
              boxSizing: 'border-box'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#FDE047' }}>4</div>
                <div style={{ fontSize: isMobile ? '0.68rem' : '0.72rem', color: '#E2E8F0', fontWeight: 600 }}>Pedidos</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#4ADE80' }}>R$ 184</div>
                <div style={{ fontSize: isMobile ? '0.68rem' : '0.72rem', color: '#E2E8F0', fontWeight: 600 }}>Economia</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#FFFFFF' }}>420</div>
                <div style={{ fontSize: isMobile ? '0.68rem' : '0.72rem', color: '#E2E8F0', fontWeight: 600 }}>Pontos</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Menu de Abas do Perfil (Completamente sem barra de rolagem e com chips nativos) */}
        <div
          id="profile-tabs-nav"
          className="hide-scrollbar"
          style={{
            display: 'flex',
            gap: isMobile ? '0.4rem' : '0.5rem',
            overflowX: 'auto',
            backgroundColor: '#FFFFFF',
            padding: isMobile ? '0.35rem' : '0.5rem',
            borderRadius: isMobile ? '14px' : '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            marginBottom: isMobile ? '1rem' : '1.5rem',
            border: '1px solid #E2E8F0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {[
            { id: 'orders', label: isMobile ? 'Pedidos' : 'Histórico de Compras', icon: <Package size={isMobile ? 15 : 17} /> },
            { id: 'profile', label: isMobile ? 'Dados' : 'Meus Dados', icon: <User size={isMobile ? 15 : 17} /> },
            { id: 'addresses', label: isMobile ? 'Endereços' : 'Endereços', icon: <MapPin size={isMobile ? 15 : 17} /> },
            { id: 'payments', label: isMobile ? 'Cartões' : 'Cartões & Carteira', icon: <CreditCard size={isMobile ? 15 : 17} /> },
            { id: 'prescriptions', label: isMobile ? 'Receitas' : 'Receitas Médicas', icon: <FileText size={isMobile ? 15 : 17} /> },
            { id: 'alerts', label: isMobile ? 'Alertas' : 'Alertas de Remédios', icon: <Bell size={isMobile ? 15 : 17} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: isMobile ? '0.35rem' : '0.5rem',
                  padding: isMobile ? '0.5rem 0.8rem' : '0.7rem 1.15rem',
                  borderRadius: isMobile ? '10px' : '12px',
                  border: isActive ? 'none' : '1px solid #F1F5F9',
                  backgroundColor: isActive ? '#001FD8' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: isMobile ? '0.78rem' : '0.86rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 4px 12px rgba(0, 31, 216, 0.22)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'orders' && (
                  <span style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#EFF6FF',
                    color: isActive ? '#FFFFFF' : '#001FD8',
                    fontSize: isMobile ? '0.68rem' : '0.72rem',
                    fontWeight: 900,
                    padding: '0.08rem 0.42rem',
                    borderRadius: '999px',
                    marginLeft: '0.15rem'
                  }}>
                    {ordersHistory.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            CONTEÚDO DA ABA 1: HISTÓRICO DE COMPRAS (PEDIDOS)
            ==================================================================== */}
        {activeTab === 'orders' && (
          <div>
            {/* Barra de Filtro e Busca nos Pedidos */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'stretch' : 'center',
              gap: isMobile ? '0.65rem' : '1rem',
              marginBottom: isMobile ? '0.85rem' : '1.25rem'
            }}>
              <div>
                <h2 style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                  {isMobile ? 'Histórico de Compras' : 'Meus Pedidos & Compras Anteriores'}
                </h2>
                <p style={{ fontSize: isMobile ? '0.78rem' : '0.84rem', color: '#64748B', marginTop: '0.2rem' }}>
                  {isMobile ? 'Rastreie entregas ou recompre itens em 1 clique.' : 'Visualize notas fiscais, rastreie entregas em tempo real ou recompre seus itens favoritos em 1 clique.'}
                </p>
              </div>

              {/* Input de Busca */}
              <div style={{ position: 'relative', width: isMobile ? '100%' : '300px' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder={isMobile ? "Buscar pedido ou produto..." : "Buscar por produto ou nº do pedido..."}
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '0.55rem 0.85rem 0.55rem 2.25rem' : '0.65rem 0.85rem 0.65rem 2.25rem',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: isMobile ? '0.8rem' : '0.84rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Lista de Pedidos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.85rem' : '1.25rem' }}>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: isMobile ? '16px' : '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Cabeçalho do Card do Pedido */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: isMobile ? '0.75rem 0.95rem' : '1rem 1.5rem',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'center',
                    gap: isMobile ? '0.5rem' : '0.75rem'
                  }}>
                    {isMobile ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                              Pedido
                            </span>
                            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#001FD8' }}>
                              #{order.id}
                            </div>
                          </div>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: order.statusBg,
                            color: order.statusColor,
                            padding: '0.28rem 0.7rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800
                          }}>
                            <CheckCircle2 size={13} />
                            <span>{order.status}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px dashed #E2E8F0' }}>
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{order.date} às {order.time}</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A' }}>
                            Total: R$ {order.total.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                              Pedido
                            </span>
                            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#001FD8' }}>
                              #{order.id}
                            </div>
                          </div>
                          <div style={{ width: '1px', height: '24px', backgroundColor: '#CBD5E1' }} />
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                              Data da Compra
                            </span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                              {order.date} às {order.time}
                            </div>
                          </div>
                          <div style={{ width: '1px', height: '24px', backgroundColor: '#CBD5E1' }} />
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                              Total Pago
                            </span>
                            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>
                              R$ {order.total.toFixed(2).replace('.', ',')}
                            </div>
                          </div>
                        </div>

                        {/* Status da Entrega */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: order.statusBg,
                          color: order.statusColor,
                          padding: '0.35rem 0.85rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 800
                        }}>
                          <CheckCircle2 size={15} />
                          <span>{order.status}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Corpo do Pedido: Itens comprados */}
                  <div style={{ padding: isMobile ? '0.85rem 0.95rem' : '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            borderBottom: idx < order.items.length - 1 ? '1px dashed #E2E8F0' : 'none',
                            paddingBottom: idx < order.items.length - 1 ? (isMobile ? '0.75rem' : '1rem') : '0'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.7rem' : '1rem', flex: 1, minWidth: 0 }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: isMobile ? '44px' : '56px',
                                height: isMobile ? '44px' : '56px',
                                borderRadius: isMobile ? '10px' : '12px',
                                objectFit: 'contain',
                                backgroundColor: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                padding: '3px',
                                flexShrink: 0
                              }}
                            />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase' }}>
                                {item.brand}
                              </span>
                              <div style={{
                                fontSize: isMobile ? '0.82rem' : '0.9rem',
                                fontWeight: 800,
                                color: '#0F172A',
                                lineHeight: 1.25,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: isMobile ? '0.72rem' : '0.76rem', color: '#64748B', marginTop: '0.15rem' }}>
                                {item.quantity}x • R$ {item.price.toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: isMobile ? '0.88rem' : '0.95rem', fontWeight: 900, color: '#0F172A' }}>
                              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detalhes de Envio e Pagamento */}
                    <div style={{
                      marginTop: isMobile ? '0.85rem' : '1.25rem',
                      paddingTop: isMobile ? '0.75rem' : '1rem',
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      gap: isMobile ? '0.4rem' : '0.85rem',
                      fontSize: isMobile ? '0.74rem' : '0.8rem',
                      color: '#475569'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Truck size={14} color="#001FD8" />
                        <span>Modalidade: <strong>{order.deliveryType}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <CreditCard size={14} color="#059669" />
                        <span>Pagamento: <strong>{order.paymentMethod}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Rodapé de Ações do Pedido */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: isMobile ? '0.75rem 0.95rem' : '0.9rem 1.5rem',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '0.5rem' : '0.75rem'
                  }}>
                    {isMobile ? (
                      <>
                        {/* Botão 3: Comprar Novamente (Destaque Principal no Mobile) */}
                        <button
                          onClick={() => handleRepeatOrder(order)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.45rem',
                            backgroundColor: '#001FD8',
                            border: 'none',
                            padding: '0.65rem 1rem',
                            borderRadius: '12px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0, 31, 216, 0.25)'
                          }}
                        >
                          <RotateCcw size={15} />
                          <span>Comprar Novamente</span>
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                          <button
                            onClick={() => setSelectedOrderForNFe(order)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              padding: '0.5rem',
                              borderRadius: '10px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: '#334155',
                              cursor: 'pointer'
                            }}
                          >
                            <Receipt size={14} color="#64748B" />
                            <span>Nota Fiscal</span>
                          </button>

                          <button
                            onClick={() => setSelectedOrderForTracking(order)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              backgroundColor: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              padding: '0.5rem',
                              borderRadius: '10px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              color: '#001FD8',
                              cursor: 'pointer'
                            }}
                          >
                            <Truck size={14} color="#001FD8" />
                            <span>Rastrear</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
                        {/* Botão 1: Segunda via da Nota Fiscal */}
                        <button
                          onClick={() => setSelectedOrderForNFe(order)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            padding: '0.55rem 0.95rem',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          <Receipt size={15} color="#64748B" />
                          <span>Nota Fiscal (NFe)</span>
                        </button>

                        {/* Botão 2: Rastrear Entrega */}
                        <button
                          onClick={() => setSelectedOrderForTracking(order)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #BFDBFE',
                            padding: '0.55rem 0.95rem',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#001FD8',
                            cursor: 'pointer'
                          }}
                        >
                          <Truck size={15} color="#001FD8" />
                          <span>Rastrear Entrega</span>
                        </button>

                        {/* Botão 3: Comprar Novamente (Destaque) */}
                        <button
                          onClick={() => handleRepeatOrder(order)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            backgroundColor: '#001FD8',
                            border: 'none',
                            padding: '0.55rem 1.15rem',
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0, 31, 216, 0.25)',
                            transition: 'transform 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <RotateCcw size={15} />
                          <span>Comprar Novamente</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            CONTEÚDO DA ABA 2: DADOS PESSOAIS
            ==================================================================== */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: isMobile ? '16px' : '20px', padding: isMobile ? '1.25rem 1rem' : '2rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem' }}>
              Meus Dados Cadastrais
            </h2>
            <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1rem' : '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                  CPF (Identificação Farmácia Popular)
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  disabled
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                  Telefone com WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem' }}>
                  Gênero
                </label>
                <input
                  type="text"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: isMobile ? '1' : '1 / -1', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    width: isMobile ? '100%' : 'auto',
                    backgroundColor: '#001FD8',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.85rem 2rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ====================================================================
            CONTEÚDO DA ABA 3: ENDEREÇOS
            ==================================================================== */}
        {activeTab === 'addresses' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: isMobile ? '16px' : '20px', padding: isMobile ? '1.25rem 1rem' : '2rem', border: '1px solid #E2E8F0' }}>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'stretch' : 'center',
              gap: isMobile ? '0.75rem' : '1rem',
              marginBottom: '1.25rem'
            }}>
              <h2 style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Endereços de Entrega
              </h2>
              <button
                onClick={() => onShowToast && onShowToast('📍 Formulário de novo endereço adicionado!')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#EFF6FF',
                  color: '#001FD8',
                  border: '1px solid #BFDBFE',
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} />
                <span>Adicionar Endereço</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0.85rem' : '1.25rem' }}>
              {/* Endereço Principal */}
              <div style={{ border: '2px solid #001FD8', borderRadius: '16px', padding: '1.15rem', position: 'relative' }}>
                <span style={{ backgroundColor: '#001FD8', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '999px', position: 'absolute', top: '12px', right: '12px' }}>
                  Principal
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={18} color="#001FD8" />
                  <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>Casa (São Paulo)</strong>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Av. Paulista, 1578, Apto 82<br />
                  Bela Vista — São Paulo, SP<br />
                  CEP: 01310-200
                </div>
              </div>

              {/* Endereço Secundário */}
              <div style={{ border: '1px solid #CBD5E1', borderRadius: '16px', padding: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={18} color="#64748B" />
                  <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>Trabalho (Jardins)</strong>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Rua Oscar Freire, 920, Conjunto 41<br />
                  Cerqueira César — São Paulo, SP<br />
                  CEP: 01426-000
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            CONTEÚDO DA ABA 4: CARTÕES & CARTEIRA
            ==================================================================== */}
        {activeTab === 'payments' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: isMobile ? '16px' : '20px', padding: isMobile ? '1.25rem 1rem' : '2rem', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem' }}>
              Formas de Pagamento Salvas
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0.85rem' : '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC' }}>Mastercard Black</span>
                  <CreditCard size={22} color="#FDE047" />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 700 }}>•••• •••• •••• 4821</div>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.35rem' }}>Expira em 08/29 • RAFAELLA GUEDES</div>
                </div>
              </div>

              <div style={{ border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => onShowToast && onShowToast('💳 Adicionar novo cartão')}
              >
                <Plus size={26} color="#001FD8" />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#001FD8', marginTop: '0.4rem' }}>
                  Cadastrar Novo Cartão
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Crédito ou Débito Seguro</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            CONTEÚDO DA ABA 5: RECEITAS MÉDICAS
            ==================================================================== */}
        {activeTab === 'prescriptions' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: isMobile ? '16px' : '20px', padding: isMobile ? '1.25rem 1rem' : '2rem', border: '1px solid #E2E8F0' }}>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'stretch' : 'center',
              gap: isMobile ? '0.75rem' : '1.5rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <h2 style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Minhas Receitas Médicas Salvas
                </h2>
                <p style={{ fontSize: isMobile ? '0.78rem' : '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                  Envie sua receita para validação instantânea pela Farmacêutica IA e liberação de medicamentos.
                </p>
              </div>
              <button
                onClick={onOpenPrescriptionFlow}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  border: 'none',
                  flexShrink: 0
                }}
              >
                <Plus size={16} />
                <span>Enviar Nova Receita</span>
              </button>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: isMobile ? '1rem' : '1.25rem', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '0.75rem' : '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001FD8', flexShrink: 0 }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Receita Digital Certificada — Dr. Carlos Mendes</strong>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.15rem' }}>
                      Medicamentos: Losartana 50mg + Dipirona 500mg • Válida até 31/12/2026
                    </div>
                  </div>
                </div>
                <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                  Validada pela Farmacêutica
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            CONTEÚDO DA ABA 6: ALERTAS DE MEDICAMENTOS
            ==================================================================== */}
        {activeTab === 'alerts' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: isMobile ? '16px' : '20px', padding: isMobile ? '1.25rem 1rem' : '2rem', border: '1px solid #E2E8F0' }}>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'stretch' : 'center',
              gap: isMobile ? '0.75rem' : '1.5rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <h2 style={{ fontSize: isMobile ? '1.15rem' : '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Lembretes e Alertas de Horários
                </h2>
                <p style={{ fontSize: isMobile ? '0.78rem' : '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                  A FarmaViva envia notificações no WhatsApp e aplicativo para você nunca esquecer seus remédios.
                </p>
              </div>
              <button
                onClick={() => onShowToast && onShowToast('⏰ Novo alarme configurado para as 08:00h!')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  border: 'none',
                  flexShrink: 0
                }}
              >
                <Plus size={16} />
                <span>Novo Alarme</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0.85rem' : '1rem', border: '1px solid #E2E8F0', borderRadius: '14px', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Clock size={18} color="#001FD8" />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>Losartana Potássica 50mg — 1 Comprimido</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Todos os dias às 08:00 (Manhã em jejum)</div>
                  </div>
                </div>
                <span style={{ backgroundColor: '#EFF6FF', color: '#001FD8', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px', flexShrink: 0 }}>
                  Ativo
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0.85rem' : '1rem', border: '1px solid #E2E8F0', borderRadius: '14px', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Clock size={18} color="#001FD8" />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>Vitamina C 1g + Zinco — 1 Efervescente</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Após o almoço às 13:00</div>
                  </div>
                </div>
                <span style={{ backgroundColor: '#EFF6FF', color: '#001FD8', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '999px', flexShrink: 0 }}>
                  Ativo
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ====================================================================
          MODAL DE RASTREAMENTO DO PEDIDO
          ==================================================================== */}
      {selectedOrderForTracking && (
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
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#001FD8', textTransform: 'uppercase' }}>
                  Rastreamento em Tempo Real
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
                  Pedido #{selectedOrderForTracking.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                style={{ backgroundColor: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900 }}
              >
                ✕
              </button>
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Pedido Recebido e Pago</strong>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{selectedOrderForTracking.date} às {selectedOrderForTracking.time}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Separado pela Farmacêutica Responsável</strong>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Conferência de lote e validade concluída com selo ANVISA</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Saiu para Entrega Express</strong>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Motoboy FarmaViva em rota rápida</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#059669' }}>Entregue com Sucesso</strong>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Recebido na portaria: {selectedOrderForTracking.address}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              style={{
                width: '100%',
                backgroundColor: '#001FD8',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem',
                borderRadius: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Fechar Rastreamento
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE NOTA FISCAL (DANFE / NFE)
          ==================================================================== */}
      {selectedOrderForNFe && (
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
            maxWidth: '560px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={22} color="#001FD8" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  DANFE — Documento Auxiliar da NFe
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForNFe(null)}
                style={{ backgroundColor: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900 }}
              >
                ✕
              </button>
            </div>

            <div style={{ border: '1px solid #CBD5E1', borderRadius: '12px', padding: '1rem', backgroundColor: '#F8FAFC', fontSize: '0.82rem', lineHeight: 1.5 }}>
              <div><strong>EMPRESA:</strong> EMPREENDIMENTOS PAGUE MENOS S/A</div>
              <div><strong>CNPJ:</strong> 06.626.253/0001-51 • <strong>IE:</strong> 06.912.834-0</div>
              <div><strong>Nº DA NOTA:</strong> 000.418.912 — SÉRIE 1</div>
              <div><strong>CHAVE DE ACESSO:</strong> 3526 1006 6262 5300 0151 5500 1000 4189 1210 9482 1734</div>
              <div style={{ margin: '0.75rem 0', borderTop: '1px dashed #CBD5E1', paddingTop: '0.75rem' }}>
                <div><strong>DESTINATÁRIO:</strong> {formData.name}</div>
                <div><strong>CPF:</strong> {formData.cpf}</div>
                <div><strong>DATA DE EMISSÃO:</strong> {selectedOrderForNFe.date} {selectedOrderForNFe.time}</div>
              </div>
              <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '0.75rem' }}>
                <div style={{ fontWeight: 800, marginBottom: '0.4rem' }}>ITENS TRIBUTADOS:</div>
                {selectedOrderForNFe.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>{it.quantity}x {it.name.substring(0, 36)}...</span>
                    <strong>R$ {(it.price * it.quantity).toFixed(2).replace('.', ',')}</strong>
                  </div>
                ))}
              </div>
              <div style={{ margin: '0.75rem 0 0 0', borderTop: '2px solid #0F172A', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 900 }}>
                <span>VALOR TOTAL DA NOTA:</span>
                <span style={{ color: '#001FD8' }}>R$ {selectedOrderForNFe.total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={() => {
                  if (onShowToast) onShowToast('📄 PDF da Nota Fiscal baixado para o seu dispositivo!');
                  setSelectedOrderForNFe(null);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Baixar PDF da NFe
              </button>
              <button
                onClick={() => setSelectedOrderForNFe(null)}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
