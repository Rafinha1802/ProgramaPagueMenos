import React, { useState } from 'react';
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
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Award,
  LogOut,
  Building2,
  FileCheck2,
  ChevronRight
} from 'lucide-react';

export function MobileAuthScreen({
  userSession,
  onLogin,
  onRegister,
  onLogout,
  onBackToHome
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  // Preenchimento de teste rápido
  const handleFillTestData = (mode) => {
    setFormError(null);
    if (mode === 'login') {
      setLoginIdentifier('rafaella.guedes@email.com');
      setLoginPassword('FarmaViva@2026');
    } else {
      setRegName('Rafaella Guedes de Oliveira');
      setRegCpf('458.912.384-12');
      setRegEmail('rafaella.guedes@email.com');
      setRegPhone('(11) 98765-4321');
      setRegBirthDate('1994-08-15');
      setRegPassword('FarmaViva@2026');
    }
  };

  // Envio de Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!loginIdentifier.trim()) {
      setFormError('Informe seu CPF ou e-mail cadastrado.');
      return;
    }
    if (!loginPassword.trim()) {
      setFormError('Digite sua senha.');
      return;
    }

    const name = loginIdentifier.includes('@')
      ? loginIdentifier.split('@')[0].replace('.', ' ')
      : 'Rafaella Guedes';

    onLogin({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: loginIdentifier.includes('@') ? loginIdentifier : 'cliente@farmaviva.com.br',
      cpf: !loginIdentifier.includes('@') ? loginIdentifier : '458.***.***-12',
      phone: '(11) 98765-4321',
      isLoggedIn: true
    });

    setSuccessMsg('Login confirmado com sucesso!');
    setTimeout(() => {
      onBackToHome();
    }, 850);
  };

  // Envio de Cadastro
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!regName.trim() || regName.split(' ').length < 2) {
      setFormError('Informe seu nome e sobrenome completos.');
      return;
    }
    if (!regCpf || regCpf.length < 14) {
      setFormError('Informe um CPF válido para aplicar descontos PBM.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setFormError('Informe um e-mail válido.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setFormError('A senha deve ter pelo menos 6 dígitos.');
      return;
    }
    if (!acceptTerms) {
      setFormError('Concorde com os termos para continuar.');
      return;
    }

    onRegister({
      name: regName.trim(),
      email: regEmail.trim(),
      cpf: regCpf,
      phone: regPhone || '(11) 98765-4321',
      isLoggedIn: true
    });

    setSuccessMsg('Cadastro criado! Cupom R$ 15 OFF ativado!');
    setTimeout(() => {
      onBackToHome();
    }, 950);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#F8FAFC',
      position: 'relative',
      overflowY: 'auto'
    }}>

      {/* Header Superior do App */}
      <div style={{
        backgroundColor: '#001FD8',
        color: '#FFFFFF',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0, 31, 216, 0.25)'
      }}>
        <button
          type="button"
          onClick={onBackToHome}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          <span>Início</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '18px', height: '18px', backgroundColor: '#E30613', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 900, fontSize: '11px' }}>
            +
          </div>
          <span style={{ fontSize: '0.88rem', fontWeight: 900, letterSpacing: '-0.3px' }}>
            FarmaViva
          </span>
        </div>

        <div style={{ width: '40px' }} />
      </div>

      {/* Conteúdo com Scroll */}
      <div style={{ padding: '1rem', flex: 1, paddingBottom: '2.5rem' }}>

        {/* SE O USUÁRIO JÁ ESTIVER LOGADO NO APP */}
        {userSession?.isLoggedIn ? (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            {/* Card do Usuário Logado */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid #E2E8F0',
              padding: '1.15rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  {userSession.name?.charAt(0) || 'U'}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userSession.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.1rem' }}>
                    CPF: {userSession.cpf}
                  </div>
                  <span style={{
                    backgroundColor: '#DCFCE7',
                    color: '#059669',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    display: 'inline-block',
                    marginTop: '0.25rem'
                  }}>
                    Cliente Clube FarmaViva
                  </span>
                </div>
              </div>
            </div>

            {/* Atalhos Rápidos da Conta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Award size={20} color="#001FD8" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>Meus Pontos FarmaViva</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>1.450 Pontos (R$ 29,00 de desconto)</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#94A3B8" />
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <FileCheck2 size={20} color="#059669" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>Cofre de Receitas Digitais</div>
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>2 receitas validadas para compra</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#94A3B8" />
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Gift size={20} color="#E30613" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>Cupons Disponíveis</div>
                    <div style={{ fontSize: '0.72rem', color: '#E30613', fontWeight: 800 }}>BEMVINDO15 (R$ 15 OFF)</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={onBackToHome}
                style={{
                  width: '100%',
                  backgroundColor: '#001FD8',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 12px rgba(0, 31, 216, 0.3)'
                }}
              >
                <span>Ir para as Compras</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  width: '100%',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '0.7rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <LogOut size={15} />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        ) : (
          /* SE O USUÁRIO NÃO ESTIVER LOGADO NO APP */
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>

            {/* Banner de Boas-Vindas */}
            <div style={{
              background: 'linear-gradient(135deg, #001FD8 0%, #00126B 100%)',
              color: '#FFFFFF',
              borderRadius: '18px',
              padding: '1.25rem',
              marginBottom: '1rem',
              boxShadow: '0 6px 18px rgba(0, 31, 216, 0.2)'
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(255,255,255,0.18)', padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                <Sparkles size={11} color="#FDE047" />
                <span>Clube FarmaViva Sempre</span>
              </div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 900, lineHeight: 1.25, margin: '0 0 0.35rem 0' }}>
                Acesse sua conta ou cadastre-se grátis
              </h2>
              <p style={{ fontSize: '0.76rem', color: '#E2E8F0', margin: 0, lineHeight: 1.4 }}>
                Ative descontos de até 95% em genéricos e ganhe <strong>R$ 15 OFF na 1ª compra</strong>.
              </p>
            </div>

            {/* Abas [ Entrar ] vs [ Cadastrar ] */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#E2E8F0',
              borderRadius: '12px',
              padding: '0.2rem',
              marginBottom: '1rem'
            }}>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setFormError(null);
                }}
                style={{
                  padding: '0.55rem 0',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: authMode === 'login' ? '#FFFFFF' : 'transparent',
                  color: authMode === 'login' ? '#001FD8' : '#64748B',
                  fontWeight: authMode === 'login' ? 900 : 700,
                  fontSize: '0.82rem',
                  boxShadow: authMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setFormError(null);
                }}
                style={{
                  padding: '0.55rem 0',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: authMode === 'register' ? '#FFFFFF' : 'transparent',
                  color: authMode === 'register' ? '#001FD8' : '#64748B',
                  fontWeight: authMode === 'register' ? 900 : 700,
                  fontSize: '0.82rem',
                  boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Cadastrar
              </button>
            </div>

            {/* Alertas de Erro ou Sucesso */}
            {formError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '0.55rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                marginBottom: '0.85rem'
              }}>
                {formError}
              </div>
            )}

            {successMsg && (
              <div style={{
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#065F46',
                padding: '0.55rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle2 size={15} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Acesso Rápido Gov.br & Google */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <button
                type="button"
                onClick={() => handleFillTestData(authMode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
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
                  padding: '0.5rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontWeight: 900, color: '#EA4335' }}>G</span>
                <span>Google</span>
              </button>
            </div>

            {/* FORMULÁRIO A: LOGIN MOBILE */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #CBD5E1', padding: '0.2rem 0.65rem', display: 'flex', alignItems: 'center' }}>
                  <User size={16} color="#64748B" style={{ marginRight: '0.45rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="CPF ou e-mail"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '0.84rem',
                      color: '#0F172A',
                      padding: '0.5rem 0',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1.5px solid #CBD5E1', padding: '0.2rem 0.65rem', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} color="#64748B" style={{ marginRight: '0.45rem', flexShrink: 0 }} />
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
                      padding: '0.5rem 0',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Lembrar acesso</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Instruções de recuperação foram enviadas ao seu e-mail cadastrado.')}
                    style={{ background: 'none', border: 'none', color: '#001FD8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Esqueci a senha
                  </button>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#001FD8',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 3px 10px rgba(0, 31, 216, 0.35)',
                    marginTop: '0.25rem'
                  }}
                >
                  <span>Entrar na Minha Conta</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleFillTestData('login')}
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#001FD8',
                    border: '1px dashed #BFDBFE',
                    borderRadius: '10px',
                    padding: '0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✨ Preencher dados de teste rápido
                </button>
              </form>
            )}

            {/* FORMULÁRIO B: CADASTRO MOBILE */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.2rem' }}>
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rafaella Guedes de Oliveira"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.82rem',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.2rem' }}>
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
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.82rem',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.2rem' }}>
                      E-mail:
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.8rem',
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.2rem' }}>
                      WhatsApp:
                    </label>
                    <input
                      type="text"
                      placeholder="(11) 98765-4321"
                      value={regPhone}
                      onChange={(e) => setRegPhone(formatPhone(e.target.value))}
                      maxLength={15}
                      style={{
                        width: '100%',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.8rem',
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#334155', marginBottom: '0.2rem' }}>
                    Criar Senha:
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '0.15rem 0.65rem'
                  }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 dígitos"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '0.82rem',
                        color: '#0F172A',
                        padding: '0.45rem 0',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <input
                    type="checkbox"
                    id="mobTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    style={{ marginTop: '2px' }}
                  />
                  <label htmlFor="mobTerms" style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.3 }}>
                    Aceito os Termos da FarmaViva e tratamento de dados de saúde pela LGPD.
                  </label>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#E30613',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 3px 10px rgba(227, 6, 19, 0.35)',
                    marginTop: '0.25rem'
                  }}
                >
                  <Gift size={16} />
                  <span>Cadastrar e Ganhar R$ 15 OFF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillTestData('register')}
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#001FD8',
                    border: '1px dashed #BFDBFE',
                    borderRadius: '10px',
                    padding: '0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✨ Preencher dados de teste com 1 toque
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default MobileAuthScreen;
