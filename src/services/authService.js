// Serviço de Autenticação e Persistência de Usuários Integrado ao back_PagueMenos
import { loginBackend, registerBackend, logoutBackend } from './api';

const USERS_STORAGE_KEY = 'paguemenos_registered_users';
const SESSION_STORAGE_KEY = 'paguemenos_session';

// Usuários padrão pré-cadastrados para contingência imediata
const DEFAULT_USERS = [
  {
    id: 'user_1',
    name: 'Rafaella Guedes',
    email: 'rafaella.guedes@email.com',
    cpf: '458.912.384-12',
    phone: '(11) 98765-4321',
    birthDate: '1994-08-15',
    password: 'PagueMenos@2026',
    token: 'pm_token_user_1_demo',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

// Obtém lista de usuários registrados
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch (err) {
    console.error('Erro ao ler usuários:', err);
    return DEFAULT_USERS;
  }
}

// Salva lista de usuários no cache local
function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Erro ao salvar usuários:', err);
  }
}

// Obtém a sessão ativa
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      const defaultUser = DEFAULT_USERS[0];
      const defaultSession = {
        isLoggedIn: true,
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email,
        cpf: defaultUser.cpf,
        phone: defaultUser.phone,
        token: defaultUser.token || 'pm_token_user_1_demo'
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(defaultSession));
      return defaultSession;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (err) {
    console.error('Erro ao ler sessão:', err);
    return null;
  }
}

// Salva a sessão ativa
export function saveStoredSession(session) {
  try {
    if (!session || !session.isLoggedIn) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error('Erro ao salvar sessão:', err);
  }
}

// Limpa pontuação do CPF para comparação
function cleanCpf(cpf) {
  return (cpf || '').replace(/\D/g, '');
}

// Realiza Login Real integrado com o back_PagueMenos
export async function loginUser({ identifier, password }) {
  // 1. Tenta autenticação real no backend
  try {
    const res = await loginBackend({ identifier, password });
    if (res && res.success && res.user) {
      const session = {
        isLoggedIn: true,
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        cpf: res.user.cpf,
        phone: res.user.phone || '(11) 98765-4321',
        token: res.user.token
      };
      saveStoredSession(session);
      return { success: true, user: session };
    }
    if (res && res.error) {
      return { success: false, error: res.error };
    }
  } catch (err) {
    console.warn('Backend indisponível, usando fallback local de login:', err);
  }

  // 2. Fallback de contingência local
  const users = getRegisteredUsers();
  const idLower = (identifier || '').trim().toLowerCase();
  const idCpf = cleanCpf(identifier);

  const matchedUser = users.find((u) => {
    const emailMatch = (u.email || '').toLowerCase() === idLower;
    const cpfMatch = idCpf.length >= 8 && cleanCpf(u.cpf) === idCpf;
    return emailMatch || cpfMatch;
  });

  if (!matchedUser) {
    return {
      success: false,
      error: 'CPF ou E-mail não encontrado. Verifique os dados ou crie seu cadastro.'
    };
  }

  if (matchedUser.password && matchedUser.password !== password) {
    return {
      success: false,
      error: 'Senha incorreta. Por favor, verifique e tente novamente.'
    };
  }

  const session = {
    isLoggedIn: true,
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    cpf: matchedUser.cpf,
    phone: matchedUser.phone || '(11) 98765-4321'
  };

  saveStoredSession(session);
  return {
    success: true,
    user: session
  };
}

// Realiza Cadastro Real integrado com o back_PagueMenos
export async function registerUser({ name, email, cpf, phone, birthDate, password }) {
  // 1. Tenta cadastro real no backend
  try {
    const res = await registerBackend({ name, email, cpf, phone, birthDate, password });
    if (res && res.success && res.user) {
      const session = {
        isLoggedIn: true,
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        cpf: res.user.cpf,
        phone: res.user.phone,
        token: res.user.token
      };
      saveStoredSession(session);
      return { success: true, user: session };
    }
    if (res && res.error) {
      return { success: false, error: res.error };
    }
  } catch (err) {
    console.warn('Backend indisponível, usando fallback local de cadastro:', err);
  }

  // 2. Fallback local
  const users = getRegisteredUsers();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanNewCpf = cleanCpf(cpf);

  const existingEmail = users.find((u) => (u.email || '').toLowerCase() === cleanEmail);
  if (existingEmail) {
    return {
      success: false,
      error: 'Este e-mail já possui cadastro na Pague Menos. Faça login para continuar.'
    };
  }

  const existingCpf = users.find((u) => cleanCpf(u.cpf) === cleanNewCpf);
  if (existingCpf) {
    return {
      success: false,
      error: 'Este CPF já está cadastrado. Faça login com seu e-mail ou CPF.'
    };
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name: (name || '').trim(),
    email: cleanEmail,
    cpf: cpf.trim(),
    phone: phone ? phone.trim() : '(11) 98765-4321',
    birthDate: birthDate || '',
    password: password || '123456',
    createdAt: new Date().toISOString()
  };

  const updatedUsers = [...users, newUser];
  saveRegisteredUsers(updatedUsers);

  const session = {
    isLoggedIn: true,
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    cpf: newUser.cpf,
    phone: newUser.phone
  };

  saveStoredSession(session);
  return {
    success: true,
    user: session
  };
}

// Realiza Logout Real integrado com o back_PagueMenos
export async function logoutUser(userId = null) {
  try {
    await logoutBackend(userId);
  } catch (err) {
    console.warn('Erro ao notificar logout no backend:', err);
  }
  saveStoredSession(null);
  return {
    isLoggedIn: false,
    id: null,
    name: '',
    email: '',
    cpf: '',
    phone: ''
  };
}
