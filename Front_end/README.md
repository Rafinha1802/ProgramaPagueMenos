# 💻 Pague Menos — Front_end (React 19 + Vite 8)

Módulo Frontend da plataforma **Pague Menos IA Commerce**, desenvolvido em **React 19**, **Vite 8** e estilizado com **CSS Vanilla** para máxima performance, fidelidade visual e zero dependências pesadas de estilização.

---

## 🚀 Como Executar Localmente

### Opção 1: Usando o Script da Pasta
Basta executar o script correspondente ao seu sistema operacional dentro desta pasta `Front_end`:
- **Windows:** Duplo clique em `start_frontend.bat`
- **Linux / macOS:** `./start_frontend.sh`

### Opção 2: Via Terminal (NPM)
```bash
# 1. Instalar dependências (caso ainda não tenha instalado)
npm install

# 2. Iniciar servidor Vite de desenvolvimento
npm run dev
```

A aplicação estará disponível em: **`http://localhost:5173`**

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento Vite na porta 5173 |
| `npm run build` | Compila o bundle de produção otimizado na pasta `dist/` |
| `npm run preview` | Pré-visualiza localmente o bundle de produção compilado |
| `npm run lint` | Executa o linter ultrarrápido Oxlint sobre o código-fonte |
| `npm run backend` | Atalho para inicializar o backend FastAPI a partir desta pasta |

---

## 📁 Estrutura de Pastas do Frontend

```
Front_end/
├── public/                     # Ativos públicos estáticos (imagens de produtos, logos, ícones)
│   ├── categories/             # Fotos das categorias principais
│   └── products/               # Fotos oficiais dos produtos
├── src/
│   ├── assets/                 # Imagens, logotipos em PNG e SVGs
│   ├── components/             # Componentes React da interface
│   │   ├── DesktopHomePage.jsx         # Página inicial com busca, vitrines e banners
│   │   ├── DesktopAiResponsePage.jsx   # Cesta de Compra Guiada com IA
│   │   ├── DesktopAuthPage.jsx         # Login, cadastro e autenticação segura
│   │   ├── DesktopCheckoutPage.jsx     # Checkout em 3 etapas com múltiplos pagamentos
│   │   ├── CameraCaptureModal.jsx      # Scanner de receitas e OCR com IA
│   │   ├── ChatbotWidget.jsx           # Sofia, a farmacêutica digital inteligente
│   │   ├── CartDrawer.jsx              # Gaveta lateral dinâmica do carrinho
│   │   ├── UserProfilePage.jsx         # Perfil, histórico de pedidos e cofre de receitas
│   │   └── Header.jsx / Footer.jsx     # Navegação superior e rodapé oficial
│   ├── data/                   # Presets de intenções e catálogo estático
│   ├── services/               # Conectores com a API e regras de negócio
│   │   ├── api.js                      # Cliente HTTP com proxy /api para o backend FastAPI
│   │   ├── aiCommerceEngine.js         # Motor local de intenções e orçamentos
│   │   ├── authService.js              # Gerenciamento de sessão, token JWT e perfil
│   │   └── imageAnalysisService.js     # Visão computacional com IA e OCR híbrido
│   ├── App.jsx                 # Roteamento de páginas e estado global
│   ├── index.css               # Design System completo (tipografia, tokens de cor, animações)
│   └── main.jsx                # Ponto de entrada do React 19
├── vite.config.js              # Configuração do Vite com proxy '/api' -> http://127.0.0.1:8000
└── package.json                # Dependências e scripts do Frontend
```

---

## ⚙️ Variáveis de Ambiente (.env)

O arquivo `.env.example` traz os padrões recomendados:
```env
# Em ambiente de desenvolvimento local, deixe vazio para usar o proxy automático do Vite ('/api')
VITE_API_URL=
```
Para deploys remotos (ex.: Vercel conectando ao Render/AWS), preencha `VITE_API_URL=https://seu-backend.onrender.com`.
