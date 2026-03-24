# HealthNova Web

Web dashboard for a preventive health platform. Consumes a separate backend API authenticated via Cognito JWT.

<!-- BEGIN:nextjs-agent-rules -->

## ⚠️ This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Rules

- When using bash commands, always pipe output to limit results: `grep` add `| head -20`, `ls` add `| head -30`. Never display more than 30 lines of command output.
- No PII or sensitive health data in logs, error messages, or client-side storage.
- Health data must only be displayed to the authenticated user who owns it.
- Read `.specify/memory/constitution.md` for stack constraints and immutable project rules.

## Navigation

1. Query claude-mem first (`mem-search` or `$CMEM`)
2. If relevant context is found, use it to locate files
3. If not found, proceed with repo search
4. Always verify paths with Glob/Grep before acting

## Spec Kit workflow (SDD)

- Every non-trivial feature must have a spec in `specs/<NNN>-feature-name/` before implementation.
- Feature directories use sequential numeric prefix: `001-`, `002-`, `003-`…
- Only read the specific spec you need — do not load all specs into context.
- Artifact model follows [Spec Kit](https://github.com/github/spec-kit): Constitution → Specification → Plan → Tasks → Implementation.
- Commands (full workflow):
  1. `/speckit.constitution` — Create or update project principles
  2. `/speckit.clarify` — Explore requirements and surface ambiguities
  3. `/speckit.specify` — Define the spec (what + why)
  4. `/speckit.analyze` — Validate spec completeness (optional but recommended)
  5. `/speckit.plan` — Define the implementation plan (how)
  6. `/speckit.tasks` — Break plan into actionable tasks
  7. `/speckit.implement` — Execute tasks
  8. `/speckit.checklist` — Verify acceptance criteria (optional)
- See `docs/sdd-approach.md` for rationale and CLI installation instructions.

## Spec Kit CLI (`specify`)

Install to get script scaffolding and upgrades:

```bash
# Prerequisites: Python 3.11+ and uv
# Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh

# Install specify CLI (pin to stable release — check https://github.com/github/spec-kit/releases)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# Verify installation
specify check

# Upgrade project files (safe — never touches your specs/)
specify init --here --force --ai claude
```

The CLI is **optional** for daily work (slash commands work without it) but required for:

- Upgrading slash commands to new Spec Kit versions
- Initializing new projects from scratch

## Project automation scripts

```bash
.specify/scripts/check-prerequisites.sh          # Verify required tools
.specify/scripts/create-new-feature.sh "name"    # Scaffold feature + branch
.specify/scripts/setup-plan.sh <NNN>-name        # Validate spec before planning
.specify/scripts/update-claude-md.sh <NNN>-name  # Set active feature in context
.specify/scripts/update-claude-md.sh             # Clear active feature
```
