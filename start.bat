@echo off
setlocal enabledelayedexpansion
title Pague Menos - Inicializador do Sistema

echo =====================================================================
echo           PAGUE MENOS - IA COMMERCE (FRONTEND + BACKEND)
echo =====================================================================
echo.

:: 1. Detectar caminhos do Frontend e Backend
set "SCRIPT_DIR=%~dp0"
set "FRONT_DIR=%SCRIPT_DIR%"

:: Procurar o diretorio do backend
if exist "%SCRIPT_DIR%..\back_PagueMenos\PagueMenosBackend" (
    set "BACK_DIR=%SCRIPT_DIR%..\back_PagueMenos\PagueMenosBackend"
) else if exist "%SCRIPT_DIR%..\..\back_PagueMenos\PagueMenosBackend" (
    set "BACK_DIR=%SCRIPT_DIR%..\..\back_PagueMenos\PagueMenosBackend"
) else if exist "%SCRIPT_DIR%..\PagueMenosBackend" (
    set "BACK_DIR=%SCRIPT_DIR%..\PagueMenosBackend"
) else if exist "%SCRIPT_DIR%backend" (
    set "BACK_DIR=%SCRIPT_DIR%backend"
) else (
    echo [ERRO] Diretorio do backend (PagueMenosBackend) nao encontrado!
    echo Verifique se a pasta 'back_PagueMenos\PagueMenosBackend' esta no mesmo nivel.
    pause
    exit /b 1
)

echo [OK] Frontend detectado em: "%FRONT_DIR%"
echo [OK] Backend detectado em:  "%BACK_DIR%"
echo.

:: 2. Verificar dependencias do sistema (Python e Node)
where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERRO] Python nao encontrado no PATH do sistema.
        echo Instale o Python 3.11 ou superior em: https://www.python.org/downloads/
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
    echo Instale o Node.js 20+ em: https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado no PATH do sistema.
    pause
    exit /b 1
)

echo [OK] Python e Node.js detectados com sucesso.
echo.

:: 3. Preparacao do Backend
echo =====================================================================
echo [1/2] Verificando e Preparando o Backend (FastAPI)...
echo =====================================================================
cd /d "%BACK_DIR%"

:: Copiar .env se nao existir
if not exist ".env" (
    if exist ".env.example" (
        echo [CONFIG] Copiando .env.example para .env no backend...
        copy .env.example .env >nul
    )
)

:: Verificar ou criar ambiente virtual (.venv)
if not exist ".venv" (
    echo [CONFIG] Criando ambiente virtual Python (.venv)...
    %PYTHON_CMD% -m venv .venv
    if %errorlevel% neq 0 (
        echo [AVISO] Nao foi possivel criar o .venv com %PYTHON_CMD%, tentando usar Python global.
    )
)

:: Ativar venv se existir
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    set "BACK_PYTHON=python"
) else (
    set "BACK_PYTHON=%PYTHON_CMD%"
)

:: Instalar dependencias se uvicorn nao estiver disponivel
%BACK_PYTHON% -c "import uvicorn, fastapi" >nul 2>nul
if %errorlevel% neq 0 (
    echo [INSTALANDO] Instalando dependencias do backend (requirements.txt)...
    %BACK_PYTHON% -m pip install --upgrade pip
    %BACK_PYTHON% -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias do backend.
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencias do backend ja estao instaladas.
)

:: 4. Preparacao do Frontend
echo.
echo =====================================================================
echo [2/2] Verificando e Preparando o Frontend (React + Vite)...
echo =====================================================================
cd /d "%FRONT_DIR%"

if not exist "node_modules" (
    echo [INSTALANDO] Instalando dependencias do frontend (npm install)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao executar npm install.
        pause
        exit /b 1
    )
) else (
    echo [OK] node_modules do frontend ja existe.
)

:: 5. Inicializar Servidores em Janelas Dedicadas
echo.
echo =====================================================================
echo           INICIANDO SERVIDORES EM SEGUNDO PLANO
echo =====================================================================
echo.
echo 1. Backend:  http://127.0.0.1:8000  (Documentacao: http://127.0.0.1:8000/docs)
echo 2. Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para abrir as janelas dos servicos...
pause >nul

:: Iniciar Backend em nova janela
start "Pague Menos - Backend (FastAPI :8000)" cmd /k "cd /d "%BACK_DIR%" && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) && python -m uvicorn app.main:app --reload --port 8000"

:: Aguardar 2 segundos
timeout /t 2 >nul

:: Iniciar Frontend em nova janela
start "Pague Menos - Frontend (Vite :5173)" cmd /k "cd /d "%FRONT_DIR%" && npm run dev"

:: Aguardar 3 segundos e abrir navegador
timeout /t 3 >nul
start http://localhost:5173

echo.
echo =====================================================================
echo [SUCESSO] Sistema Pague Menos iniciado com sucesso!
echo Ambas as janelas estao em execucao. Para parar, basta fechar as janelas.
echo =====================================================================
echo.
pause
