<#
.SYNOPSIS
    Compila el sitio de Jorgelina Coiffure para produccion y prepara el .env.

.DESCRIPTION
    - Detecta y ofrece cerrar los procesos node del proyecto que bloquean archivos
    - Instala dependencias (npm install, NO npm ci: en Windows npm ci falla con EPERM
      si un archivo esta en uso)
    - Compila frontend (Vite) y backend (NestJS)
    - Crea backend/.env con NODE_ENV=production y PORT

.PARAMETER Puerto
    Puerto donde escuchara el sitio. Default: 3001

.PARAMETER SaltarDeteccion
    No buscar procesos node del proyecto (para automatizacion)

.EXAMPLE
    .\build.ps1
    .\build.ps1 -Puerto 3002
#>

param(
    [int]$Puerto = 3001,
    [switch]$SaltarDeteccion
)

$ErrorActionPreference = 'Continue'
$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path (Join-Path $raiz 'backend'))) {
    $raiz = Split-Path -Parent $PSScriptRoot
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Jorgelina Coiffure - Build de produccion" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Raiz:   $raiz"
Write-Host "  Puerto: $Puerto"
Write-Host ""

# ---------------------------------------------------------------------------
# 1. Detectar procesos node del proyecto que puedan bloquear archivos
# ---------------------------------------------------------------------------
if (-not $SaltarDeteccion) {
    Write-Host "[1/4] Buscando procesos del proyecto..." -ForegroundColor Yellow

    $procesos = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
        Where-Object { $_.CommandLine -and ($_.CommandLine -like "*$raiz*") }

    if ($procesos) {
        Write-Host "  Se encontraron procesos node de este proyecto:" -ForegroundColor Yellow
        foreach ($p in $procesos) {
            $cmd = $p.CommandLine
            if ($cmd.Length -gt 100) { $cmd = $cmd.Substring(0, 100) + "..." }
            Write-Host "    PID $($p.ProcessId) : $cmd" -ForegroundColor DarkGray
        }
        Write-Host ""
        $resp = Read-Host "  Cerrarlos para evitar errores de archivo en uso? (s/N)"
        if ($resp -eq 's' -or $resp -eq 'S') {
            foreach ($p in $procesos) {
                try {
                    Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop
                    Write-Host "    Cerrado PID $($p.ProcessId)" -ForegroundColor Green
                } catch {
                    Write-Host "    No se pudo cerrar PID $($p.ProcessId)" -ForegroundColor Red
                }
            }
            Start-Sleep -Seconds 2
        } else {
            Write-Host "  Continuando sin cerrarlos (puede fallar si hay archivos en uso)" -ForegroundColor DarkYellow
        }
    } else {
        Write-Host "  Ninguno. OK" -ForegroundColor Green
    }
}

# ---------------------------------------------------------------------------
# Helper: correr npm aislando el stderr (los warnings de npm en stderr rompen
# PowerShell cuando $ErrorActionPreference='Stop')
# ---------------------------------------------------------------------------
function Invoke-Npm {
    param([string]$Carpeta, [string]$Argumentos, [string]$Etiqueta)

    $log = Join-Path $env:TEMP "jorgelina-npm-$PID.log"
    Write-Host "  $Etiqueta..." -ForegroundColor DarkGray

    Push-Location $Carpeta
    & cmd /c "npm $Argumentos > `"$log`" 2>&1"
    $codigo = $LASTEXITCODE
    Pop-Location

    Get-Content $log -ErrorAction SilentlyContinue |
        Where-Object {
            $_ -notmatch '^npm warn|^npm notice|EBADENGINE|packages are looking for funding|^$' -and
            $_ -notmatch '^> '
        } | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkGray }

    Remove-Item $log -ErrorAction SilentlyContinue
    return $codigo
}

# ---------------------------------------------------------------------------
# 2. Instalar dependencias + compilar frontend
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "[2/4] Frontend (React + Vite)" -ForegroundColor Yellow
$fe = Join-Path $raiz 'frontend'
$c1 = Invoke-Npm -Carpeta $fe -Argumentos 'install --no-audit --no-fund' -Etiqueta 'Instalando dependencias'
if ($c1 -ne 0) { Write-Host "  FALLO la instalacion del frontend" -ForegroundColor Red; exit 1 }
$c2 = Invoke-Npm -Carpeta $fe -Argumentos 'run build' -Etiqueta 'Compilando'
if ($c2 -ne 0) { Write-Host "  FALLO la compilacion del frontend" -ForegroundColor Red; exit 1 }
Write-Host "  Frontend OK" -ForegroundColor Green

# ---------------------------------------------------------------------------
# 3. Instalar dependencias + compilar backend
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "[3/4] Backend (NestJS)" -ForegroundColor Yellow
$be = Join-Path $raiz 'backend'
$c3 = Invoke-Npm -Carpeta $be -Argumentos 'install --no-audit --no-fund' -Etiqueta 'Instalando dependencias'
if ($c3 -ne 0) { Write-Host "  FALLO la instalacion del backend" -ForegroundColor Red; exit 1 }
$c4 = Invoke-Npm -Carpeta $be -Argumentos 'run build' -Etiqueta 'Compilando'
if ($c4 -ne 0) { Write-Host "  FALLO la compilacion del backend" -ForegroundColor Red; exit 1 }
Write-Host "  Backend OK" -ForegroundColor Green

# ---------------------------------------------------------------------------
# 4. Crear/actualizar backend/.env
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "[4/4] Configuracion (.env)" -ForegroundColor Yellow
$envPath = Join-Path $be '.env'

$apiKey = ''
if (Test-Path $envPath) {
    $contenido = Get-Content $envPath -Raw
    if ($contenido -match 'CALLMEBOT_APIKEY=(.+)') {
        $apiKey = $Matches[1].Trim()
    }
}

$texto = @"
# Configuracion de PRODUCCION - Jorgelina Coiffure
# Generado por deploy/windows/build.ps1
NODE_ENV=production
PORT=$Puerto

# Notificacion de reservas por WhatsApp (CallMeBot)
CALLMEBOT_PHONE=595985853557
CALLMEBOT_APIKEY=$apiKey
"@

Set-Content -Path $envPath -Value $texto -Encoding UTF8
# Quitar el BOM que agrega PowerShell (rompe el parseo de la primera clave)
$raw = [System.IO.File]::ReadAllText($envPath)
if ($raw.Length -gt 0 -and $raw[0] -eq [char]0xFEFF) {
    [System.IO.File]::WriteAllText($envPath, $raw.Substring(1), (New-Object System.Text.UTF8Encoding($false)))
}
Write-Host "  .env creado (puerto $Puerto)" -ForegroundColor Green
if (-not $apiKey) {
    Write-Host "  NOTA: falta CALLMEBOT_APIKEY para notificar reservas por WhatsApp" -ForegroundColor DarkYellow
}

# Asegurar carpetas de datos
$dataDir = Join-Path $be 'data'
if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir -Force | Out-Null }
$reservas = Join-Path $dataDir 'reservas.json'
if (-not (Test-Path $reservas)) { Set-Content -Path $reservas -Value '[]' -Encoding UTF8 }

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  Build completado" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Probar ahora:      .\iniciar-sitio.bat" -ForegroundColor Cyan
Write-Host "  Instalar servicio: .\instalar-servicio.ps1" -ForegroundColor Cyan
Write-Host ""
