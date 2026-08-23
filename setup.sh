#!/usr/bin/env bash
# Platinaa Ceramics - one-command local setup and dev server (macOS / Linux / Git Bash)
#   ./setup.sh            install if needed, then start the dev server
#   ./setup.sh --fresh    wipe node_modules + lockfile, reinstall, then start
#   ./setup.sh --build    production build into ./dist
#   ./setup.sh --preview  build, then serve the built site
set -euo pipefail
cd "$(dirname "$0")"

MIN_NODE_MAJOR=20
MODE="dev"
for arg in "$@"; do
  case "$arg" in
    --fresh)   MODE="fresh" ;;
    --build)   MODE="build" ;;
    --preview) MODE="preview" ;;
  esac
done

step() { printf '\n>> %s\n' "$1"; }
ok()   { printf '   OK  %s\n' "$1"; }
fail() { printf '   X   %s\n' "$1" >&2; }

echo
echo "  PLATINAA INDUSTRIAL CERAMICS"
echo "  Inert Alumina Ceramic Balls & Catalyst Bed Support Media"
echo "  ----------------------------------------------------------"

step "Checking Node.js"
if ! command -v node >/dev/null 2>&1; then
  fail "Node.js not found. Install the LTS build from https://nodejs.org/"
  exit 1
fi
NODE_VERSION="$(node -v)"
NODE_MAJOR="$(printf '%s' "${NODE_VERSION#v}" | cut -d. -f1)"
if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ]; then
  fail "Node $NODE_VERSION found, but Vite 8 needs Node $MIN_NODE_MAJOR or newer."
  exit 1
fi
ok "Node $NODE_VERSION / npm $(npm -v)"

if [ "$MODE" = "fresh" ]; then
  step "Fresh install - clearing previous dependencies"
  rm -rf node_modules package-lock.json dist
  ok "cleared"
fi

step "Installing dependencies"
if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  if [ -f package-lock.json ]; then
    npm ci || npm install
  else
    npm install
  fi
  ok "dependencies installed"
else
  ok "node_modules is up to date - skipping install"
fi

case "$MODE" in
  build)
    step "Building production bundle"
    npm run build
    ok "build written to ./dist - upload its contents to your web host"
    ;;
  preview)
    step "Building production bundle"
    npm run build
    step "Serving the production build (Ctrl+C to stop)"
    npm run preview
    ;;
  *)
    step "Starting the Vite dev server (Ctrl+C to stop)"
    npm run dev
    ;;
esac
