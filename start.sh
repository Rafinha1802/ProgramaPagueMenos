#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - IA Commerce: Script de Inicialização (Linux / macOS)
#  Compatível com Ubuntu, Debian, Fedora, Arch, WSL e macOS
# =====================================================================

set -e

# Cores do Terminal
C_RESET="\033[0m"
C_RED="\033[0;31m"
C_GREEN="\033[0;32m"
C_YELLOW="\033[0;33m"
C_BLUE="\033[0;34m"
C_CYAN="\033[0;36m"
C_BOLD="\033[1m"

echo -e "${C_CYAN}=====================================================================${C_RESET}"
echo -e "${C_BOLD}${C_YELLOW}           PAGUE MENOS - IA COMMERCE (FRONTEND + BACKEND)            ${C_RESET}"
echo -e "${C_CYAN}=====================================================================${C_RESET}\n"

# 1. Localização dos Diretórios
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONT_DIR="$SCRIPT_DIR"

if [ -d "$SCRIPT_DIR/../back_PagueMenos/PagueMenosBackend" ]; then
    BACK_DIR="$(cd "$SCRIPT_DIR/../back_PagueMenos/PagueMenosBackend" && pwd)"
elif [ -d "$SCRIPT_DIR/../../back_PagueMenos/PagueMenosBackend" ]; then
    BACK_DIR="$(cd "$SCRIPT_DIR/../../back_PagueMenos/PagueMenosBackend" && pwd)"
elif [ -d "$SCRIPT_DIR/../PagueMenosBackend" ]; then
    BACK_DIR="$(cd "$SCRIPT_DIR/../PagueMenosBackend" && pwd)"
elif [ -d "$SCRIPT_DIR/backend" ]; then
    BACK_DIR="$(cd "$SCRIPT_DIR/backend" && pwd)"
else
    echo -e "${C_RED}[ERRO] Diretório do backend (PagueMenosBackend) não encontrado!${C_RESET}"
    echo -e "${C_YELLOW}Certifique-se de que a pasta 'back_PagueMenos/PagueMenosBackend' existe.${C_RESET}"
    exit 1
fi

echo -e "${C_GREEN}[OK] Frontend detectado em: ${FRONT_DIR}${C_RESET}"
echo -e "${C_GREEN}[OK] Backend detectado em:  ${BACK_DIR}${C_RESET}\n"

# 2. Verificação de Ferramentas
echo -e "${C_CYAN}[CHECK] Verificando dependências do sistema...${C_RESET}"

PYTHON_BIN=""
if command -v python3.11 &>/dev/null; then
    PYTHON_BIN="python3.11"
elif command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
elif command -v python &>/dev/null; then
    PYTHON_BIN="python"
else
    echo -e "${C_RED}[ERRO] Python 3 não foi encontrado!${C_RESET}"
    echo -e "${C_YELLOW}Instale com: sudo apt install python3 python3-venv python3-pip (ou equivalente).${C_RESET}"
    exit 1
fi

if ! command -v node &>/dev/null; then
    echo -e "${C_RED}[ERRO] Node.js não foi encontrado!${C_RESET}"
    echo -e "${C_YELLOW}Instale o Node.js 20+ em: https://nodejs.org/${C_RESET}"
    exit 1
fi

if ! command -v npm &>/dev/null; then
    echo -e "${C_RED}[ERRO] npm não foi encontrado!${C_RESET}"
    exit 1
fi

echo -e "${C_GREEN}[OK] Python: $($PYTHON_BIN --version)${C_RESET}"
echo -e "${C_GREEN}[OK] Node.js: $(node -v) / npm: $(npm -v)${C_RESET}\n"

# 3. Preparação do Backend
echo -e "${C_CYAN}=====================================================================${C_RESET}"
echo -e "${C_YELLOW}[1/2] Preparando o Backend (FastAPI)...${C_RESET}"
echo -e "${C_CYAN}=====================================================================${C_RESET}"

cd "$BACK_DIR"

# Criar .env se não existir
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo -e "${C_CYAN}[CONFIG] Copiando .env.example para .env no backend...${C_RESET}"
    cp .env.example .env
fi

# Criar venv se necessário
if [ ! -d ".venv" ]; then
    echo -e "${C_CYAN}[CONFIG] Criando ambiente virtual Python (.venv)...${C_RESET}"
    $PYTHON_BIN -m venv .venv
fi

# Ativar venv
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
    BACK_PYTHON="python"
else
    BACK_PYTHON="$PYTHON_BIN"
fi

# Checar dependências
echo -e "${C_CYAN}[CHECK] Verificando dependências do backend...${C_RESET}"
if ! $BACK_PYTHON -c "import uvicorn, fastapi" &>/dev/null; then
    echo -e "${C_YELLOW}[INSTALANDO] Instalando dependências de requirements.txt...${C_RESET}"
    $BACK_PYTHON -m pip install --upgrade pip
    $BACK_PYTHON -m pip install -r requirements.txt
else
    echo -e "${C_GREEN}[OK] Dependências do backend já instaladas.${C_RESET}"
fi

# 4. Preparação do Frontend
echo -e "\n${C_CYAN}=====================================================================${C_RESET}"
echo -e "${C_YELLOW}[2/2] Preparando o Frontend (React + Vite)...${C_RESET}"
echo -e "${C_CYAN}=====================================================================${C_RESET}"

cd "$FRONT_DIR"

if [ ! -d "node_modules" ]; then
    echo -e "${C_YELLOW}[INSTALANDO] Executando npm install...${C_RESET}"
    npm install
else
    echo -e "${C_GREEN}[OK] node_modules do frontend já existe.${C_RESET}"
fi

# 5. Inicialização dos Processos com Tratamento Limpo de Saída
echo -e "\n${C_CYAN}=====================================================================${C_RESET}"
echo -e "${C_GREEN}${C_BOLD}           INICIANDO SERVIÇOS PAGUE MENOS                            ${C_RESET}"
echo -e "${C_CYAN}=====================================================================${C_RESET}"
echo -e " Backend:  ${C_BOLD}http://127.0.0.1:8000${C_RESET} (Docs: ${C_CYAN}http://127.0.0.1:8000/docs${C_RESET})"
echo -e " Frontend: ${C_BOLD}http://localhost:5173${C_RESET}"
echo -e "\n${C_YELLOW}Pressione [Ctrl+C] a qualquer momento para encerrar ambos os serviços.${C_RESET}\n"

# Função de limpeza ao sair
cleanup() {
    echo -e "\n\n${C_YELLOW}[INFO] Encerrando processos do Pague Menos com segurança...${C_RESET}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo -e "${C_GREEN}[OK] Todos os serviços foram desligados. Até logo!${C_RESET}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Iniciar Backend em background
cd "$BACK_DIR"
$BACK_PYTHON -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo -e "${C_GREEN}[OK] Backend iniciado (PID: $BACKEND_PID)${C_RESET}"

sleep 2

# Iniciar Frontend em background
cd "$FRONT_DIR"
npm run dev &
FRONTEND_PID=$!
echo -e "${C_GREEN}[OK] Frontend iniciado (PID: $FRONTEND_PID)${C_RESET}"

sleep 2

# Tentar abrir navegador no Linux / macOS
if command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:5173" &>/dev/null || true
elif command -v open &>/dev/null; then
    open "http://localhost:5173" &>/dev/null || true
fi

# Manter script ativo aguardando Ctrl+C
wait
