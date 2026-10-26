#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - Inicialização isolada do Frontend (Linux / macOS)
# =====================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend (npm install)..."
    npm install
fi

echo "====================================================================="
echo " PAGUE MENOS - FRONTEND REACT + VITE (PORTA 5173)"
echo " URL: http://localhost:5173"
echo "====================================================================="

npm run dev
