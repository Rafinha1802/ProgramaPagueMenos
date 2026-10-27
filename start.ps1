# =====================================================================
#  Pague Menos - Inicializador Monorepo em PowerShell (Frontend + Backend)
# =====================================================================

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          PAGUE MENOS - IA COMMERCE (MONOREPO POWERSHELL)           " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$SCRIPT_DIR = $PSScriptRoot
$FRONT_DIR = Join-Path $SCRIPT_DIR "Front_end"
$BACK_DIR = Join-Path $SCRIPT_DIR "back_end"

if (-not (Test-Path (Join-Path $BACK_DIR "app\main.py"))) {
    Write-Host "[ERRO] Backend não encontrado em: $BACK_DIR" -ForegroundColor Red
    Read-Host "Pressione Enter para sair..."
    exit 1
}

if (-not (Test-Path (Join-Path $FRONT_DIR "package.json"))) {
    Write-Host "[ERRO] Frontend não encontrado em: $FRONT_DIR" -ForegroundColor Red
    Read-Host "Pressione Enter para sair..."
    exit 1
}

Write-Host "[OK] Frontend detectado em: $FRONT_DIR" -ForegroundColor Green
Write-Host "[OK] Backend detectado em:  $BACK_DIR" -ForegroundColor Green
Write-Host ""

# 1. Verificar comandos de sistema
$pythonCmd = "python"
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    if (Get-Command "py" -ErrorAction SilentlyContinue) {
        $pythonCmd = "py"
    } else {
        Write-Host "[ERRO] Python não encontrado no PATH. Instale Python 3.11+." -ForegroundColor Red
        Read-Host "Pressione Enter para sair..."
        exit 1
    }
}

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Node.js não encontrado no PATH. Instale Node.js 20+." -ForegroundColor Red
    Read-Host "Pressione Enter para sair..."
    exit 1
}

# 2. Preparar Backend
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host "[1/2] Preparando Backend FastAPI..." -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Yellow
Set-Location $BACK_DIR

if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item ".env.example" ".env"
    Write-Host "[CONFIG] .env criado no backend." -ForegroundColor Gray
}

if (-not (Test-Path ".venv")) {
    Write-Host "[CONFIG] Criando ambiente virtual .venv..." -ForegroundColor Gray
    & $pythonCmd -m venv .venv
}

$venvPython = Join-Path $BACK_DIR ".venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    $venvPython = $pythonCmd
}

Write-Host "[CHECK] Verificando dependências do backend..." -ForegroundColor Gray
$checkProc = Start-Process -FilePath $venvPython -ArgumentList "-c", "`"import uvicorn, fastapi, pydantic, pandas, pyarrow, sklearn`"" -NoNewWindow -PassThru -Wait
if ($checkProc.ExitCode -ne 0) {
    Write-Host "[INSTALANDO] Instalando requirements.txt..." -ForegroundColor Yellow
    & $venvPython -m pip install --upgrade pip
    & $venvPython -m pip install --prefer-binary -r requirements.txt
} else {
    Write-Host "[OK] Dependências do backend verificadas." -ForegroundColor Green
}

# 3. Preparar Frontend
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host "[2/2] Preparando Frontend React + Vite..." -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Yellow
Set-Location $FRONT_DIR

if (-not (Test-Path "node_modules")) {
    Write-Host "[INSTALANDO] Executando npm install no frontend..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[OK] Dependências do frontend verificadas." -ForegroundColor Green
}

# 4. Iniciar Servidores
Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          INICIANDO SERVIDORES DO MONOREPO                          " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "1. Backend:  http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)" -ForegroundColor White
Write-Host "2. Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""

Start-Process cmd -ArgumentList "/k", "cd /d `"$BACK_DIR`" && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) && `"$venvPython`" -m uvicorn app.main:app --reload --reload-dir app --port 8000"
Start-Sleep -Seconds 2

Start-Process cmd -ArgumentList "/k", "cd /d `"$FRONT_DIR`" && npm run dev"
Start-Sleep -Seconds 3

Start-Process "http://localhost:5173"

Write-Host "[SUCESSO] Sistema Pague Menos iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
