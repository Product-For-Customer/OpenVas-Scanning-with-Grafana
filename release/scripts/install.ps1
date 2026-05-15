$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$ComposeFile = Join-Path $Root "docker-compose.release.yml"
$EnvFile = Join-Path $Root ".env"
$ImagesDir = Join-Path $Root "images"
$ReportsDir = Join-Path $Root "reports"

function Get-EnvValue {
    param (
        [string]$FilePath,
        [string]$Key
    )

    if (-not (Test-Path $FilePath)) {
        return ""
    }

    $line = Get-Content $FilePath | Where-Object {
        $_ -match "^\s*$Key\s*="
    } | Select-Object -First 1

    if (-not $line) {
        return ""
    }

    return ($line -replace "^\s*$Key\s*=", "").Trim()
}

if (-not (Test-Path $ComposeFile)) {
    Write-Host "ERROR: docker-compose.release.yml not found." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $EnvFile)) {
    Write-Host "ERROR: .env not found. Please create or copy .env into this folder first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ImagesDir)) {
    Write-Host "ERROR: images folder not found." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir | Out-Null
}

$BackendUrl = Get-EnvValue -FilePath $EnvFile -Key "VITE_BACKEND_URL"
$OpenvasUrl = Get-EnvValue -FilePath $EnvFile -Key "VITE_OPENVAS_URL"
$PathApiUrl = Get-EnvValue -FilePath $EnvFile -Key "PATH_API_URL"
$ReportPublicBaseUrl = Get-EnvValue -FilePath $EnvFile -Key "REPORT_PUBLIC_BASE_URL"

Write-Host "Loading backend image..." -ForegroundColor Cyan
docker load -i (Join-Path $ImagesDir "myscanner-backend-1.0.0.tar")

Write-Host "Loading frontend image..." -ForegroundColor Cyan
docker load -i (Join-Path $ImagesDir "myscanner-frontend-1.0.0.tar")

Write-Host "Starting services with latest .env..." -ForegroundColor Cyan
docker compose -f $ComposeFile --env-file $EnvFile up -d --force-recreate --remove-orphans

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Backend API from .env       : $BackendUrl" -ForegroundColor Green
Write-Host "OpenVAS from .env           : $OpenvasUrl" -ForegroundColor Green
Write-Host "PATH_API_URL from .env      : $PathApiUrl" -ForegroundColor Green
Write-Host "REPORT_PUBLIC_BASE_URL      : $ReportPublicBaseUrl" -ForegroundColor Green