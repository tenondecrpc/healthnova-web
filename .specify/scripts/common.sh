#!/usr/bin/env bash
# common.sh — Shared utilities for Spec Kit scripts

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()    { echo -e "${BLUE}[spec-kit]${NC} $*"; }
success() { echo -e "${GREEN}[spec-kit]${NC} ✓ $*"; }
warn()    { echo -e "${YELLOW}[spec-kit]${NC} ⚠ $*"; }
error()   { echo -e "${RED}[spec-kit]${NC} ✗ $*" >&2; exit 1; }

# Project root (directory containing .specify/)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SPECIFY_DIR="$PROJECT_ROOT/.specify"
MEMORY_DIR="$SPECIFY_DIR/memory"
TEMPLATES_DIR="$SPECIFY_DIR/templates"
SPECS_DIR="$PROJECT_ROOT/specs"

# Get the next feature number (e.g., 004)
next_feature_number() {
  local max=0
  if [ -d "$SPECS_DIR" ]; then
    for dir in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
      [ -d "$dir" ] || continue
      local num
      num=$(basename "$dir" | grep -oE '^[0-9]+')
      [ "$num" -gt "$max" ] && max="$num"
    done
  fi
  printf "%03d" $((max + 1))
}

# Slugify a string to kebab-case
slugify() {
  echo "$*" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}
