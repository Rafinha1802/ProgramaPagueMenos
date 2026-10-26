# 🚀 Guia Completo e Detalhado de Inicialização — Pague Menos IA Commerce

Este guia fornece instruções passo a passo para inicializar o **Frontend** (React + Vite) e o **Backend** (FastAPI + Python), seja através de **scripts automatizados em 1 clique** ou **manualmente terminal por terminal**, compatível com **Windows**, **Linux**, **macOS** e **WSL**.

---

## 📌 Sumário

1. [Visão Geral da Arquitetura](#-1-visão-geral-da-arquitetura)
2. [Pré-requisitos do Sistema](#-2-pré-requisitos-do-sistema)
3. [Estrutura de Pastas Esperada](#-3-estrutura-de-pastas-esperada)
4. [Método 1: Inicialização Automática por Script (Recomendado)](#-4-método-1-inicialização-automática-por-script-recomendado)
   - [Windows (.bat ou .ps1)](#41-no-windows)
   - [Linux / macOS / WSL (.sh)](#42-no-linux-macos-e-wsl)
5. [Método 2: Inicialização Manual Passo a Passo](#-5-método-2-inicialização-manual-passo-a-passo)
   - [Terminal 1 — Backend (FastAPI na porta 8000)](#51-terminal-1--backend-fastapi)
   - [Terminal 2 — Frontend (Vite na porta 5173)](#52-terminal-2--frontend-react--vite)
6. [Scripts Individuais Auxiliares](#-6-scripts-individuais-auxiliares)
7. [Variáveis de Ambiente (.env)](#-7-variáveis-de-ambiente-env)
8. [Verificação e Testes de Conectividade (Smoke Tests)](#-8-verificação-e-testes-de-conectividade-smoke-tests)
9. [Solução de Problemas Comuns (Troubleshooting)](#-9-solução-de-problemas-comuns-troubleshooting)

---

## 🏗️ 1. Visão Geral da Arquitetura

O sistema é composto por duas aplicações desacopladas que operam em conjunto:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (React 19 + Vite) ──────────────── http://localhost:5173          │
│                                                                            │
│  - Catálogo tradicional, Compra Guiada IA, Chatbot farmacêutico           │
│  - Carrinho, Checkout completo, Leitura de receitas via câmera/OCR         │
│  - Proxy automático do Vite: rotas '/api/*' -> 'http://127.0.0.1:8000/*'   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ fetch('/api/...')
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ BACKEND (FastAPI + Uvicorn) ─────────────── http://127.0.0.1:8000          │
│                                                                            │
│  - RAG vetorial sobre o catálogo oficial da Pague Menos (500 produtos)     │
│  - 4 Camadas de Guardrails sanitários da ANVISA (bloqueio seguro)          │
│  - Autenticação, pedidos, sessões e orquestração de IA                     │
│  - Documentação interativa Swagger: http://127.0.0.1:8000/docs             │
└────────────────────────────────────────────────────────────────────────────┘
```

> **Nota:** Caso o backend não seja iniciado, o frontend possui **modo de contingência inteligente (fallback)**, mantendo a navegação, catálogo e carrinho funcionais.

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
- **Versão:** `3.11.x` (recomendada) ou `3.10` a `3.12`
- **Verificação no terminal:**
  ```bash
  python --version
  # ou no Linux/macOS
  python3 --version
  ```
- *Download:* [https://www.python.org/downloads/](https://www.python.org/downloads/) *(No Windows, marque a opção "Add Python to PATH" durante a instalação)*.

---

## 📁 3. Estrutura de Pastas Esperada

Os scripts foram desenhados para detectar automaticamente a estrutura do projeto:

```text
seu_diretorio_de_trabalho/
├── back_PagueMenos/
│   └── PagueMenosBackend/        ← BACKEND (FastAPI, app/, requirements.txt)
│       ├── app/
│       ├── data/
│       ├── requirements.txt
│       └── .env.example
│
└── PagueMenos/                   ← FRONTEND (Vite, React, package.json, scripts)
    ├── src/
    ├── public/
    ├── package.json
    ├── start.bat                 ← Script automático Windows (Batch)
    ├── start.ps1                 ← Script automático Windows (PowerShell)
    ├── start.sh                  ← Script automático Linux/macOS (Bash)
    ├── start_backend.bat / .sh   ← Inicia apenas o backend
    └── start_frontend.bat / .sh  ← Inicia apenas o frontend
```

---

## ⚡ 4. Método 1: Inicialização Automática por Script (Recomendado)

Os scripts realizam todo o trabalho pesado automaticamente:
1. Detectam os caminhos do front e do back;
2. Verificam Python, Node.js e npm;
3. Criam o `.env` do backend caso ainda não exista;
4. Criam o ambiente virtual Python (`.venv`) e instalam as dependências de `requirements.txt`;
5. Executam `npm install` no front se a pasta `node_modules` estiver ausente;
6. Inicializam ambos os servidores e abrem a aplicação no seu navegador!

### 4.1. No Windows

Você tem duas opções no Windows:

#### Opção A: Duplo Clique em `start.bat`
- Basta abrir a pasta `PagueMenos` no Windows Explorer e dar **duplo clique no arquivo `start.bat`**.
- Duas janelas dedicadas serão abertas (uma para o Backend na porta 8000 e outra para o Frontend na porta 5173).
- O navegador abrirá automaticamente em `http://localhost:5173`.

#### Opção B: Via PowerShell (`start.ps1`)
Abra o PowerShell na pasta `PagueMenos` e execute:
```powershell
.\start.ps1
```

> **Dica:** Se o PowerShell bloquear a execução de scripts por política de segurança, execute:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .\start.ps1
> ```

---

### 4.2. No Linux, macOS e WSL

1. Abra o terminal na pasta `PagueMenos`.
2. Dê permissão de execução aos scripts (necessário apenas na primeira vez):
   ```bash
   chmod +x start.sh start_backend.sh start_frontend.sh
   ```
3. Execute o script:
   ```bash
   ./start.sh
   ```
4. Ambos os servidores rodarão em paralelo com monitoramento de logs.
5. **Para encerrar ambos:** Basta pressionar `Ctrl + C` no terminal. O script possui tratamento de sinal (*trap*) que encerra o backend e o frontend simultaneamente e de forma limpa, sem deixar portas presas.

---

## 🛠️ 5. Método 2: Inicialização Manual Passo a Passo

Se preferir inicializar manualmente em terminais separados, siga os passos abaixo:

### 5.1. Terminal 1 — Backend (FastAPI)

1. Navegue até a pasta do backend:
   ```bash
   cd back_PagueMenos/PagueMenosBackend
   # (ajuste o caminho se necessário conforme sua estrutura)
   ```

2. Crie e ative o ambiente virtual Python:
   - **No Windows (CMD / PowerShell):**
     ```powershell
     python -m venv .venv
     .venv\Scripts\activate
     ```
   - **No Linux / macOS:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. Instale as dependências:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Crie o arquivo de variáveis de ambiente:
   - **No Windows:**
     ```cmd
     copy .env.example .env
     ```
   - **No Linux / macOS:**
     ```bash
     cp .env.example .env
     ```

5. Inicie o servidor FastAPI:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

6. Verifique se o backend está respondendo:
   - Abra no navegador: [http://localhost:8000/health](http://localhost:8000/health) → deve retornar `{"status":"ok", ...}`
   - Documentação Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 5.2. Terminal 2 — Frontend (React + Vite)

1. Abra um segundo terminal e navegue até a pasta do frontend:
   ```bash
   cd PagueMenos
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   - [http://localhost:5173](http://localhost:5173)

---

## 🎛️ 6. Scripts Individuais Auxiliares

Caso queira subir apenas um dos lados isoladamente:

| Objetivo | Windows | Linux / macOS |
| :--- | :--- | :--- |
| **Apenas Backend** | `start_backend.bat` | `./start_backend.sh` |
| **Apenas Frontend** | `start_frontend.bat` | `./start_frontend.sh` |
| **Front + Back juntos** | `start.bat` ou `.\start.ps1` | `./start.sh` |

Além disso, pelo próprio `package.json` do frontend, você pode usar:
```bash
# Inicia o frontend
npm run dev

# Inicia o backend a partir da pasta do front (se forem pastas irmãs)
npm run backend

# Compila o frontend para produção
npm run build

# Executa o linter
npm run lint
```

---

## ⚙️ 7. Variáveis de Ambiente (.env)

O backend possui o arquivo `.env` dentro de `back_PagueMenos/PagueMenosBackend/.env`. As principais opções são:

```ini
# Chave da OpenAI (opcional para demonstração)
OPENAI_API_KEY=

# Ativa/Desativa o uso do LLM externo
# Se false, o sistema usa o SafeLLMAgent determinístico (super rápido e 100% gratuito)
LLM_ENABLED=false
LLM_MODEL=gpt-4o-mini

# Origens permitidas para requisições CORS
CORS_ORIGINS=http://localhost:5173,https://programa-pague-menos.vercel.app

# Caminho do catálogo
CATALOG_PATH=data/paguemenos_catalog.parquet

# Mecanismo de busca vetorial:
# 'auto' (usa sentence-transformers se disponível, com fallback automático)
# 'tfidf' (modo leve, não exige PyTorch, ideal para máquinas com pouca memória)
EMBEDDING_BACKEND=auto

LOG_LEVEL=info
```

> 💡 **Dica de Performance:** Se você tiver um computador com pouca RAM ou quiser inicializar o backend em menos de 2 segundos, use no `.env`:
> ```ini
> EMBEDDING_BACKEND=tfidf
> LLM_ENABLED=false
> ```

---

## 🧪 8. Verificação e Testes de Conectividade (Smoke Tests)

Para testar rapidamente se o backend está respondendo e aplicando os guardrails sanitários:

### 1. Testar bloqueio de dosagem (Camada 1 dos Guardrails ANVISA):
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"teste-1\",\"message\":\"qual a dosagem de dipirona infantil\"}"
```
*Resposta esperada:* `tipo: "bloqueio_intencao"`, acionando o bloqueio seguro com alerta regulatório e sem alucinação de produto.

### 2. Testar busca semântica de produtos (RAG seguro):
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"teste-2\",\"message\":\"estou com azia e queimação\"}"
```
*Resposta esperada:* `tipo: "produto"`, trazendo produtos liberados (como antiácidos e protetores gástricos sem receita retida).

---

## 🩺 9. Solução de Problemas Comuns (Troubleshooting)

### Problema 1: "Address already in use" ou "Port 8000 / 5173 already in use"
**Causa:** Um processo anterior ficou rodando em segundo plano preso na porta.

**Solução no Windows:**
```powershell
# Encontrar o processo na porta 8000
netstat -ano | findstr :8000
# Encerrar pelo PID (substitua <PID> pelo número que apareceu no final da linha)
taskkill /PID <PID> /F

# Fazer o mesmo na porta 5173 se necessário:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Solução no Linux / macOS:**
```bash
# Encerrar processos nas portas 8000 e 5173
kill -9 $(lsof -t -i:8000) 2>/dev/null || true
kill -9 $(lsof -t -i:5173) 2>/dev/null || true
```

---

### Problema 2: "No module named 'uvicorn'" ou "uvicorn não é reconhecido"
**Causa:** O ambiente virtual `.venv` não foi ativado antes de executar o comando ou as dependências não foram instaladas nele.

**Solução:**
```bash
# Entre na pasta do backend
cd back_PagueMenos/PagueMenosBackend

# Ative o venv
# No Windows:
.venv\Scripts\activate
# No Linux/macOS:
source .venv/bin/activate

# Reinstale as dependências:
pip install -r requirements.txt
```

---

### Problema 3: "A execução de scripts foi desabilitada neste sistema" (PowerShell)
**Causa:** Política de execução restritiva padrão do Windows PowerShell.

**Solução:**
Execute no PowerShell antes de rodar `start.ps1`:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

### Problema 4: Falha ao baixar o modelo de embeddings (Sentence-Transformers)
**Causa:** Sem conexão com a internet ou bloqueio de firewall na primeira execução.

**Solução:**
Abra o arquivo `.env` do backend e altere para usar TF-IDF puro:
```ini
EMBEDDING_BACKEND=tfidf
```
O backend passará a utilizar a busca vetorial via Scikit-Learn local sem necessidade de downloads externos.
