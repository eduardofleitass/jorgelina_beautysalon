<#
.SYNOPSIS
    Instala Jorgelina Coiffure como servicio de Windows (arranca solo con la PC).

.DESCRIPTION
    Usa NSSM para registrar el backend como servicio:
      - Arranque automatico al encender la PC
      - Se reinicia solo si se cae
      - Rotacion de logs
    Requiere permisos de Administrador.

.PARAMETER Puerto
    Puerto de escucha. Default: 3001

.PARAMETER Desinstalar
    Quita el servicio en vez de instalarlo.

.EXAMPLE
    .\instalar-servicio.ps1
    .\instalar-servicio.ps1 -Desinstalar
#>

param(
    [int]$Puerto = 3001,
    [switch]$Desinstalar
)

$ErrorActionPreference = 'Stop'
$NOMBRE_SERVICIO = 'JorgelinaCoiffure'

# Verificar permisos de administrador
$esAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $esAdmin) {
    Write-Host ""
    Write-Host "  Este script necesita permisos de Administrador." -ForegroundColor Red
    Write-Host "  Cerrar esta ventana y volver a abrir PowerShell como Administrador" -ForegroundColor Yellow
    Write-Host "  (click derecho en PowerShell > Ejecutar como administrador)" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Localizar la raiz del proyecto
$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path (Join-Path $raiz 'backend'))) {
    $raiz = Split-Path -Parent $PSScriptRoot
}
$be = Join-Path $raiz 'backend'

# ---------------------------------------------------------------------------
# DESINSTALAR
# ---------------------------------------------------------------------------
if ($Desinstalar) {
    Write-Host ""
    Write-Host "Quitando el servicio $NOMBRE_SERVICIO..." -ForegroundColor Yellow

    $servicio = Get-Service -Name $NOMBRE_SERVICIO -ErrorAction SilentlyContinue
    if (-not $servicio) {
        Write-Host "  El servicio no estaba instalado." -ForegroundColor DarkYellow
        exit 0
    }

    if ($servicio.Status -eq 'Running') {
        Stop-Service -Name $NOMBRE_SERVICIO -Force
        Start-Sleep -Seconds 2
    }

    $nssm = Get-Command nssm -ErrorAction SilentlyContinue
    if ($nssm) {
        & nssm remove $NOMBRE_SERVICIO confirm
    } else {
        & sc.exe delete $NOMBRE_SERVICIO | Out-Null
    }

    Write-Host "  Servicio quitado." -ForegroundColor Green
    exit 0
}

