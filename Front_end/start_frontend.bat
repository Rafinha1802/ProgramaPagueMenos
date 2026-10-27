@echo off
setlocal enabledelayedexpansion
title Pague Menos - Frontend (React + Vite :5173)

cd /d "%~dp0"

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
    )
)

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
