@echo off
setlocal enabledelayedexpansion
title Pague Menos - Frontend (React + Vite :5173)

echo =====================================================================
echo           PAGUE MENOS - FRONTEND REACT + VITE (PORTA 5173)
echo =====================================================================
echo.

set "ROOT_DIR=%~dp0"
set "FRONT_DIR=%ROOT_DIR%Front_end"

if not exist "%FRONT_DIR%\package.json" (
    echo [ERRO] Pasta do frontend nao encontrada em: "%FRONT_DIR%"
    pause
    exit /b 1
)

cd /d "%FRONT_DIR%"
echo [OK] Frontend detectado em: "%FRONT_DIR%"

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
    )
)

if not exist "node_modules" (
    echo [CONFIG] Instalando dependencias do frontend (npm install)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias do frontend.
        pause
        exit /b 1
    )
)

echo.
echo =====================================================================
echo  SERVIDOR FRONTEND EM EXECUCAO
echo =====================================================================
echo URL da Aplicacao: http://localhost:5173
echo =====================================================================
echo.

call npm run dev
pause
