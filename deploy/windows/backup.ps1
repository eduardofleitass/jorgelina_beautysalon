<#
.SYNOPSIS
    Backup de los datos del sitio (reservas de clientes).

.DESCRIPTION
    Comprime backend/data y mantiene los ultimos 30 backups.

.PARAMETER Destino
    Carpeta donde guardar los .zip. Default: deploy\windows\backups
#>

param([string]$Destino = "")

$ErrorActionPreference = 'Stop'

$raiz = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path (Join-Path $raiz 'backend'))) {
    $raiz = Split-Path -Parent $PSScriptRoot
}

if (-not $Destino) {
    $Destino = Join-Path $PSScriptRoot 'backups'
}
if (-not (Test-Path $Destino)) {
    New-Item -ItemType Directory -Path $Destino -Force | Out-Null
}

$dataDir = Join-Path $raiz 'backend\data'
if (-not (Test-Path $dataDir)) {
    Write-Host "  No hay datos para respaldar ($dataDir)" -ForegroundColor DarkYellow
    exit 0
}

$fecha = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$archivo = Join-Path $Destino "datos_$fecha.zip"

Compress-Archive -Path (Join-Path $dataDir '*') -DestinationPath $archivo -Force

Write-Host "  Backup creado: $archivo" -ForegroundColor Green

# Retencion: ultimos 30
$viejos = Get-ChildItem -Path $Destino -Filter 'datos_*.zip' |
    Sort-Object LastWriteTime -Descending |
    Select-Object -Skip 30

foreach ($v in $viejos) {
    Remove-Item $v.FullName -Force
    Write-Host "  Backup viejo eliminado: $($v.Name)" -ForegroundColor DarkGray
}

Write-Host "  Total de backups: $((Get-ChildItem -Path $Destino -Filter 'datos_*.zip').Count)" -ForegroundColor Cyan
