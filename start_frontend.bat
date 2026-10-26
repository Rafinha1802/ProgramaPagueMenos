@echo off
title Pague Menos - Frontend (Vite :5173)
cd /d "%~dp0"

if not exist "node_modules" (
    echo [CONFIG] Instalando dependencias do frontend...
    call npm install
)

echo =====================================================================
echo  PAGUE MENOS - FRONTEND REACT + VITE (PORTA 5173)
echo =====================================================================
echo URL da Aplicacao: http://localhost:5173
echo =====================================================================
echo.

call npm run dev
pause
