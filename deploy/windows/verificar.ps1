<#
.SYNOPSIS
    Verifica que el sitio este funcionando correctamente.

.DESCRIPTION
    Comprueba: servicio corriendo, puerto escuchando, frontend servido,
    API respondiendo, y datos accesibles.

.PARAMETER Puerto
    Puerto a verificar. Default: 3001
#>

param([int]$Puerto = 3001)

$ErrorActionPreference = 'Continue'

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Verificacion - Jorgelina Coiffure" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$fallas = 0

# 1. Puerto escuchando
Write-Host "[1/5] Puerto $Puerto" -ForegroundColor Yellow
$ocupado = netstat -ano | Select-String ":$Puerto\s" | Select-String "LISTENING"
if ($ocupado) {
    Write-Host "  Escuchando OK" -ForegroundColor Green
} else {
    Write-Host "  NO hay nada escuchando en $Puerto" -ForegroundColor Red
    Write-Host "     Arrancar con: .\iniciar-sitio.bat  o  Start-Service JorgelinaCoiffure" -ForegroundColor DarkYellow
    $fallas++
}
Write-Host ""

# 2. Frontend servido
Write-Host "[2/5] Frontend" -ForegroundColor Yellow
try {
    $html = (Invoke-WebRequest -Uri "http://localhost:$Puerto/" -UseBasicParsing -TimeoutSec 8).Content
    if ($html -match '<title>([^<]*)</title>') {
        Write-Host "  Titulo: $($Matches[1])" -ForegroundColor Green
        if ($html -match 'assets/') {
            Write-Host "  Assets compilados presentes OK" -ForegroundColor Green
        } else {
            Write-Host "  No se ven los assets compilados" -ForegroundColor Red
            $fallas++
        }
    } else {
        Write-Host "  Responde pero sin titulo esperado" -ForegroundColor Red
        $fallas++
    }
} catch {
    Write-Host "  No responde: $($_.Exception.Message)" -ForegroundColor Red
    $fallas++
}
Write-Host ""

# 3. API health
Write-Host "[3/5] API" -ForegroundColor Yellow
try {
    $health = (Invoke-WebRequest -Uri "http://localhost:$Puerto/api/health" -UseBasicParsing -TimeoutSec 8).Content
    Write-Host "  /api/health -> $health" -ForegroundColor Green
} catch {
    Write-Host "  /api/health no responde" -ForegroundColor Red
    $fallas++
}
Write-Host ""

# 4. Servicio de Windows
Write-Host "[4/5] Servicio de Windows" -ForegroundColor Yellow
$servicio = Get-Service -Name 'JorgelinaCoiffure' -ErrorAction SilentlyContinue
if ($servicio) {
    $color = if ($servicio.Status -eq 'Running') { 'Green' } else { 'Red' }
    Write-Host "  JorgelinaCoiffure: $($servicio.Status)" -ForegroundColor $color
    if ($servicio.Status -ne 'Running') { $fallas++ }
} else {
    Write-Host "  No instalado como servicio (usa iniciar-sitio.bat)" -ForegroundColor DarkYellow
}
Write-Host ""

# 5. Acceso por red
Write-Host "[5/5] Acceso desde otros equipos" -ForegroundColor Yellow
$ips = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notmatch '^127\.' -and
        $_.IPAddress -notmatch '^169\.254\.' -and
        $_.IPAddress -notmatch '^172\.(1[6-9]|2[0-9]|3[01])\.' -and
        $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL|Docker'
    } | Select-Object -ExpandProperty IPAddress

if ($ips) {
    foreach ($ip in $ips) {
        try {
            $null = Invoke-WebRequest -Uri "http://${ip}:$Puerto/api/health" -UseBasicParsing -TimeoutSec 5
            Write-Host "  http://${ip}:$Puerto  OK" -ForegroundColor Green
        } catch {
            Write-Host "  http://${ip}:$Puerto  NO responde (revisar firewall)" -ForegroundColor Red
            Write-Host "     Solucion: .\abrir-firewall.ps1 (como Administrador)" -ForegroundColor DarkYellow
            $fallas++
        }
    }
} else {
    Write-Host "  No se detecto IP de red local" -ForegroundColor DarkYellow
}
Write-Host ""

# Resumen
Write-Host "===============================================" -ForegroundColor Cyan
if ($fallas -eq 0) {
    Write-Host "  TODO OK" -ForegroundColor Green
} else {
    Write-Host "  $fallas problema(s) detectado(s)" -ForegroundColor Red
}
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
