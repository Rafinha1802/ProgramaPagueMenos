@echo off
setlocal enabledelayedexpansion
title Pague Menos - Backend (FastAPI :8000)

set "SCRIPT_DIR=%~dp0"
if exist "%SCRIPT_DIR%..\back_PagueMenos\PagueMenosBackend" (
    set "BACK_DIR=%SCRIPT_DIR%..\back_PagueMenos\PagueMenosBackend"
) else if exist "%SCRIPT_DIR%..\..\back_PagueMenos\PagueMenosBackend" (
    set "BACK_DIR=%SCRIPT_DIR%..\..\back_PagueMenos\PagueMenosBackend"
) else if exist "%SCRIPT_DIR%..\PagueMenosBackend" (
    set "BACK_DIR=%SCRIPT_DIR%..\PagueMenosBackend"
) else (
    echo [ERRO] Diretorio do backend nao encontrado!
    pause
    exit /b 1
)

cd /d "%BACK_DIR%"
if not exist ".env" (
    if exist ".env.example" copy .env.example .env >nul
)

if not exist ".venv" (
    echo [CONFIG] Criando ambiente virtual .venv...
    python -m venv .venv 2>nul || py -m venv .venv 2>nul
)

if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
)

echo =====================================================================
echo  PAGUE MENOS - BACKEND FASTAPI (PORTA 8000)
echo =====================================================================
echo Docs interativas (Swagger): http://localhost:8000/docs
echo Health Check:               http://localhost:8000/health
echo =====================================================================
echo.

python -m uvicorn app.main:app --reload --port 8000
pause
