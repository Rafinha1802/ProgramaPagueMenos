#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - Inicializador Monorepo (Linux / macOS / WSL)
# =====================================================================

set -e

C_RESET='\033[0m'
C_CYAN='\033[0;36m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[1;33m'
C_RED='\033[0;31m'
C_BOLD='\033[1m'

echo -e "${C_CYAN}${C_BOLD}"
echo "====================================================================="
echo "       PAGUE MENOS - IA COMMERCE (MONOREPO LINUX/MACOS/WSL)         "
echo "====================================================================="
echo -e "${C_RESET}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONT_DIR="$SCRIPT_DIR/Front_end"
BACK_DIR="$SCRIPT_DIR/back_end"

if [ ! -f "$BACK_DIR/app/main.py" ]; then
    echo -e "${C_RED}[ERRO] Backend não encontrado em: $BACK_DIR${C_RESET}"
    exit 1
fi

if [ ! -f "$FRONT_DIR/package.json" ]; then
    echo -e "${C_RED}[ERRO] Frontend não encontrado em: $FRONT_DIR${C_RESET}"
    exit 1
fi

echo -e "${C_GREEN}[OK] Frontend detectado em: $FRONT_DIR${C_RESET}"
echo -e "${C_GREEN}[OK] Backend detectado em:  $BACK_DIR${C_RESET}"
echo ""

# 1. Verificar comandos
PYTHON_BIN=""
if command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
elif command -v python &>/dev/null; then
    PYTHON_BIN="python"
else
    echo -e "${C_RED}[ERRO] Python 3 não encontrado. Instale Python 3.11+.${C_RESET}"
    exit 1
fi

if ! command -v node &>/dev/null; then
    echo -e "${C_RED}[ERRO] Node.js não encontrado. Instale Node.js 20+.${C_RESET}"
    exit 1
fi

# 2. Preparar Backend
echo -e "${C_YELLOW}[1/2] Preparando Backend FastAPI...${C_RESET}"
cd "$BACK_DIR"
[ ! -f ".env" ] && [ -f ".env.example" ] && cp .env.example .env

if [ ! -d ".venv" ]; then
    echo "[CONFIG] Criando ambiente virtual Python (.venv)..."
    $PYTHON_BIN -m venv --system-site-packages .venv 2>/dev/null || $PYTHON_BIN -m venv .venv
fi

if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
    RUN_PYTHON="python"
else
    RUN_PYTHON="$PYTHON_BIN"
fi

echo "[CHECK] Verificando dependências do backend..."
if ! $RUN_PYTHON -c "import uvicorn, fastapi, pydantic, pandas, pyarrow, sklearn" &>/dev/null; then
    echo "[INSTALANDO] Instalando dependências de requirements.txt..."
    $RUN_PYTHON -m pip install --upgrade pip
    $RUN_PYTHON -m pip install --prefer-binary -r requirements.txt || $RUN_PYTHON -m pip install -r requirements.txt
else
    echo -e "${C_GREEN}[OK] Dependências do backend verificadas.${C_RESET}"
fi

# 3. Preparar Frontend
echo -e "\n${C_YELLOW}[2/2] Preparando Frontend React + Vite...${C_RESET}"
cd "$FRONT_DIR"
[ ! -f ".env" ] && [ -f ".env.example" ] && cp .env.example .env

if [ ! -d "node_modules" ]; then
    echo "[INSTALANDO] Instalando dependências do frontend (npm install)..."
    npm install
else
    echo -e "${C_GREEN}[OK] Dependências do frontend verificadas.${C_RESET}"
fi

# 4. Iniciar Servidores
echo -e "\n${C_CYAN}${C_BOLD}====================================================================="
echo " INICIANDO SERVIDORES DO MONOREPO"
echo "=====================================================================${C_RESET}"
echo -e " Backend:  ${C_BOLD}http://127.0.0.1:8000${C_RESET} (Docs: http://127.0.0.1:8000/docs)"
echo -e " Frontend: ${C_BOLD}http://localhost:5173${C_RESET}"
echo -e "\n${C_YELLOW}Pressione [Ctrl+C] a qualquer momento para encerrar ambos os serviços.${C_RESET}\n"

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
$RUN_PYTHON -m uvicorn app.main:app --reload --reload-dir app --port 8000 &
BACKEND_PID=$!
echo -e "${C_GREEN}[OK] Backend iniciado (PID: $BACKEND_PID)${C_RESET}"

sleep 2

# Iniciar Frontend em background
cd "$FRONT_DIR"
npm run dev &
FRONTEND_PID=$!
echo -e "${C_GREEN}[OK] Frontend iniciado (PID: $FRONTEND_PID)${C_RESET}"

sleep 2

# Tentar abrir navegador
if command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:5173" &>/dev/null || true
elif command -v open &>/dev/null; then
    open "http://localhost:5173" &>/dev/null || true
fi

echo -e "\n${C_GREEN}${C_BOLD}[SUCESSO] Sistema Pague Menos Monorepo pronto e em execução!${C_RESET}"
wait
