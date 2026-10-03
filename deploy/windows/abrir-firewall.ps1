<#
.SYNOPSIS
    Abre el puerto en el firewall de Windows para la red local.

.DESCRIPTION
    Crea una regla de entrada que permite el acceso SOLO desde la red local
    (no desde Internet). Requiere permisos de Administrador.

.PARAMETER Puerto
    Puerto a abrir. Default: 3001

.PARAMETER Cerrar
    Quita la regla de firewall en vez de crearla.

.EXAMPLE
    .\abrir-firewall.ps1
    .\abrir-firewall.ps1 -Cerrar
#>

param(
    [int]$Puerto = 3001,
    [switch]$Cerrar
)

$ErrorActionPreference = 'Stop'
$NOMBRE_REGLA = "Jorgelina Coiffure (puerto $Puerto)"

$esAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $esAdmin) {
    Write-Host ""
    Write-Host "  Necesita permisos de Administrador." -ForegroundColor Red
    Write-Host "  Abrir PowerShell como Administrador y volver a correr." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

if ($Cerrar) {
    $regla = Get-NetFirewallRule -DisplayName $NOMBRE_REGLA -ErrorAction SilentlyContinue
    if ($regla) {
        Remove-NetFirewallRule -DisplayName $NOMBRE_REGLA
        Write-Host "  Regla de firewall quitada." -ForegroundColor Green
    } else {
        Write-Host "  La regla no existia." -ForegroundColor DarkYellow
    }
    exit 0
}

# Quitar regla previa si existe
if (Get-NetFirewallRule -DisplayName $NOMBRE_REGLA -ErrorAction SilentlyContinue) {
    Remove-NetFirewallRule -DisplayName $NOMBRE_REGLA
    Write-Host "  Regla previa reemplazada." -ForegroundColor DarkGray
}

# Crear la regla (solo red local)
New-NetFirewallRule `
    -DisplayName $NOMBRE_REGLA `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort $Puerto `
    -Action Allow `
    -RemoteAddress LocalSubnet `
    -Profile Private, Domain `
    -Description "Permite el acceso al sitio Jorgelina Coiffure desde la red local" | Out-Null

Write-Host ""
Write-Host "  Firewall configurado (solo red local)." -ForegroundColor Green
Write-Host ""

# Verificar que la red este como Privada (si no, Windows bloquea igual)
$perfiles = Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -ne 'Private' -and $_.NetworkCategory -ne 'DomainAuthenticated' }
if ($perfiles) {
    Write-Host "  ATENCION: hay redes marcadas como Publicas:" -ForegroundColor Yellow
    foreach ($p in $perfiles) {
        Write-Host "     $($p.Name) -> $($p.NetworkCategory)" -ForegroundColor DarkYellow
    }
    Write-Host "  Windows puede bloquear las conexiones entrantes." -ForegroundColor Yellow
    Write-Host "  Cambiar a Privada: Configuracion > Red e Internet > Wi-Fi > Propiedades > Perfil de red" -ForegroundColor Cyan
    Write-Host ""
}

# Mostrar IPs de acceso
$ips = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notmatch '^127\.' -and
        $_.IPAddress -notmatch '^169\.254\.' -and
        $_.IPAddress -notmatch '^172\.(1[6-9]|2[0-9]|3[01])\.' -and
        $_.InterfaceAlias -notmatch 'Loopback|vEthernet|WSL|Docker'
    } | Select-Object -ExpandProperty IPAddress

Write-Host "  Otros equipos pueden entrar con:" -ForegroundColor Cyan
foreach ($ip in $ips) {
    Write-Host "     http://${ip}:$Puerto" -ForegroundColor White
}
Write-Host ""
