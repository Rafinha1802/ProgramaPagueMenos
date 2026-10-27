import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Gift,
  FileText,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Award,
  LogOut,
  Building2,
  FileCheck2,
  Package,
  X
} from 'lucide-react';
import { loginUser, registerUser } from '../services/authService';

export function DesktopAuthPage({
  initialMode = 'login',
  userSession,
  onLogin,
  onRegister,
  onLogout,
  onBackToStore,
  onOpenProfile
}) {
  const [authMode, setAuthMode] = useState(initialMode || 'login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sincroniza modo inicial quando prop mudar
  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  // Bloqueio rigoroso de scroll no body e suporte a tecla Esc
  useEffect(() => {
    document.body.classList.add('desktop-auth-active');
    document.documentElement.classList.add('desktop-auth-active');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onBackToStore) {
        onBackToStore();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('desktop-auth-active');
      document.documentElement.classList.remove('desktop-auth-active');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBackToStore]);

  // Campos do formulário de login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos do formulário de cadastro
  const [regName, setRegName] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [acceptMarketing, setAcceptMarketing] = useState(true);

  // Feedback de erro / sucesso
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Formatação de CPF: 000.000.000-00
  const formatCPF = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
  };

  // Formatação de Celular: (00) 00000-0000
  const formatPhone = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  // Preenchimento de teste rápido (1 clique)
  const handleFillTestData = (mode) => {
    setFormError(null);
    if (mode === 'login') {
      setLoginIdentifier('rafaella.guedes@email.com');
      setLoginPassword('PagueMenos@2026');
    } else {
      const rand = Math.floor(1000 + Math.random() * 9000);
      setRegName(`Cliente Teste ${rand}`);
      setRegCpf(`541.238.${rand.toString().slice(0, 3)}-99`);
      setRegEmail(`cliente${rand}@email.com`);
      setRegPhone('(11) 98765-4321');
      setRegBirthDate('1995-05-20');
      setRegPassword('PagueMenos@2026');
    }
  };

  // Envio de Login Real
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!loginIdentifier.trim()) {
      setFormError('Por favor, informe seu CPF ou e-mail.');
      return;
    }
    if (!loginPassword.trim()) {
      setFormError('Por favor, digite sua senha.');
      return;
    }

    const res = await loginUser({ identifier: loginIdentifier, password: loginPassword });
    if (!res.success) {
      setFormError(res.error);
      return;
    }

    if (onLogin) {
      onLogin(res.user);
    }

    setSuccessMsg(`Login realizado com sucesso! Bem-vindo(a) de volta, ${res.user.name.split(' ')[0]}.`);
    setTimeout(() => {
      onBackToStore();
    }, 700);
  };

  // Envio de Cadastro Real
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!regName.trim() || regName.split(' ').length < 2) {
      setFormError('Por favor, informe seu nome e sobrenome completos.');
      return;
    }
    if (!regCpf || regCpf.length < 14) {
      setFormError('Por favor, informe um CPF válido (11 dígitos).');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setFormError('Por favor, informe um e-mail válido.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setFormError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!acceptTerms) {
      setFormError('Você precisa concordar com os termos da LGPD para continuar.');
      return;
    }

    const res = await registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      cpf: regCpf,
      phone: regPhone || '(11) 98765-4321',
      birthDate: regBirthDate,
      password: regPassword
    });

    if (!res.success) {
      setFormError(res.error);
      return;
    }

    if (onRegister) {
      onRegister(res.user);
    }

    setSuccessMsg(`Cadastro criado com sucesso, ${res.user.name.split(' ')[0]}! Cupom de R$ 15 OFF ativado.`);
    setTimeout(() => {
      onBackToStore();
    }, 750);
  };

  return (
    <div
      id="desktop-auth-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        zIndex: 9000,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      }}
    >
      {/* SE O USUÁRIO JÁ ESTIVER LOGADO: TELA FIXA DE PERFIL / DASHBOARD */}
      {userSession?.isLoggedIn ? (
        <>
          {/* PAINEL ESQUERDO: PROGRAMA SEMPRE BEM */}
          <div
            style={{
              width: '40%',
              minWidth: '380px',
              maxWidth: '480px',
              height: '100vh',
              maxHeight: '100vh',
              overflow: 'hidden',
              background: 'linear-gradient(155deg, #001FD8 0%, #001254 100%)',
              color: '#FFFFFF',
              padding: '2.2rem 2.6rem 1.8rem 2.6rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
            {/* Glow decorativo de fundo */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(227, 6, 19, 0.35) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* BLOCO 1: CABEÇALHO COM LOGO E HERO DO USUÁRIO */}
            <div>
              {/* Logo Oficial em Cápsula Branca */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.45rem 1rem',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img
                    src="/paguemenos-logo.png"
                    alt="Pague Menos"
                    style={{ height: '30px', width: 'auto', display: 'block' }}
                  />
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.14)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#FFFFFF'
                  }}
                >
                  <Sparkles size={13} color="#FDE047" />
                  <span>Sempre Bem Fidelidade</span>
                </div>
              </div>

              <h1
                style={{
                  fontSize: '1.48rem',
                  fontWeight: 900,
                  lineHeight: 1.25,
                  letterSpacing: '-0.4px',
                  color: '#FFFFFF',
                  margin: '0 0 0.5rem 0'
                }}
              >
                Sua saúde com benefícios exclusivos ativados
              </h1>

              <p
                style={{
                  fontSize: '0.84rem',
                  color: '#CBD5E1',
                  lineHeight: 1.4,
                  margin: 0
                }}
              >
                Como cliente cadastrado, você tem descontos garantidos em genéricos, cofre de receitas validado e entregas express.
              </p>
            </div>

            {/* BLOCO 2: BENEFÍCIOS DO CLIENTE EM CARDS GLASSMORPHISM */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  icon: <Award size={18} color="#FDE047" />,
                  bg: 'rgba(253, 224, 71, 0.16)',
                  title: 'Clube Sempre Bem Diamante',
                  desc: 'Descontos de até 95% direto no balcão e no site.'
                },
                {
                  icon: <FileCheck2 size={18} color="#86EFAC" />,
                  bg: 'rgba(134, 239, 172, 0.16)',
                  title: 'Receitas Médicas Arquivadas',
                  desc: 'Recompras com 1 clique sem precisar enviar nova receita.'
                },
                {
                  icon: <Clock size={18} color="#93C5FD" />,
                  bg: 'rgba(147, 197, 253, 0.16)',
                  title: 'Retirada Express em 1 Hora',
                  desc: 'Mais de 1.600 farmácias disponíveis em todo o Brasil.'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '13px',
                    padding: '0.68rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: item.bg,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '0.5rem',
                      borderRadius: '10px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.12rem', lineHeight: 1.25 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BLOCO 3: MINI PAINEL DE DESTAQUES & RODAPÉ INSTITUCIONAL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.22)',
                  borderRadius: '12px',
                  padding: '0.55rem 0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF' }}>+1.600</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.08rem' }}>Lojas no Brasil</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FDE047' }}>24 Horas</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.08rem' }}>Farmacêutica IA</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#86EFAC' }}>45 Min</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.08rem' }}>Entrega Turbo</div>
                </div>
              </div>

              <div
                style={{
                  paddingTop: '0.55rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: '#CBD5E1'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={15} color="#86EFAC" />
                  <span>Ambiente Seguro • SSL 256 bits</span>
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>RDC 20/2011 ANVISA & LGPD</span>
              </div>
            </div>
          </div>

          {/* PAINEL DIREITO: RESUMO DA CONTA E AÇÕES */}
          <div
            style={{
              flex: 1,
              height: '100vh',
              maxHeight: '100vh',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Bar Fixa */}
            <div
              style={{
                flexShrink: 0,
                padding: '1.25rem 2.5rem 0.5rem 2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #F1F5F9'
              }}
            >
              <button
                type="button"
                onClick={onBackToStore}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#F8FAFC',
                  color: '#001FD8',
                  border: '1.5px solid #CBD5E1',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                <ArrowLeft size={16} />
                <span>Voltar para a farmácia</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: '#64748B', fontWeight: 700 }}>
                <ShieldCheck size={16} color="#059669" />
                <span>Ambiente Seguro • Minha Conta</span>
              </div>
            </div>

            {/* Conteúdo Centralizado Sem Scroll */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1.5rem 2.5rem',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Cabeçalho do Perfil */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1.15rem 1.4rem', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: '#001FD8',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      boxShadow: '0 4px 12px rgba(0, 31, 216, 0.25)',
                      flexShrink: 0
                    }}
                  >
                    {userSession.name?.charAt(0) || 'U'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                        {userSession.name}
                      </h2>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#059669', fontSize: '0.68rem', fontWeight: 800, padding: '0.12rem 0.5rem', borderRadius: '999px' }}>
                        Cliente Sempre Bem
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                      CPF: {userSession.cpf} • {userSession.email}
                    </div>
                  </div>
                </div>

                {/* 3 Cartões de Métricas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <Award size={16} color="#001FD8" />
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A' }}>Pontos Clube</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#001FD8', margin: '0.15rem 0' }}>
                      1.450 Pontos
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      R$ 29,00 OFF no carrinho.
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <FileCheck2 size={16} color="#059669" />
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A' }}>Cofre de Receitas</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', margin: '0.15rem 0' }}>
                      2 Validadas
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      Prontas para recompra.
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1.5px solid #E2E8F0', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      <Gift size={16} color="#E30613" />
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F172A' }}>Cupons Ativos</span>
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#E30613', margin: '0.15rem 0' }}>
                      BEMVINDO15
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      R$ 15 OFF acima de R$ 80.
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={onOpenProfile}
                    style={{
                      flex: 1,
                      backgroundColor: '#001FD8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0, 31, 216, 0.25)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0017A3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#001FD8'}
                  >
                    <Package size={16} />
                    <span>Ver Histórico de Pedidos</span>
                  </button>

                  <button
                    type="button"
                    onClick={onBackToStore}
                    style={{
                      flex: 1,
                      backgroundColor: '#EFF6FF',
                      color: '#001FD8',
                      border: '1.5px solid #BFDBFE',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                  >
                    <span>Continuar Comprando</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={onLogout}
                    style={{
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: '1.5px solid #FECACA',
                      borderRadius: '12px',
                      padding: '0.75rem 1.15rem',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* SE O USUÁRIO NÃO ESTIVER LOGADO: TELA SPLIT INTEGRADA EDGE-TO-EDGE FIXA SEM SCROLL */
        <>
          {/* COLUNA ESQUERDA: APRESENTAÇÃO INSTITUCIONAL E BENEFÍCIOS */}
          <div
            style={{
              width: '42%',
              minWidth: '400px',
              maxWidth: '520px',
              flex: '0 0 42%',
              height: '100vh',
              maxHeight: '100vh',
              overflow: 'hidden',
              background: 'linear-gradient(155deg, #001FD8 0%, #001254 100%)',
              color: '#FFFFFF',
              padding: '2.2rem 2.6rem 1.8rem 2.6rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
            {/* Glow decorativo suave */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(227, 6, 19, 0.35) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* BLOCO 1: CABEÇALHO COM LOGO E MENSAGEM HERO */}
            <div>
              {/* Logo Oficial em Cápsula Branca + Badge Farmácia Digital */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.45rem 1rem',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img
                    src="/paguemenos-logo.png"
                    alt="Pague Menos"
                    style={{ height: '30px', width: 'auto', display: 'block' }}
                  />
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.14)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#FFFFFF'
                  }}
                >
                  <Sparkles size={13} color="#FDE047" />
                  <span>Farmácia Digital Oficial</span>
                </div>
              </div>

              <h1
                style={{
                  fontSize: '1.48rem',
                  fontWeight: 900,
                  lineHeight: 1.25,
                  letterSpacing: '-0.4px',
                  color: '#FFFFFF',
                  margin: '0 0 0.5rem 0'
                }}
              >
                Tudo para sua saúde com economia e agilidade
              </h1>

              <p
                style={{
                  fontSize: '0.84rem',
                  color: '#CBD5E1',
                  lineHeight: 1.4,
                  margin: 0
                }}
              >
                Acesse sua conta para desbloquear preços de Clube e atendimento da nossa Farmacêutica IA 24 horas.
              </p>
            </div>

            {/* BLOCO 2: CARDS DOS 4 BENEFÍCIOS EXCLUSIVOS BEM DISTRIBUÍDOS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                {
                  icon: <Award size={18} color="#FDE047" />,
                  bg: 'rgba(253, 224, 71, 0.16)',
                  title: 'Descontos de até 95% em Genéricos',
                  desc: 'Preços subsidiados para medicamentos essenciais e convênios PBM.'
                },
                {
                  icon: <FileText size={18} color="#86EFAC" />,
                  bg: 'rgba(134, 239, 172, 0.16)',
                  title: 'Cofre de Receitas Médicas Digitais',
                  desc: 'Validação CRM e ANVISA para recompras com 1 clique.'
                },
                {
                  icon: <Clock size={18} color="#93C5FD" />,
                  bg: 'rgba(147, 197, 253, 0.16)',
                  title: 'Clique e Retire Express em 1h',
                  desc: 'Compre online e retire na loja mais próxima sem esperar em filas.'
                },
                {
                  icon: <Gift size={18} color="#FCA5A5" />,
                  bg: 'rgba(252, 165, 165, 0.16)',
                  title: 'Cupom de R$ 15 OFF na 1ª Compra',
                  desc: 'Ativação automática para novos clientes no checkout.'
                }
              ].map((benefit, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '13px',
                    padding: '0.62rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: benefit.bg,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '0.45rem',
                      borderRadius: '10px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {benefit.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25 }}>
                      {benefit.title}
                    </div>
                    <div style={{ fontSize: '0.71rem', color: '#CBD5E1', marginTop: '0.12rem', lineHeight: 1.25 }}>
                      {benefit.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BLOCO 3: NÚMEROS DE CONFIANÇA E RODAPÉ INSTITUCIONAL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Mini-Painel de Destaques de Confiança */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.22)',
                  borderRadius: '12px',
                  padding: '0.55rem 0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FFFFFF' }}>+1.600</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.08rem' }}>Lojas no Brasil</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#FDE047' }}>24 Horas</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.08rem' }}>Farmacêutica IA</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#86EFAC' }}>45 Min</div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.08rem' }}>Entrega Turbo</div>
                </div>
              </div>

              {/* Rodapé Institucional com Selos */}
              <div
                style={{
                  paddingTop: '0.55rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  color: '#CBD5E1'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={15} color="#86EFAC" />
                  <span>Ambiente Seguro • SSL 256 bits</span>
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>RDC 20/2011 ANVISA & LGPD</span>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: TELA INTEGRADA COM FORMULÁRIOS FIXOS */}
          <div
            style={{
              flex: 1,
              height: '100vh',
              maxHeight: '100vh',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}
          >
            {/* Barra Superior da Tela Fixa */}
            <div
              style={{
                flexShrink: 0,
                padding: '1.15rem 2.5rem 0.5rem 2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #F1F5F9'
              }}
            >
              <button
                type="button"
                onClick={onBackToStore}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#F8FAFC',
                  color: '#001FD8',
                  border: '1.5px solid #CBD5E1',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                <ArrowLeft size={16} />
                <span>Voltar para a farmácia</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: '#64748B', fontWeight: 700 }}>
                <ShieldCheck size={16} color="#059669" />
                <span>Ambiente Seguro • SSL 256 bits</span>
              </div>
            </div>

            {/* Área Central dos Formulários (Totalmente Fixa e sem Scroll) */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0.75rem 2.5rem 1.25rem 2.5rem',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '470px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Seletor de Abas: [ Entrar na Conta ] vs [ Criar Cadastro Grátis ] */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '12px',
                    padding: '0.22rem',
                    marginBottom: '0.65rem'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setFormError(null);
                    }}
                    style={{
                      padding: '0.48rem 0',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: authMode === 'login' ? '#FFFFFF' : 'transparent',
                      color: authMode === 'login' ? '#001FD8' : '#64748B',
                      fontWeight: authMode === 'login' ? 900 : 700,
                      fontSize: '0.84rem',
                      boxShadow: authMode === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Entrar na Conta
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setFormError(null);
                    }}
                    style={{
                      padding: '0.48rem 0',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: authMode === 'register' ? '#FFFFFF' : 'transparent',
                      color: authMode === 'register' ? '#001FD8' : '#64748B',
                      fontWeight: authMode === 'register' ? 900 : 700,
                      fontSize: '0.84rem',
                      boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Criar Cadastro Grátis
                  </button>
                </div>

                {/* Mensagens de Feedback */}
                {formError && (
                  <div
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      color: '#DC2626',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      marginBottom: '0.55rem',
                      animation: 'fadeIn 0.15s ease-out'
                    }}
                  >
                    {formError}
                  </div>
                )}

                {successMsg && (
                  <div
                    style={{
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                      color: '#065F46',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      marginBottom: '0.55rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      animation: 'fadeIn 0.15s ease-out'
                    }}
                  >
                    <CheckCircle2 size={15} />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Opções de Login Social */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', marginBottom: '0.55rem' }}>
                  <button
                    type="button"
                    onClick={() => handleFillTestData(authMode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.44rem 0.65rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                    title="Acesso com conta Gov.br (prescrições digitais)"
                  >
                    <Building2 size={15} color="#001FD8" />
                    <span>Conta Gov.br</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillTestData(authMode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.44rem 0.65rem',
                      borderRadius: '10px',
                      border: '1.5px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                    title="Acesso rápido com Google"
                  >
                    <span style={{ fontWeight: 900, color: '#EA4335', fontSize: '0.85rem' }}>G</span>
                    <span>Google</span>
                  </button>
                </div>

                {/* Divisor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.55rem' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                  <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    {authMode === 'login' ? 'ou acesse com seus dados' : 'ou cadastre com seus dados'}
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                </div>

                {/* FORMULÁRIO A: LOGIN */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '0.22rem' }}>
                        CPF ou E-mail:
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#F8FAFC',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '10px',
                          padding: '0.15rem 0.75rem'
                        }}
                      >
                        <User size={15} color="#64748B" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
                        <input
                          type="text"
                          placeholder="Ex: 458.912.384-12 ou seu e-mail"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '0.86rem',
                            color: '#0F172A',
                            padding: '0.45rem 0',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.22rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155' }}>
                          Senha:
                        </label>
                        <button
                          type="button"
                          onClick={() => alert('Enviamos instruções de redefinição de senha para o seu e-mail cadastrado.')}
                          style={{ background: 'none', border: 'none', color: '#001FD8', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Esqueci minha senha
                        </button>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#F8FAFC',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '10px',
                          padding: '0.15rem 0.75rem'
                        }}
                      >
                        <Lock size={15} color="#64748B" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Digite sua senha"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '0.86rem',
                            color: '#0F172A',
                            padding: '0.45rem 0',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', margin: '0.1rem 0' }}>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                      />
                      <label htmlFor="rememberMe" style={{ fontSize: '0.75rem', color: '#475569', cursor: 'pointer' }}>
                        Lembrar meu acesso neste computador
                      </label>
                    </div>

                    {/* Botão de Envio de Login */}
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#001FD8',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.7rem',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 14px rgba(0, 31, 216, 0.3)',
                        transition: 'background 0.15s ease',
                        marginTop: '0.15rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0017A3'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#001FD8'}
                    >
                      <span>Entrar na Minha Conta</span>
                      <ArrowRight size={17} />
                    </button>

                    {/* Botão Rápido de Preenchimento para Teste */}
                    <button
                      type="button"
                      onClick={() => handleFillTestData('login')}
                      style={{
                        backgroundColor: '#EFF6FF',
                        color: '#001FD8',
                        border: '1px dashed #BFDBFE',
                        borderRadius: '10px',
                        padding: '0.44rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                    >
                      ✨ Preencher dados de teste rápido
                    </button>
                  </form>
                )}

                {/* FORMULÁRIO B: CADASTRO COMPLETO (COMPACTO E SEM SCROLL) */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
                        Nome Completo:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Rafaella Guedes de Oliveira"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#F8FAFC',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '9px',
                          padding: '0.4rem 0.7rem',
                          fontSize: '0.84rem',
                          color: '#0F172A',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
                          CPF <span style={{ color: '#001FD8' }}>(p/ descontos)</span>:
                        </label>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={regCpf}
                          onChange={(e) => setRegCpf(formatCPF(e.target.value))}
                          maxLength={14}
                          style={{
                            width: '100%',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '9px',
                            padding: '0.4rem 0.7rem',
                            fontSize: '0.84rem',
                            color: '#0F172A',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
                          Data de Nascimento:
                        </label>
                        <input
                          type="date"
                          value={regBirthDate}
                          onChange={(e) => setRegBirthDate(e.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '9px',
                            padding: '0.36rem 0.55rem',
                            fontSize: '0.8rem',
                            color: '#0F172A',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
                          E-mail:
                        </label>
                        <input
                          type="email"
                          placeholder="seu@email.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '9px',
                            padding: '0.4rem 0.7rem',
                            fontSize: '0.84rem',
                            color: '#0F172A',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
                          Celular / WhatsApp:
                        </label>
                        <input
                          type="text"
                          placeholder="(11) 98765-4321"
                          value={regPhone}
                          onChange={(e) => setRegPhone(formatPhone(e.target.value))}
                          maxLength={15}
                          style={{
                            width: '100%',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '9px',
                            padding: '0.4rem 0.7rem',
                            fontSize: '0.84rem',
                            color: '#0F172A',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.73rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
                        Crie uma Senha:
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#F8FAFC',
                          border: '1.5px solid #CBD5E1',
                          borderRadius: '9px',
                          padding: '0.15rem 0.7rem',
                          boxSizing: 'border-box'
                        }}
                      >
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo de 6 caracteres"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '0.84rem',
                            color: '#0F172A',
                            padding: '0.4rem 0',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.15rem' }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Termos e Consentimentos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <input
                          type="checkbox"
                          id="terms"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          style={{ marginTop: '2px', cursor: 'pointer', width: '14px', height: '14px' }}
                        />
                        <label htmlFor="terms" style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.25, cursor: 'pointer' }}>
                          Concordo com os <strong>Termos de Uso</strong> e proteção de dados da <strong>LGPD</strong>.
                        </label>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <input
                          type="checkbox"
                          id="marketing"
                          checked={acceptMarketing}
                          onChange={(e) => setAcceptMarketing(e.target.checked)}
                          style={{ marginTop: '2px', cursor: 'pointer', width: '14px', height: '14px' }}
                        />
                        <label htmlFor="marketing" style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.25, cursor: 'pointer' }}>
                          Quero receber lembretes de reposição de remédios e cupons via WhatsApp.
                        </label>
                      </div>
                    </div>

                    {/* Botão de Finalizar Cadastro */}
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#E30613',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.68rem',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 14px rgba(227, 6, 19, 0.3)',
                        marginTop: '0.15rem',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C70510'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E30613'}
                    >
                      <Gift size={16} />
                      <span>Criar Cadastro e Ganhar R$ 15 OFF</span>
                    </button>

                    {/* Botão Rápido de Preenchimento para Teste */}
                    <button
                      type="button"
                      onClick={() => handleFillTestData('register')}
                      style={{
                        backgroundColor: '#EFF6FF',
                        color: '#001FD8',
                        border: '1px dashed #BFDBFE',
                        borderRadius: '10px',
                        padding: '0.36rem',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                    >
                      ✨ Preencher formulário de teste com 1 clique
                    </button>
                  </form>
                )}

                {/* Nota de Segurança e Privacidade no Rodapé */}
                <div style={{ textAlign: 'center', marginTop: '0.65rem', fontSize: '0.68rem', color: '#94A3B8' }}>
                  🔒 Seus dados cadastrais estão 100% protegidos pela criptografia da Pague Menos.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DesktopAuthPage;
