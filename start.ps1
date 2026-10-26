# =====================================================================
#  Pague Menos - IA Commerce: Script de Inicialização (PowerShell)
#  Compatível com Windows 10/11 e PowerShell 5.1 / 7+
# =====================================================================

$ErrorActionPreference = "Stop"

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "           PAGUE MENOS - IA COMMERCE (FRONTEND + BACKEND)            " -ForegroundColor Yellow -NoNewline
Write-Host " [PS]" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Localização dos Diretórios
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$FrontDir = $ScriptDir

$PossibleBackDirs = @(
    (Join-Path $ScriptDir "..\back_PagueMenos\PagueMenosBackend"),
    (Join-Path $ScriptDir "..\..\back_PagueMenos\PagueMenosBackend"),
    (Join-Path $ScriptDir "..\PagueMenosBackend"),
    (Join-Path $ScriptDir "backend")
)

$BackDir = $null
foreach ($path in $PossibleBackDirs) {
    if (Test-Path $path) {
        $BackDir = (Resolve-Path $path).Path
        break
    }
}

if (-not $BackDir) {
    Write-Host "[ERRO] Diretório do backend (PagueMenosBackend) não foi encontrado!" -ForegroundColor Red
    Write-Host "Verifique se a pasta 'back_PagueMenos\PagueMenosBackend' está disponível." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Frontend detectado em: $FrontDir" -ForegroundColor Green
Write-Host "[OK] Backend detectado em:  $BackDir" -ForegroundColor Green
Write-Host ""

# 2. Checagem de Ferramentas
Write-Host "[CHECK] Verificando executáveis necessários..." -ForegroundColor Cyan

$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
} else {
    Write-Host "[ERRO] Python não foi encontrado no PATH!" -ForegroundColor Red
    Write-Host "Instale o Python 3.11+: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Node.js não foi encontrado no PATH!" -ForegroundColor Red
    Write-Host "Instale o Node.js 20+: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] npm não foi encontrado no PATH!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Python: $(& $pythonCmd --version 2>&1)" -ForegroundColor Green
Write-Host "[OK] Node.js: $(node -v)" -ForegroundColor Green
Write-Host ""

# 3. Preparação do Backend
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "[1/2] Preparando o Backend (FastAPI)..." -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan

Set-Location $BackDir

# Copiar .env se não existir
if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Write-Host "[CONFIG] Criando .env a partir de .env.example..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
}

# Criar venv se necessário
$venvPath = Join-Path $BackDir ".venv"
$venvPython = Join-Path $venvPath "Scripts\python.exe"
$venvActivate = Join-Path $venvPath "Scripts\Activate.ps1"

if (-not (Test-Path $venvPath)) {
    Write-Host "[CONFIG] Criando ambiente virtual Python (.venv)..." -ForegroundColor Cyan
    & $pythonCmd -m venv $venvPath
}

$activePython = if (Test-Path $venvPython) { $venvPython } else { $pythonCmd }

# Verificar dependências
Write-Host "[CHECK] Verificando dependências Python (FastAPI / Uvicorn)..." -ForegroundColor Cyan
$installed = & $activePython -c "import uvicorn, fastapi; print('OK')" 2>$null
if ($installed -ne "OK") {
    Write-Host "[INSTALANDO] Instalando dependências de requirements.txt..." -ForegroundColor Yellow
    & $activePython -m pip install --upgrade pip
    & $activePython -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao instalar dependências do backend!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] Dependências do backend verificadas." -ForegroundColor Green
}

# 4. Preparação do Frontend
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "[2/2] Preparando o Frontend (React + Vite)..." -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan

Set-Location $FrontDir
if (-not (Test-Path "node_modules")) {
    Write-Host "[INSTALANDO] Executando npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha no npm install!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] node_modules já presente." -ForegroundColor Green
}

# 5. Inicialização dos Processos
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "           INICIANDO BACKEND E FRONTEND EM JANELAS DEDICADAS         " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "1. Backend:  http://127.0.0.1:8000 (Swagger: http://127.0.0.1:8000/docs)" -ForegroundColor White
Write-Host "2. Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""

# Iniciar Backend em nova janela de comando
$backCmd = "cd /d `"$BackDir`" && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) && python -m uvicorn app.main:app --reload --port 8000"
Start-Process cmd.exe -ArgumentList "/k `"$backCmd`"" -WindowStyle Normal

Start-Sleep -Seconds 2

# Iniciar Frontend em nova janela de comando
$frontCmd = "cd /d `"$FrontDir`" && npm run dev"
Start-Process cmd.exe -ArgumentList "/k `"$frontCmd`"" -WindowStyle Normal

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "[SUCESSO] Sistema Pague Menos iniciado com sucesso!" -ForegroundColor Green
Write-Host "Para encerrar o sistema, basta fechar as duas janelas abertas." -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Green
