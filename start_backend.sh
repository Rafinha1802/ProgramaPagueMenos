#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - Inicializador Isolado do Backend (Linux / macOS / WSL)
# =====================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACK_DIR="$SCRIPT_DIR/back_end"

if [ ! -f "$BACK_DIR/app/main.py" ]; then
    echo "Erro: pasta back_end não encontrada em $BACK_DIR."
    exit 1
fi

cd "$BACK_DIR"
[ ! -f ".env" ] && [ -f ".env.example" ] && cp .env.example .env

PYTHON_BIN=""
if command -v python3 &>/dev/null; then
    PYTHON_BIN="python3"
else
    PYTHON_BIN="python"
fi

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

echo "[CHECK] Verificando dependencias do backend..."
if ! $RUN_PYTHON -c "import uvicorn, fastapi, pydantic, pandas, pyarrow, sklearn" &>/dev/null; then
    echo "[INSTALANDO] Instalando dependencias de requirements.txt..."
    $RUN_PYTHON -m pip install --upgrade pip
    $RUN_PYTHON -m pip install --prefer-binary -r requirements.txt || $RUN_PYTHON -m pip install -r requirements.txt
else
    echo "[OK] Dependencias do backend verificadas."
fi

echo "====================================================================="
echo " PAGUE MENOS - BACKEND FASTAPI (PORTA 8000)"
echo " Docs:   http://localhost:8000/docs"
echo " Health: http://localhost:8000/health"
echo "====================================================================="

$RUN_PYTHON -m uvicorn app.main:app --reload --reload-dir app --port 8000
