#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - Inicialização isolada do Backend (Linux / macOS)
# =====================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -d "$SCRIPT_DIR/../back_PagueMenos/PagueMenosBackend" ]; then
    BACK_DIR="$(cd "$SCRIPT_DIR/../back_PagueMenos/PagueMenosBackend" && pwd)"
elif [ -d "$SCRIPT_DIR/../../back_PagueMenos/PagueMenosBackend" ]; then
    BACK_DIR="$(cd "$SCRIPT_DIR/../../back_PagueMenos/PagueMenosBackend" && pwd)"
elif [ -d "$SCRIPT_DIR/../PagueMenosBackend" ]; then
    BACK_DIR="$(cd "$SCRIPT_DIR/../PagueMenosBackend" && pwd)"
else
    echo "Erro: pasta PagueMenosBackend não encontrada."
    exit 1
fi

cd "$BACK_DIR"
[ ! -f ".env" ] && [ -f ".env.example" ] && cp .env.example .env

if [ ! -d ".venv" ]; then
    python3 -m venv .venv 2>/dev/null || python -m venv .venv
fi

[ -f ".venv/bin/activate" ] && source .venv/bin/activate

echo "====================================================================="
echo " PAGUE MENOS - BACKEND FASTAPI (PORTA 8000)"
echo " Docs:   http://localhost:8000/docs"
echo " Health: http://localhost:8000/health"
echo "====================================================================="

python -m uvicorn app.main:app --reload --port 8000
