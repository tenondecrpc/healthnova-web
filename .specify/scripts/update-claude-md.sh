#!/usr/bin/env bash
# update-claude-md.sh — Inject active feature context into CLAUDE.md
#
# Usage: .specify/scripts/update-claude-md.sh <feature-branch>
# Example: .specify/scripts/update-claude-md.sh 004-patient-vitals
#
# Adds an ## Active Feature section to CLAUDE.md so Claude Code always
# knows which feature spec to load first in any new session.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

CLAUDE_MD="$PROJECT_ROOT/CLAUDE.md"

if [ $# -eq 0 ]; then
  # Called with no args → remove active feature section
  if grep -q "<!-- BEGIN:active-feature -->" "$CLAUDE_MD" 2>/dev/null; then
    sed -i.bak '/<!-- BEGIN:active-feature -->/,/<!-- END:active-feature -->/d' "$CLAUDE_MD"
    rm -f "$CLAUDE_MD.bak"
    success "Removed active feature from CLAUDE.md"
  else
    info "No active feature in CLAUDE.md — nothing to remove"
  fi
  exit 0
fi

BRANCH="$1"
FEATURE_DIR="$SPECS_DIR/$BRANCH"

[ -d "$FEATURE_DIR" ] || error "Feature directory not found: specs/$BRANCH/"

ACTIVE_BLOCK="<!-- BEGIN:active-feature -->

## Active Feature

**Branch:** \`$BRANCH\`

Load before working on any task:
- \`specs/$BRANCH/spec.md\`
- \`specs/$BRANCH/plan.md\`
- \`specs/$BRANCH/tasks.md\`

<!-- END:active-feature -->"

# Remove existing block if present
if grep -q "<!-- BEGIN:active-feature -->" "$CLAUDE_MD" 2>/dev/null; then
  sed -i.bak '/<!-- BEGIN:active-feature -->/,/<!-- END:active-feature -->/d' "$CLAUDE_MD"
  rm -f "$CLAUDE_MD.bak"
fi

# Append new block
echo "" >> "$CLAUDE_MD"
echo "$ACTIVE_BLOCK" >> "$CLAUDE_MD"

success "CLAUDE.md updated with active feature: $BRANCH"
info "To clear: .specify/scripts/update-claude-md.sh (no args)"
