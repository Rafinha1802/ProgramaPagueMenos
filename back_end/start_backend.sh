#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - Inicializacao isolada do Backend (Linux / macOS)
# =====================================================================

set -e
BACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
    echo "[INSTALANDO] Instalando dependencias de requirements.txt automaticamente..."
    $RUN_PYTHON -m pip install --upgrade pip
    $RUN_PYTHON -m pip install --prefer-binary -r requirements.txt || $RUN_PYTHON -m pip install -r requirements.txt
else
    echo "[OK] Dependencias do backend ja estao instaladas."
fi

echo "====================================================================="
echo " PAGUE MENOS - BACKEND FASTAPI (PORTA 8000)"
echo " Docs:   http://localhost:8000/docs"
echo " Health: http://localhost:8000/health"
echo "====================================================================="

$RUN_PYTHON -m uvicorn app.main:app --reload --port 8000
