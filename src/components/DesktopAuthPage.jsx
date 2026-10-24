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
      setRegName('Rafaella Guedes de Oliveira');
      setRegCpf('458.912.384-12');
      setRegEmail('rafaella.guedes@email.com');
      setRegPhone('(11) 98765-4321');
      setRegBirthDate('1994-08-15');
      setRegPassword('PagueMenos@2026');
    }
  };

  // Envio de Login
  const handleLoginSubmit = (e) => {
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

    const name = loginIdentifier.includes('@')
      ? loginIdentifier.split('@')[0].replace('.', ' ')
      : 'Rafaella Guedes';

    onLogin({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: loginIdentifier.includes('@') ? loginIdentifier : 'cliente@paguemenos.com.br',
      cpf: !loginIdentifier.includes('@') ? loginIdentifier : '458.***.***-12',
      phone: '(11) 98765-4321',
      isLoggedIn: true
    });

    setSuccessMsg('Login realizado com sucesso! Redirecionando...');
    setTimeout(() => {
      onBackToStore();
    }, 850);
  };

  // Envio de Cadastro
  const handleRegisterSubmit = (e) => {
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

    onRegister({
      name: regName.trim(),
      email: regEmail.trim(),
      cpf: regCpf,
      phone: regPhone || '(11) 98765-4321',
      isLoggedIn: true
    });

    setSuccessMsg('Cadastro criado com sucesso! R$ 15 OFF ativado na sua conta.');
    setTimeout(() => {
      onBackToStore();
    }, 950);
  };

  return (
    <div
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
        backgroundColor: '#F8FAFC',
        backgroundImage: 'radial-gradient(circle at 10% 15%, rgba(0, 31, 216, 0.04) 0%, transparent 45%), radial-gradient(circle at 90% 85%, rgba(227, 6, 19, 0.035) 0%, transparent 45%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3.4rem 1.25rem 1rem 1.25rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Barra Superior Compacta: Voltar, Logo Pague Menos e Ambiente Seguro */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.65rem',
            flexShrink: 0
          }}
        >
          {/* Botão Voltar */}
          <button
            type="button"
            onClick={onBackToStore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFFFFF',
              color: '#001FD8',
              border: '1.5px solid #CBD5E1',
              padding: '0.42rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EFF6FF';
              e.currentTarget.style.borderColor = '#93C5FD';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
          >
            <ArrowLeft size={15} />
            <span>Voltar para a farmácia</span>
          </button>

          {/* Logo Oficial Pague Menos */}
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onBackToStore} title="Pague Menos">
            <img
              src="/paguemenos-logo.png"
              alt="Pague Menos"
              style={{
                height: '34px',
                width: 'auto',
                maxWidth: '140px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          {/* Ambiente Seguro & Botão Fechar X */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#64748B' }}>
              <ShieldCheck size={15} color="#059669" />
              <span>Ambiente Seguro • SSL 256 bits</span>
            </div>

            <button
              type="button"
              onClick={onBackToStore}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#64748B';
              }}
              title="Fechar (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* SE O USUÁRIO JÁ ESTIVER LOGADO: DASHBOARD COMPACTO DA CONTA */}
        {userSession?.isLoggedIn ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '22px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 12px 30px rgba(0, 31, 216, 0.08)',
              padding: '1.75rem 2rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  boxShadow: '0 4px 12px rgba(0, 31, 216, 0.25)'
                }}>
                  {userSession.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      {userSession.name}
                    </h2>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#059669', fontSize: '0.68rem', fontWeight: 800, padding: '0.12rem 0.5rem', borderRadius: '999px' }}>
                      Cliente Sempre Bem Pague Menos
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                    CPF: {userSession.cpf} • {userSession.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={onOpenProfile}
                  style={{
                    backgroundColor: '#001FD8',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 10px rgba(0, 31, 216, 0.25)'
                  }}
                >
                  <Package size={15} />
                  <span>Ver Histórico de Pedidos</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToStore}
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#001FD8',
                    border: '1px solid #BFDBFE',
                    borderRadius: '10px',
                    padding: '0.55rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>Continuar Comprando</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    borderRadius: '10px',
                    padding: '0.55rem 0.9rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <LogOut size={15} />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>

            {/* Grid de Benefícios e Atalhos Ativos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Award size={18} color="#001FD8" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>Pontos & Descontos</span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#001FD8', margin: '0.2rem 0' }}>
                  1.450 Pontos
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Equivalem a <strong>R$ 29,00 OFF</strong> no carrinho.
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <FileCheck2 size={18} color="#059669" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>Receitas no Cofre</span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669', margin: '0.2rem 0' }}>
                  2 Validadas
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Amoxicilina e Clonazepam prontas para recompra.
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Gift size={18} color="#E30613" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A' }}>Cupons Ativos</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#E30613', margin: '0.2rem 0' }}>
                  BEMVINDO15 (R$ 15 OFF)
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Válido para qualquer compra acima de R$ 80 hoje.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SE O USUÁRIO NÃO ESTIVER LOGADO: TELA SPLIT FIXADA SEM SCROLLBAR */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.25fr',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(0, 31, 216, 0.10), 0 2px 10px rgba(0,0,0,0.04)',
              border: '1.5px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box'
            }}
          >
            {/* COLUNA ESQUERDA: APRESENTAÇÃO E BENEFÍCIOS */}
            <div
              style={{
                background: 'linear-gradient(145deg, #001FD8 0%, #001254 100%)',
                color: '#FFFFFF',
                padding: '1.4rem 1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Glow decorativo sutil */}
              <div
                style={{
                  position: 'absolute',
                  top: '-35px',
                  right: '-35px',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(227, 6, 19, 0.35) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
              />

              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: '0.22rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    marginBottom: '0.65rem'
                  }}
                >
                  <Sparkles size={12} color="#FDE047" />
                  <span>Farmácia Digital Pague Menos</span>
                </div>

                <h1
                  style={{
                    fontSize: '1.38rem',
                    fontWeight: 900,
                    lineHeight: 1.22,
                    letterSpacing: '-0.4px',
                    marginBottom: '0.35rem'
                  }}
                >
                  Tudo para sua saúde com economia e agilidade
                </h1>

                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#CBD5E1',
                    lineHeight: 1.35,
                    marginBottom: '0.9rem'
                  }}
                >
                  Acesse sua conta para desbloquear preços de Clube e atendimento da nossa Farmacêutica IA.
                </p>

                {/* 4 Benefícios */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {[
                    {
                      icon: <Award size={15} color="#FDE047" />,
                      title: 'Descontos de até 95% em Genéricos',
                      desc: 'Preços subsidiados para medicamentos essenciais e convênios PBM.'
                    },
                    {
                      icon: <FileText size={15} color="#86EFAC" />,
                      title: 'Cofre de Receitas Médicas Digitais',
                      desc: 'Validação CRM e ANVISA para recompras com 1 clique.'
                    },
                    {
                      icon: <Clock size={15} color="#93C5FD" />,
                      title: 'Clique e Retire Express em 1h',
                      desc: 'Compre online e retire na loja mais próxima sem esperar em filas.'
                    },
                    {
                      icon: <Gift size={15} color="#FCA5A5" />,
                      title: 'Cupom de R$ 15 OFF na 1ª Compra',
                      desc: 'Ativação automática para novos clientes no checkout.'
                    }
                  ].map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          padding: '0.4rem',
                          borderRadius: '8px',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {benefit.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                          {benefit.title}
                        </div>
                        <div style={{ fontSize: '0.69rem', color: '#94A3B8', marginTop: '0.08rem', lineHeight: 1.2 }}>
                          {benefit.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rodapé da Coluna Esquerda */}
              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.55rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.68rem',
                  color: '#CBD5E1'
                }}
              >
                <ShieldCheck size={14} color="#86EFAC" />
                <span>Em conformidade com a RDC 20/2011 da ANVISA e LGPD.</span>
              </div>
            </div>

            {/* COLUNA DIREITA: FORMULÁRIO DE LOGIN OU CADASTRO */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.25rem 1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxSizing: 'border-box'
              }}
            >
              {/* Seletor de Abas: [ Entrar na Conta ] vs [ Criar Cadastro Grátis ] */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '12px',
                  padding: '0.2rem',
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
                    padding: '0.45rem 0',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: authMode === 'login' ? '#FFFFFF' : 'transparent',
                    color: authMode === 'login' ? '#001FD8' : '#64748B',
                    fontWeight: authMode === 'login' ? 900 : 700,
                    fontSize: '0.82rem',
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
                    padding: '0.45rem 0',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: authMode === 'register' ? '#FFFFFF' : 'transparent',
                    color: authMode === 'register' ? '#001FD8' : '#64748B',
                    fontWeight: authMode === 'register' ? 900 : 700,
                    fontSize: '0.82rem',
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
                    padding: '0.45rem 0.65rem',
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
                    padding: '0.45rem 0.65rem',
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
                    gap: '0.35rem',
                    padding: '0.42rem 0.65rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  title="Acesso com conta Gov.br (prescrições digitais)"
                >
                  <Building2 size={14} color="#001FD8" />
                  <span>Conta Gov.br</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillTestData(authMode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    padding: '0.42rem 0.65rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  title="Acesso rápido com Google"
                >
                  <span style={{ fontWeight: 900, color: '#EA4335' }}>G</span>
                  <span>Google</span>
                </button>
              </div>

              {/* Divisor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.55rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                <span style={{ fontSize: '0.67rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                  {authMode === 'login' ? 'ou acesse com seus dados' : 'ou cadastre com seus dados'}
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              </div>

              {/* FORMULÁRIO A: LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#334155', marginBottom: '0.2rem' }}>
                      CPF ou E-mail:
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '0.15rem 0.65rem'
                      }}
                    >
                      <User size={15} color="#64748B" style={{ marginRight: '0.45rem', flexShrink: 0 }} />
                      <input
                        type="text"
                        placeholder="Ex: 458.912.384-12 ou seu e-mail"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          backgroundColor: 'transparent',
                          fontSize: '0.84rem',
                          color: '#0F172A',
                          padding: '0.42rem 0',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155' }}>
                        Senha:
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Enviamos instruções de redefinição de senha para o seu e-mail cadastrado.')}
                        style={{ background: 'none', border: 'none', color: '#001FD8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
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
                        padding: '0.15rem 0.65rem'
                      }}
                    >
                      <Lock size={15} color="#64748B" style={{ marginRight: '0.45rem', flexShrink: 0 }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          backgroundColor: 'transparent',
                          fontSize: '0.84rem',
                          color: '#0F172A',
                          padding: '0.42rem 0',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.15rem' }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.1rem 0' }}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="rememberMe" style={{ fontSize: '0.74rem', color: '#475569', cursor: 'pointer' }}>
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
                      padding: '0.65rem',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 4px 12px rgba(0, 31, 216, 0.3)',
                      transition: 'transform 0.1s ease',
                      marginTop: '0.15rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0017A3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#001FD8'}
                  >
                    <span>Entrar na Minha Conta</span>
                    <ArrowRight size={16} />
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
                      padding: '0.42rem',
                      fontSize: '0.74rem',
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

              {/* FORMULÁRIO B: CADASTRO COMPLETO */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
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
                        padding: '0.38rem 0.65rem',
                        fontSize: '0.82rem',
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
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
                          padding: '0.38rem 0.65rem',
                          fontSize: '0.82rem',
                          color: '#0F172A',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
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
                          padding: '0.35rem 0.55rem',
                          fontSize: '0.78rem',
                          color: '#0F172A',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
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
                          padding: '0.38rem 0.65rem',
                          fontSize: '0.82rem',
                          color: '#0F172A',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
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
                          padding: '0.38rem 0.65rem',
                          fontSize: '0.82rem',
                          color: '#0F172A',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.15rem' }}>
                      Crie uma Senha:
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '0.15rem 0.65rem'
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
                          fontSize: '0.82rem',
                          color: '#0F172A',
                          padding: '0.38rem 0',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.15rem' }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Termos e Consentimentos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        style={{ marginTop: '2px', cursor: 'pointer' }}
                      />
                      <label htmlFor="terms" style={{ fontSize: '0.69rem', color: '#475569', lineHeight: 1.25, cursor: 'pointer' }}>
                        Concordo com os <strong>Termos de Uso</strong> e proteção de dados da <strong>LGPD</strong>.
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                      <input
                        type="checkbox"
                        id="marketing"
                        checked={acceptMarketing}
                        onChange={(e) => setAcceptMarketing(e.target.checked)}
                        style={{ marginTop: '2px', cursor: 'pointer' }}
                      />
                      <label htmlFor="marketing" style={{ fontSize: '0.69rem', color: '#475569', lineHeight: 1.25, cursor: 'pointer' }}>
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
                      padding: '0.65rem',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 4px 12px rgba(227, 6, 19, 0.3)',
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
                      padding: '0.35rem',
                      fontSize: '0.72rem',
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesktopAuthPage;
