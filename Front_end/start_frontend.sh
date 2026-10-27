#!/usr/bin/env bash
# =====================================================================
#  Pague Menos - Frontend (Linux / macOS / WSL)
# =====================================================================

set -e
cd "$(dirname "${BASH_SOURCE[0]}")"

[ ! -f ".env" ] && [ -f ".env.example" ] && cp .env.example .env

if [ ! -d "node_modules" ]; then
    echo "[CONFIG] Instalando dependências do frontend..."
    npm install
fi

echo "====================================================================="
echo " PAGUE MENOS - FRONTEND REACT + VITE (PORTA 5173)"
echo " URL: http://localhost:5173"
echo "====================================================================="

npm run dev
