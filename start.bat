@echo off
setlocal enabledelayedexpansion
title Pague Menos - Inicializador Monorepo (Frontend + Backend)

echo =====================================================================
echo           PAGUE MENOS - IA COMMERCE (MONOREPO)
echo =====================================================================
echo.

:: 1. Diretorios do Monorepo
set "ROOT_DIR=%~dp0"
set "FRONT_DIR=%ROOT_DIR%Front_end"
set "BACK_DIR=%ROOT_DIR%back_end"

if not exist "%BACK_DIR%\app\main.py" (
    echo [ERRO] Diretorio do backend nao encontrado em: "%BACK_DIR%\app\main.py"
    pause
    exit /b 1
)

if not exist "%FRONT_DIR%\package.json" (
    echo [ERRO] Diretorio do frontend nao encontrado em: "%FRONT_DIR%\package.json"
    pause
    exit /b 1
)

echo [OK] Monorepo detectado:
echo      - Frontend: "%FRONT_DIR%"
echo      - Backend:  "%BACK_DIR%"
echo.

:: 2. Verificar dependencias do sistema
where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERRO] Python nao encontrado no PATH do sistema.
        echo Baixe em: https://www.python.org/downloads/
        pause
        exit /b 1
    ) else (
        set "PYTHON_CMD=py"
    )
) else (
    set "PYTHON_CMD=python"
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado no PATH do sistema.
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado no PATH do sistema.
    pause
    exit /b 1
)

echo [OK] Python, Node.js e npm detectados com sucesso.
echo.

:: 3. Preparacao do Backend (FastAPI)
echo =====================================================================
echo [1/2] Verificando e Preparando o Backend (FastAPI)...
echo =====================================================================
cd /d "%BACK_DIR%"

if not exist ".env" (
    if exist ".env.example" (
        echo [CONFIG] Copiando .env.example para .env em back_end...
        copy .env.example .env >nul
    )
)

if not exist ".venv" (
    echo [CONFIG] Criando ambiente virtual Python .venv...
    %PYTHON_CMD% -m venv --system-site-packages .venv 2>nul || %PYTHON_CMD% -m venv .venv
)

if exist ".venv\Scripts\python.exe" (
    set "RUN_BACK_PYTHON=%BACK_DIR%\.venv\Scripts\python.exe"
) else (
    set "RUN_BACK_PYTHON=%PYTHON_CMD%"
)

echo [CHECK] Verificando dependencias do backend no ambiente virtual...
"%RUN_BACK_PYTHON%" -c "import uvicorn, fastapi, pydantic, pandas, pyarrow, sklearn" >nul 2>nul
if %errorlevel% neq 0 (
    echo [INSTALANDO] Instalando dependencias de requirements.txt automaticamente...
    "%RUN_BACK_PYTHON%" -m pip install --upgrade pip
    "%RUN_BACK_PYTHON%" -m pip install --prefer-binary -r requirements.txt
    if %errorlevel% neq 0 (
        echo [AVISO] Tentando instalar requirements sem a flag prefer-binary...
        "%RUN_BACK_PYTHON%" -m pip install -r requirements.txt
    )
) else (
    echo [OK] Dependencias do backend ja estao prontas.
)

:: 4. Preparacao do Frontend (React + Vite)
echo.
echo =====================================================================
echo [2/2] Verificando e Preparando o Frontend (React + Vite)...
echo =====================================================================
cd /d "%FRONT_DIR%"

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
    )
)

if not exist "node_modules" (
    echo [INSTALANDO] Instalando dependencias do frontend npm install...
    call npm install
) else (
    echo [OK] Dependencias do frontend node_modules prontas.
)

:: 5. Inicializacao dos Servidores em Janelas Dedicadas
echo.
echo =====================================================================
echo           INICIANDO SERVIDORES DO MONOREPO
echo =====================================================================
echo.
echo  1. Backend FastAPI:   http://127.0.0.1:8000
echo     Swagger Docs:      http://127.0.0.1:8000/docs
echo     Health Check:      http://127.0.0.1:8000/health
echo.
echo  2. Frontend React:    http://localhost:5173
echo =====================================================================
echo.

:: Iniciar Backend em nova janela
start "Pague Menos - Backend" cmd /k "cd /d "%BACK_DIR%" && if exist .venv\Scripts\activate.bat call .venv\Scripts\activate.bat && "%RUN_BACK_PYTHON%" -m uvicorn app.main:app --reload --reload-dir app --port 8000"

:: Aguardar 2 segundos
ping 127.0.0.1 -n 3 >nul

:: Iniciar Frontend em nova janela
start "Pague Menos - Frontend" cmd /k "cd /d "%FRONT_DIR%" && npm run dev"

:: Aguardar 3 segundos e abrir navegador
ping 127.0.0.1 -n 4 >nul
start http://localhost:5173

echo [SUCESSO] Frontend e Backend iniciados com sucesso!
echo Ambas as janelas estao em execucao. Para parar, basta fechar as janelas do terminal.
echo.
pause
