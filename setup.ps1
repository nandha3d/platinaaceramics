<#
  Platinaa Ceramics - one-command local setup and dev server.

  Usage (from the project folder):
      .\setup.ps1              # install if needed, then start the dev server
      .\setup.ps1 -Fresh       # wipe node_modules + lockfile, reinstall, then start
      .\setup.ps1 -Build       # produce a production build in .\dist
      .\setup.ps1 -Preview     # build, then serve the built site locally
      .\setup.ps1 -Port 3000   # use a different port

  If Windows blocks the script, run once:
      Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#>

[CmdletBinding()]
param(
    [switch]$Fresh,
    [switch]$Build,
    [switch]$Preview,
    [int]$Port = 5173
)

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

$MinNodeMajor = 20

function Write-Step  { param($m) Write-Host "`n>> $m" -ForegroundColor Cyan }
function Write-Ok    { param($m) Write-Host "   OK  $m" -ForegroundColor Green }
function Write-Note  { param($m) Write-Host "   !   $m" -ForegroundColor Yellow }
function Write-Bad   { param($m) Write-Host "   X   $m" -ForegroundColor Red }

Write-Host ""
Write-Host "  PLATINAA INDUSTRIAL CERAMICS" -ForegroundColor White
Write-Host "  Inert Alumina Ceramic Balls and Catalyst Bed Support Media" -ForegroundColor DarkGray
Write-Host "  ----------------------------------------------------------" -ForegroundColor DarkGray

# ----------------------------------------------------------- 1. Node check
Write-Step "Checking Node.js"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Bad "Node.js is not installed or not on PATH."
    Write-Host "       Install the LTS build from https://nodejs.org/ then re-run." -ForegroundColor Yellow
    exit 1
}

$nodeVersion = (& node -v).TrimStart('v')
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt $MinNodeMajor) {
    Write-Bad "Node $nodeVersion found, but Vite 8 needs Node $MinNodeMajor or newer."
    exit 1
}
Write-Ok "Node v$nodeVersion"

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Bad "npm is not on PATH. Reinstall Node.js to restore it."
    exit 1
}
Write-Ok "npm v$(& npm -v)"

# ------------------------------------------------------- 2. Fresh (optional)
if ($Fresh) {
    Write-Step "Fresh install - clearing previous dependencies"
    foreach ($p in @('node_modules', 'package-lock.json', 'dist')) {
        if (Test-Path $p) {
            Remove-Item -Recurse -Force $p
            Write-Ok "removed $p"
        }
    }
}

# ---------------------------------------------------------- 3. Dependencies
Write-Step "Installing dependencies"

$needsInstall = $true
if ((Test-Path 'node_modules') -and (-not $Fresh)) {
    $pkgTime = (Get-Item 'package.json').LastWriteTime
    $modTime = (Get-Item 'node_modules').LastWriteTime
    if ($modTime -ge $pkgTime) {
        $needsInstall = $false
        Write-Ok "node_modules is up to date - skipping install"
    }
}

if ($needsInstall) {
    if (Test-Path 'package-lock.json') {
        Write-Host "   running: npm ci" -ForegroundColor DarkGray
        & npm ci
        if ($LASTEXITCODE -ne 0) {
            Write-Note "npm ci failed - falling back to npm install"
            & npm install
            if ($LASTEXITCODE -ne 0) { Write-Bad "npm install failed."; exit 1 }
        }
    }
    else {
        Write-Host "   running: npm install" -ForegroundColor DarkGray
        & npm install
        if ($LASTEXITCODE -ne 0) { Write-Bad "npm install failed."; exit 1 }
    }
    Write-Ok "dependencies installed"
}

# ------------------------------------------------------------ 4. Build modes
if ($Build -or $Preview) {
    Write-Step "Building production bundle"
    & npm run build
    if ($LASTEXITCODE -ne 0) { Write-Bad "Build failed."; exit 1 }
    Write-Ok "build written to .\dist"

    if ($Build -and (-not $Preview)) {
        Write-Host ""
        Write-Host "  Upload the contents of .\dist to your web host." -ForegroundColor White
        Write-Host ""
        exit 0
    }

    Write-Step "Serving the production build (Ctrl+C to stop)"
    & npm run preview
    exit $LASTEXITCODE
}

# ------------------------------------------------------------- 5. Dev server
Write-Step "Starting the Vite dev server"

$url = "http://localhost:$Port/"
Write-Host "   URL : $url" -ForegroundColor White
Write-Host "   Stop: press Ctrl and C" -ForegroundColor DarkGray
Write-Host ""

# Open the browser once the port answers, without blocking the server.
Start-Job -ScriptBlock {
    param($u, $p)
    for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Milliseconds 500
        try {
            $client = New-Object System.Net.Sockets.TcpClient
            $client.Connect('127.0.0.1', $p)
            $client.Close()
            Start-Process $u
            break
        }
        catch { }
    }
} -ArgumentList $url, $Port | Out-Null

& npm run dev -- --port $Port