# ---------------------------------------------------------------------------
# INSTALAR
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Instalar Jorgelina Coiffure como servicio" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que este compilado
$mainJs = Join-Path $be 'dist\main.js'
if (-not (Test-Path $mainJs)) {
    Write-Host "  Falta backend\dist\main.js" -ForegroundColor Red
    Write-Host "  Correr primero:  .\build.ps1" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar .env
$envPath = Join-Path $be '.env'
if (-not (Test-Path $envPath)) {
    Write-Host "  Falta backend\.env" -ForegroundColor Red
    Write-Host "  Correr primero:  .\build.ps1" -ForegroundColor Yellow
    exit 1
}
$contenidoEnv = Get-Content $envPath -Raw
if ($contenidoEnv -notmatch 'NODE_ENV=production') {
    Write-Host "  backend\.env no tiene NODE_ENV=production" -ForegroundColor Red
    Write-Host "  Correr:  .\build.ps1" -ForegroundColor Yellow
    exit 1
}

# 3. Verificar NSSM
$nssm = Get-Command nssm -ErrorAction SilentlyContinue
if (-not $nssm) {
    Write-Host "  No se encontro NSSM." -ForegroundColor Red
    Write-Host ""
    Write-Host "  NSSM es la herramienta que convierte un programa en servicio de Windows." -ForegroundColor Yellow
    Write-Host "  Descargar (gratis): https://nssm.cc/download" -ForegroundColor Cyan
    Write-Host "  Descomprimir y copiar nssm.exe (carpeta win64) a:" -ForegroundColor Yellow
    Write-Host "     C:\Windows\System32\nssm.exe" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  O instalarlo con:  winget install NSSM.NSSM" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# 4. Ubicar node.exe
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) {
    foreach ($c in @("C:\Program Files\nodejs\node.exe", "C:\Program Files (x86)\nodejs\node.exe")) {
        if (Test-Path $c) { $node = $c; break }
    }
}
if (-not $node) {
    Write-Host "  No se encontro node.exe. Instalar Node.js desde https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "  Node: $node" -ForegroundColor DarkGray

# 5. Carpeta de logs
$logsDir = Join-Path $raiz 'logs'
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir -Force | Out-Null }

# 6. Quitar servicio previo si existe
if (Get-Service -Name $NOMBRE_SERVICIO -ErrorAction SilentlyContinue) {
    Write-Host "  Ya existia un servicio con ese nombre. Reemplazando..." -ForegroundColor DarkYellow
    Stop-Service -Name $NOMBRE_SERVICIO -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    & nssm remove $NOMBRE_SERVICIO confirm | Out-Null
    Start-Sleep -Seconds 1
}

# 7. Registrar el servicio
Write-Host ""
Write-Host "  Registrando servicio..." -ForegroundColor Yellow
& nssm install $NOMBRE_SERVICIO $node | Out-Null
& nssm set $NOMBRE_SERVICIO AppParameters "dist\main.js" | Out-Null
& nssm set $NOMBRE_SERVICIO AppDirectory $be | Out-Null
& nssm set $NOMBRE_SERVICIO AppEnvironmentExtra "NODE_ENV=production" "PORT=$Puerto" | Out-Null
& nssm set $NOMBRE_SERVICIO DisplayName "Jorgelina Coiffure" | Out-Null
& nssm set $NOMBRE_SERVICIO Description "Sitio web del salon Jorgelina Coiffure (NestJS)" | Out-Null
& nssm set $NOMBRE_SERVICIO Start SERVICE_AUTO_START | Out-Null
& nssm set $NOMBRE_SERVICIO AppExit Default Restart | Out-Null
& nssm set $NOMBRE_SERVICIO AppRestartDelay 5000 | Out-Null
& nssm set $NOMBRE_SERVICIO AppStdout (Join-Path $logsDir 'sitio-salida.log') | Out-Null
& nssm set $NOMBRE_SERVICIO AppStderr (Join-Path $logsDir 'sitio-error.log') | Out-Null
& nssm set $NOMBRE_SERVICIO AppRotateFiles 1 | Out-Null
& nssm set $NOMBRE_SERVICIO AppRotateBytes 10485760 | Out-Null

# 8. Arrancar
Write-Host "  Arrancando..." -ForegroundColor Yellow
Start-Service -Name $NOMBRE_SERVICIO
Start-Sleep -Seconds 4

$servicio = Get-Service -Name $NOMBRE_SERVICIO
if ($servicio.Status -ne 'Running') {
    Write-Host ""
    Write-Host "  El servicio no arranco. Revisar:" -ForegroundColor Red
    Write-Host "     Get-Content `"$logsDir\sitio-error.log`"" -ForegroundColor DarkGray
    exit 1
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  Servicio instalado y corriendo" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Mostrar IPs de acceso (solo LAN real)
$ips = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notmatch '^127\.' -and
        $_.IPAddress -notmatch '^169\.254\.' -and
        $_.IPAddress -notmatch '^172\.(1[6-9]|2[0-9]|3[01])\.' -and
        $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL|Docker'
    } | Select-Object -ExpandProperty IPAddress

Write-Host "  Accesos:" -ForegroundColor Cyan
Write-Host "     http://localhost:$Puerto" -ForegroundColor White
foreach ($ip in $ips) {
    Write-Host "     http://${ip}:$Puerto   <- para otros equipos de la red" -ForegroundColor White
}
Write-Host ""
Write-Host "  IMPORTANTE: para que otros equipos entren, abrir el firewall:" -ForegroundColor Yellow
Write-Host "     .\abrir-firewall.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Estado del servicio:" -ForegroundColor DarkGray
Write-Host "     Get-Service $NOMBRE_SERVICIO" -ForegroundColor DarkGray
Write-Host ""
