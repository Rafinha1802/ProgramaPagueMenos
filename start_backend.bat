@echo off
setlocal enabledelayedexpansion
title Pague Menos - Backend (FastAPI :8000)

echo =====================================================================
echo           PAGUE MENOS - BACKEND FASTAPI (PORTA 8000)
echo =====================================================================
echo.

set "ROOT_DIR=%~dp0"
set "BACK_DIR=%ROOT_DIR%back_end"

if not exist "%BACK_DIR%\app\main.py" (
    echo [ERRO] Pasta do backend nao encontrada em: "%BACK_DIR%"
    pause
    exit /b 1
)

cd /d "%BACK_DIR%"
echo [OK] Backend detectado em: "%BACK_DIR%"

:: 1. Copiar .env se nao existir
if not exist ".env" (
    if exist ".env.example" (
        echo [CONFIG] Copiando .env.example para .env no backend...
        copy .env.example .env >nul
    )
)

:: 2. Detectar comando Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERRO] Python 3 nao encontrado no PATH do sistema.
        echo Baixe em: https://www.python.org/downloads/
        pause
        exit /b 1
    ) else (
        set "SYSTEM_PYTHON=py"
    )
) else (
    set "SYSTEM_PYTHON=python"
)

:: 3. Criar ambiente virtual se nao existir
if not exist ".venv" (
    echo [CONFIG] Criando ambiente virtual Python .venv...
    %SYSTEM_PYTHON% -m venv --system-site-packages .venv 2>nul || %SYSTEM_PYTHON% -m venv .venv
)

:: 4. Determinar executavel Python do ambiente virtual
if exist ".venv\Scripts\python.exe" (
    set "RUN_PYTHON=%BACK_DIR%\.venv\Scripts\python.exe"
) else (
    set "RUN_PYTHON=%SYSTEM_PYTHON%"
)

:: 5. Verificar dependencias do backend
echo [CHECK] Verificando dependencias do backend...
"%RUN_PYTHON%" -c "import uvicorn, fastapi, pydantic, pandas, pyarrow, sklearn" >nul 2>nul
if %errorlevel% neq 0 (
    echo [INSTALANDO] Instalando dependencias de requirements.txt automaticamente...
    "%RUN_PYTHON%" -m pip install --upgrade pip
    "%RUN_PYTHON%" -m pip install --prefer-binary -r requirements.txt
    if %errorlevel% neq 0 (
        "%RUN_PYTHON%" -m pip install -r requirements.txt
    )
) else (
    echo [OK] Todas as dependencias do backend estao prontas.
)

:: 6. Iniciar Servidor
echo.
echo =====================================================================
echo  SERVIDOR BACKEND EM EXECUCAO
echo =====================================================================
echo Docs interativas (Swagger): http://localhost:8000/docs
echo Health Check:               http://localhost:8000/health
echo =====================================================================
echo.

if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
)

"%RUN_PYTHON%" -m uvicorn app.main:app --reload --reload-dir app --port 8000
pause
