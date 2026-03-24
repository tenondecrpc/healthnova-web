#!/usr/bin/env bash
# create-new-feature.sh — Scaffold a new feature directory and git branch
#
# Usage: .specify/scripts/create-new-feature.sh "feature description"
# Example: .specify/scripts/create-new-feature.sh "patient vitals dashboard"
#
# Creates:
#   specs/NNN-feature-slug/
#     research.md   (blank)
#     spec.md       (from template)
#     plan.md       (from template)
#     tasks.md      (from template)
#   git branch: NNN-feature-slug

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

if [ $# -eq 0 ]; then
  error "Usage: $0 \"feature description\"\nExample: $0 \"patient vitals dashboard\""
fi

DESCRIPTION="$*"
NUM=$(next_feature_number)
SLUG=$(slugify "$DESCRIPTION")
BRANCH="${NUM}-${SLUG}"
FEATURE_DIR="$SPECS_DIR/$BRANCH"

info "Creating feature: $BRANCH"
info "  Description : $DESCRIPTION"
info "  Directory   : specs/$BRANCH/"
info "  Branch      : $BRANCH"
echo ""

# Confirm
read -r -p "Proceed? [y/N] " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || { info "Aborted."; exit 0; }

# Create directory
mkdir -p "$FEATURE_DIR"

# Create research.md (blank scaffold)
cat > "$FEATURE_DIR/research.md" << EOF
# Research — $(echo "$DESCRIPTION" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')

**Feature branch:** \`$BRANCH\`

---

## Exploration

[Document what was evaluated and why — existing code patterns, library options, tradeoffs.]

---

## Findings

[Key findings that inform decisions in spec.md.]
EOF

# Copy templates and replace placeholders
sed \
  -e "s/\[Feature Name\]/$(echo "$DESCRIPTION" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')/g" \
  -e "s/NNN-feature-name/$BRANCH/g" \
  "$TEMPLATES_DIR/spec-template.md" > "$FEATURE_DIR/spec.md"

sed \
  -e "s/\[Feature Name\]/$(echo "$DESCRIPTION" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')/g" \
  -e "s/NNN-feature-name/$BRANCH/g" \
  "$TEMPLATES_DIR/plan-template.md" > "$FEATURE_DIR/plan.md"

sed \
  -e "s/\[Feature Name\]/$(echo "$DESCRIPTION" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')/g" \
  -e "s/NNN-feature-name/$BRANCH/g" \
  "$TEMPLATES_DIR/tasks-template.md" > "$FEATURE_DIR/tasks.md"

success "Created specs/$BRANCH/ with 4 artifacts"

# Create git branch
if git -C "$PROJECT_ROOT" rev-parse --git-dir &>/dev/null; then
  if git -C "$PROJECT_ROOT" show-ref --verify --quiet "refs/heads/$BRANCH"; then
    warn "Branch '$BRANCH' already exists — skipping branch creation"
  else
    git -C "$PROJECT_ROOT" checkout -b "$BRANCH"
    success "Created and checked out branch: $BRANCH"
  fi
else
  warn "Not a git repo — skipping branch creation"
fi

echo ""
info "Next step: /speckit.clarify $BRANCH"
info "           /speckit.specify $BRANCH"
