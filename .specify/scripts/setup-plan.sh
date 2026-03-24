#!/usr/bin/env bash
# setup-plan.sh — Validate that spec.md exists before allowing plan.md creation
#
# Usage: .specify/scripts/setup-plan.sh <feature-branch>
# Example: .specify/scripts/setup-plan.sh 001-tech-stack-selection

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

if [ $# -eq 0 ]; then
  error "Usage: $0 <feature-branch>\nExample: $0 001-patient-vitals"
fi

BRANCH="$1"
FEATURE_DIR="$SPECS_DIR/$BRANCH"

info "Validating spec for: $BRANCH"

# Check feature directory exists
[ -d "$FEATURE_DIR" ] || error "Feature directory not found: specs/$BRANCH/\nRun create-new-feature.sh first."

# Check spec.md exists
[ -f "$FEATURE_DIR/spec.md" ] || error "spec.md not found in specs/$BRANCH/\nRun /speckit.specify $BRANCH first."

# Check for unresolved NEEDS CLARIFICATION markers
UNRESOLVED=$(grep -c "\[NEEDS CLARIFICATION" "$FEATURE_DIR/spec.md" 2>/dev/null || true)
if [ "$UNRESOLVED" -gt 0 ]; then
  warn "$UNRESOLVED unresolved [NEEDS CLARIFICATION] marker(s) found in spec.md"
  warn "Resolve all clarifications before planning: /speckit.clarify $BRANCH"
  echo ""
  grep -n "\[NEEDS CLARIFICATION" "$FEATURE_DIR/spec.md" | head -20
  echo ""
  read -r -p "Continue anyway? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { info "Aborted. Resolve clarifications first."; exit 1; }
fi

success "spec.md validated — ready to create plan.md"
info "Next step: /speckit.plan $BRANCH"
