#!/usr/bin/env bash
# check-prerequisites.sh — Verify required tools are installed

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

info "Checking prerequisites for HealthNova Web..."

MISSING=0

check_command() {
  local cmd=$1
  local install_hint=$2
  if command -v "$cmd" &>/dev/null; then
    success "$cmd found ($(command -v "$cmd"))"
  else
    warn "$cmd NOT found — $install_hint"
    MISSING=$((MISSING + 1))
  fi
}

check_command "git"  "Install from https://git-scm.com"
check_command "node" "Install from https://nodejs.org (v20+ recommended)"
check_command "npm"  "Comes with Node.js"

# Optional: specify CLI
if command -v "specify" &>/dev/null; then
  success "specify CLI found ($(specify --version 2>/dev/null || echo 'version unknown'))"
else
  info "specify CLI not installed (optional — needed for CLI-managed upgrades)"
  info "Install: uv tool install specify-cli --from git+https://github.com/github/spec-kit.git"
fi

# Optional: uv (Python package manager, needed for specify CLI)
if command -v "uv" &>/dev/null; then
  success "uv found"
else
  info "uv not installed (needed only if you install the specify CLI)"
  info "Install: curl -LsSf https://astral.sh/uv/install.sh | sh"
fi

# Node version check
if command -v "node" &>/dev/null; then
  NODE_VER=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    success "Node.js v$NODE_VER (≥ 20 required)"
  else
    warn "Node.js v$NODE_VER found — v20+ recommended"
    MISSING=$((MISSING + 1))
  fi
fi

echo ""
if [ "$MISSING" -eq 0 ]; then
  success "All required prerequisites satisfied."
else
  warn "$MISSING prerequisite(s) missing. See hints above."
  exit 1
fi
