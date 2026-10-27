#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - Inicializador Isolado do Frontend (Linux / macOS / WSL)
# =====================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONT_DIR="$SCRIPT_DIR/Front_end"

if [ ! -f "$FRONT_DIR/package.json" ]; then
    echo "Erro: pasta Front_end não encontrada em $FRONT_DIR."
    exit 1
fi

cd "$FRONT_DIR"

if [ ! -d "node_modules" ]; then
    echo "[CONFIG] Instalando dependências do frontend..."
    npm install
fi

echo "====================================================================="
echo " PAGUE MENOS - FRONTEND REACT + VITE (PORTA 5173)"
echo " URL: http://localhost:5173"
echo "====================================================================="

npm run dev
