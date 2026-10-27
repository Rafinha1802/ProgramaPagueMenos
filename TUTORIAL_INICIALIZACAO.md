# 🚀 Guia Completo e Detalhado de Inicialização — Pague Menos IA Commerce (Monorepo)

Este guia fornece instruções passo a passo para inicializar o **Frontend** (React 19 + Vite 8) e o **Backend** (FastAPI + Python 3.11) no repositório **Monorepo**, seja através de **scripts automatizados em 1 clique** ou **manualmente terminal por terminal**, 100% compatível com **Windows**, **Linux**, **macOS** e **WSL**.

---

## 📌 Sumário

1. [Visão Geral da Arquitetura](#-1-visão-geral-da-arquitetura)
2. [Pré-requisitos do Sistema](#-2-pré-requisitos-do-sistema)
3. [Estrutura do Monorepo](#-3-estrutura-do-monorepo)
4. [Método 1: Inicialização Automática por Script (Recomendado)](#-4-método-1-inicialização-automática-por-script-recomendado)
   - [Windows (.bat ou .ps1)](#41-no-windows)
   - [Linux / macOS / WSL (.sh)](#42-no-linux-macos-e-wsl)
5. [Método 2: Comandos Rápidos pelo Root (NPM Monorepo)](#-5-método-2-comandos-rápidos-pelo-root-npm-monorepo)
6. [Método 3: Inicialização Manual Passo a Passo](#-6-método-3-inicialização-manual-passo-a-passo)
   - [Terminal 1 — Backend (FastAPI na porta 8000)](#61-terminal-1--backend-fastapi)
   - [Terminal 2 — Frontend (Vite na porta 5173)](#62-terminal-2--frontend-react--vite)
7. [Scripts Individuais Auxiliares](#-7-scripts-individuais-auxiliares)
8. [Variáveis de Ambiente (.env)](#-8-variáveis-de-ambiente-env)
9. [Verificação e Testes de Conectividade (Smoke Tests)](#-9-verificação-e-testes-de-conectividade-smoke-tests)
10. [Solução de Problemas Comuns (Troubleshooting)](#-10-solução-de-problemas-comuns-troubleshooting)

---

## 🏗️ 1. Visão Geral da Arquitetura

O sistema opera com duas camadas desacopladas e integradas em um único monorepo:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (Front_end: React 19 + Vite) ───── http://localhost:5173          │
│                                                                            │
│  - Catálogo tradicional, Compra Guiada IA, Chatbot farmacêutico            │
│  - Carrinho, Checkout completo, Leitura de receitas via câmera/OCR         │
│  - Proxy automático do Vite: rotas '/api/*' -> 'http://127.0.0.1:8000/*'   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ fetch('/api/...')
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ BACKEND (back_end: FastAPI + Uvicorn) ────── http://127.0.0.1:8000         │
│                                                                            │
│  - RAG vetorial sobre o catálogo oficial da Pague Menos (500 produtos)     │
│  - 4 Camadas de Guardrails sanitários da ANVISA (bloqueio seguro)          │
│  - Autenticação, pedidos, sessões e orquestração de IA                     │
│  - Documentação interativa Swagger: http://127.0.0.1:8000/docs             │
└────────────────────────────────────────────────────────────────────────────┘
```

> **Nota de Resiliência:** Caso o backend não seja iniciado, o frontend possui **modo de contingência inteligente (fallback)**, mantendo navegação, catálogo e carrinho funcionais.

---

## 🧱 2. Pré-requisitos do Sistema

Antes de iniciar, certifique-se de que seu computador possui os seguintes softwares instalados:

### 1. Node.js (para o Frontend)
- **Versão:** `20.19+` ou `22.x+ LTS`
- **Verificação no terminal:**
  ```bash
  node -v
  npm -v
  ```
- *Download:* [https://nodejs.org/](https://nodejs.org/)

### 2. Python (para o Backend)
- **Versão:** `3.11.x` (recomendada) ou `3.10` a `3.14`
- **Verificação no terminal:**
  ```bash
  python --version
  # ou no Linux/macOS
  python3 --version
  ```
- *Download:* [https://www.python.org/downloads/](https://www.python.org/downloads/) *(No Windows, marque a opção "Add Python to PATH" durante a instalação)*.

---

## 📁 3. Estrutura do Monorepo

O repositório está padronizado nas pastas **`Front_end`** e **`back_end`**:

```text
ProgramaPagueMenos/ (Raiz do Monorepo)
├── Front_end/                    ← APLICAÇÃO FRONTEND (React 19, Vite 8, Vanilla CSS)
│   ├── public/                   # Imagens oficiais de produtos e categorias
│   ├── src/                      # Componentes, serviços, estilo e páginas
│   ├── index.html                # Entrypoint HTML
│   ├── vite.config.js            # Configuração Vite com proxy reverso /api
│   ├── package.json              # Dependências isoladas do Frontend
│   ├── start_frontend.bat / .sh  # Inicializador direto da pasta
│   └── README.md                 # Documentação técnica do Frontend
│
├── back_end/                     ← APLICAÇÃO BACKEND (FastAPI, Python, RAG, Guardrails)
│   ├── app/                      # Rotas (/chat, /products, /cart, /auth, etc.), core e repositórios
│   ├── data/                     # Catálogo Parquet, uploads de câmera e persistência JSON
│   ├── tests/                    # 31 testes unitários e de integração (Pytest)
│   ├── requirements.txt          # Dependências Python (FastAPI, Uvicorn, Pandas, etc.)
│   ├── Dockerfile                # Imagem Docker para deploy em nuvem
│   ├── start_backend.bat / .sh   # Inicializador direto da pasta
│   └── README.md                 # Documentação técnica do Backend
│
├── package.json                  ← Scripts de conveniência no topo do Monorepo
├── start.bat                     ← Inicializador 1-clique Windows (Batch)
├── start.ps1                     ← Inicializador 1-clique Windows (PowerShell)
├── start.sh                      ← Inicializador 1-clique Linux/macOS/WSL (Bash)
├── start_backend.bat / .sh       ← Inicializador do Backend a partir da raiz
├── start_frontend.bat / .sh      ← Inicializador do Frontend a partir da raiz
├── .gitignore                    ← Regras unificadas de exclusão Git
├── README.md                     ← Documentação mestre completa do sistema
└── TUTORIAL_INICIALIZACAO.md     ← Este guia passo a passo
```

---

## ⚡ 4. Método 1: Inicialização Automática por Script (Recomendado)

Os scripts realizam todo o setup automaticamente:
1. Detectam as pastas `Front_end` e `back_end`;
2. Verificam Python, Node.js e npm;
3. Criam o arquivo `.env` do backend caso ainda não exista;
4. Criam o ambiente virtual Python (`.venv`) e instalam as dependências de `requirements.txt`;
5. Executam `npm install` no front se a pasta `node_modules` estiver ausente;
6. Inicializam ambos os servidores e abrem o navegador em `http://localhost:5173`!

### 4.1. No Windows

#### Opção A: Duplo Clique em `start.bat` (Mais Rápido)
- Abra a raiz do projeto e dê um **duplo clique no arquivo `start.bat`**.
- Duas janelas serão abertas:
  - **Backend:** `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`)
  - **Frontend:** `http://localhost:5173`
- O navegador abrirá automaticamente na tela da farmácia.

#### Opção B: PowerShell `start.ps1`
Abra o PowerShell na pasta raiz e execute:
```powershell
.\start.ps1
```
*(Se o PowerShell bloquear a execução de scripts da máquina local, execute antes: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*.

---

### 4.2. No Linux / macOS e WSL

Abra o terminal na raiz do projeto e execute:
```bash
chmod +x start.sh start_backend.sh start_frontend.sh
./start.sh
```

Ambos os serviços serão iniciados em segundo plano com logs coloridos. Para encerrar tudo com segurança, basta pressionar `Ctrl + C`.

---

## 💻 5. Método 2: Comandos Rápidos pelo Root (NPM Monorepo)

Graças ao `package.json` unificado na raiz do Monorepo, você pode executar comandos em qualquer pasta ou direto da raiz:

```bash
# Iniciar o Frontend Vite
npm run dev

# Iniciar o Backend FastAPI
npm run back

# Executar a compilação de produção do Frontend
npm run build

# Executar linter Oxlint
npm run lint

# Executar a suíte de testes do Backend (Pytest)
npm run test:back
```

---

## 🛠️ 6. Método 3: Inicialização Manual Passo a Passo

Caso prefira iniciar cada serviço manualmente em terminais separados:

### 6.1. Terminal 1 — Backend (FastAPI)
```bash
# 1. Acesse a pasta back_end
cd back_end

# 2. Crie e ative o ambiente virtual
python -m venv .venv

# No Windows:
.venv\Scripts\activate
# No Linux/macOS:
source .venv/bin/activate

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Copie o .env se ainda não existir
# Windows: copy .env.example .env | Linux: cp .env.example .env

# 5. Inicie o servidor
uvicorn app.main:app --reload --reload-dir app --port 8000
```
- Acesse o Swagger interativo em: **`http://localhost:8000/docs`**
- Valide o healthcheck em: **`http://localhost:8000/health`**

---

### 6.2. Terminal 2 — Frontend (React + Vite)
```bash
# 1. Acesse a pasta Front_end
cd Front_end

# 2. Instale as dependências
npm install

# 3. Inicie o Vite
npm run dev
```
- Acesse a interface web em: **`http://localhost:5173`**

---

## 🎛️ 7. Scripts Individuais Auxiliares

Caso queira rodar apenas um dos lados do sistema a partir da raiz:

| Script | Função |
| :--- | :--- |
| `start_backend.bat` / `.sh` | Prepara e inicia apenas o Backend na porta 8000 |
| `start_frontend.bat` / `.sh` | Prepara e inicia apenas o Frontend na porta 5173 |

---

## ⚙️ 8. Variáveis de Ambiente (.env)

### Backend (`back_end/.env`)
O backend funciona de maneira 100% autônoma e determinística mesmo sem chaves de API externas (usando o catálogo Parquet e motor de busca semântica local).

Caso queira habilitar provedores de IA generativa em nuvem, configure:
```env
# Opcional: Chave para OpenAI (GPT-4o-mini)
OPENAI_API_KEY=

# Opcional: Chave para Google Gemini
GEMINI_API_KEY=

# Opcional: Chave para Groq (Llama 3.3)
GROQ_API_KEY=

# Origens CORS autorizadas
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CATALOG_PATH=data/paguemenos_catalog.parquet
LLM_PROVIDER=auto
LLM_ENABLED=true
```

### Frontend (`Front_end/.env`)
```env
# Deixe vazio para usar o proxy automático do Vite ('/api')
VITE_API_URL=
```

---

## 🧪 9. Verificação e Testes de Conectividade (Smoke Tests)

Para certificar-se de que tudo está operando perfeitamente:

1. **Health Check do Backend:**
   Abra no navegador: `http://localhost:8000/health` → deve retornar:
   ```json
   {"status":"ok","rag":"tfidf","llm":true,"catalog_size":500}
   ```

2. **Auditoria de Prontidão Regulatório:**
   Abra no navegador: `http://localhost:8000/audit/readiness`

3. **Execução da Suíte de Testes Pytest:**
   ```bash
   cd back_end
   python -m pytest
   ```
   *(Todos os 31 testes devem passar com 100% de sucesso)*.

---

## 🚑 10. Solução de Problemas Comuns (Troubleshooting)

### A porta 8000 ou 5173 já está em uso
- **Windows:** Abra o PowerShell e encerre o processo conflitante:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
  ```
- **Linux/macOS:**
  ```bash
  lsof -ti:8000 | xargs kill -9
  ```

### Erro de importação de módulos no Python
- Certifique-se de que o ambiente virtual está ativado (`.venv\Scripts\activate` ou `source .venv/bin/activate`).
- Execute a reinstalação das dependências:
  ```bash
  pip install --upgrade pip
  pip install -r requirements.txt
  ```

### Vite reporta "Network Error" ao chamar API
- Verifique se a janela do backend FastAPI está ativa na porta 8000.
- O arquivo `Front_end/vite.config.js` redireciona qualquer requisição `/api/*` para `http://127.0.0.1:8000`.
- Se o backend estiver desligado, o frontend entrará automaticamente no **modo de contingência offline**, garantindo que a interface permaneça responsiva.
