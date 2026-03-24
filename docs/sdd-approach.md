# SDD Approach — HealthNova Web

## What is SDD?

Specification-Driven Development (SDD) is a methodology where specifications are written before code. Specs document the problem, exploration, decisions, and contracts — serving as the source of truth for both humans and AI coding agents.

There are three levels of SDD (per Martin Fowler's analysis):

- **Spec-first** — specs precede implementation but may be discarded after.
- **Spec-anchored** — specs persist and evolve alongside the code.
- **Spec-as-source** — specs are the primary artifact; code is generated and never manually edited.

This project uses **spec-anchored** — specs live in the repo, document decisions, and evolve with the codebase.

## Current approach: Spec Kit (CLI-compatible)

This project follows [Spec Kit](https://github.com/github/spec-kit)'s artifact model in a structure fully compatible with the `specify` CLI. The setup is **CLI-augmented**: the slash commands work without the CLI installed, but the CLI provides upgrades, scaffolding scripts, and tooling compatibility.

### Artifact structure

| Spec Kit artifact    | Project file                      | Description                          |
| -------------------- | --------------------------------- | ------------------------------------ |
| Constitution         | `.specify/memory/constitution.md` | Immutable project rules              |
| _(project-specific)_ | `specs/<NNN>-name/research.md`    | Exploration: what was evaluated, why |
| Specification        | `specs/<NNN>-name/spec.md`        | Requirements + decisions + contracts |
| Plan                 | `specs/<NNN>-name/plan.md`        | Implementation phases                |
| Tasks                | `specs/<NNN>-name/tasks.md`       | Definition of done checklist         |

```
.specify/
  memory/
    constitution.md                   # Constitution (canonical)
  scripts/
    check-prerequisites.sh
    common.sh
    create-new-feature.sh             # Scaffolds feature dir + git branch
    setup-plan.sh                     # Validates spec before planning
    update-claude-md.sh               # Injects active feature into CLAUDE.md
  templates/
    spec-template.md                  # Spec artifact template
    plan-template.md                  # Plan artifact template (with Phase -1 gates)
    tasks-template.md                 # Tasks artifact template (with [P] markers)

specs/
  <NNN>-feature-name/                 # Feature directories (sequentially numbered)
    research.md                       # Exploration (project-specific)
    spec.md                           # Specification (Spec Kit)
    plan.md                           # Plan (Spec Kit)
    tasks.md                          # Tasks (Spec Kit)

.claude/
  commands/
    speckit.constitution.md           # Create/update constitution
    speckit.clarify.md                # Explore requirements
    speckit.specify.md                # Create feature spec
    speckit.analyze.md                # Validate spec (optional)
    speckit.plan.md                   # Create implementation plan
    speckit.tasks.md                  # Generate task breakdown
    speckit.implement.md              # Execute tasks
    speckit.checklist.md              # Verify acceptance criteria (optional)
```

### Full workflow

```
/speckit.constitution    → Create/update .specify/memory/constitution.md
/speckit.clarify         → Explore requirements, surface ambiguities
/speckit.specify         → Create spec.md (uses create-new-feature.sh)
/speckit.analyze         → Validate spec completeness [optional]
/speckit.plan            → Create plan.md (uses setup-plan.sh)
/speckit.tasks           → Create tasks.md (marks active feature in CLAUDE.md)
/speckit.implement       → Execute tasks, check off completed ones
/speckit.checklist       → Verify acceptance criteria [optional]
```

---

## Installing the Specify CLI

The CLI is optional for daily development but required for:

- Upgrading slash commands when Spec Kit releases new versions
- Bootstrapping new projects
- Running `specify check` to validate the toolchain

### Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (fast Python package manager)

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install specify CLI (pin to stable release)
# Check https://github.com/github/spec-kit/releases for the latest tag
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# Verify installation
specify check

# See available commands
specify --help
```

### Upgrading project files

When Spec Kit releases new commands or templates:

```bash
# Back up your constitution first (it gets overwritten by --force)
cp .specify/memory/constitution.md .specify/memory/constitution-backup.md

# Upgrade (safe — never touches your specs/ directory)
specify init --here --force --ai claude

# Restore your customized constitution
mv .specify/memory/constitution-backup.md .specify/memory/constitution.md
```

### What the CLI updates vs what stays safe

| Updated by CLI          | Never touched by CLI                             |
| ----------------------- | ------------------------------------------------ |
| `.claude/commands/*.md` | `specs/**` (all your feature specs)              |
| `.specify/scripts/`     | `src/**` (all your code)                         |
| `.specify/templates/`   | `.specify/memory/constitution.md` ⚠️ (see above) |
| `CLAUDE.md`             | `.git/` history                                  |

---

## Alternative: OpenSpec

**OpenSpec** (`@fission-ai/openspec`) is a CLI-based SDD tool that adds automation and structure on top of markdown specs.

### What it adds over the manual Spec Kit workflow

- **Spec deltas** — structured diffs at the requirements level, not just code
- **Automated workflow** — CLI generates proposals, designs, tasks, and delta specs
- **Standardized format** — SHALL statements, GIVEN/WHEN/THEN scenarios
- **30+ agent compatibility** — works with Claude Code, Cursor, Copilot, Gemini CLI, and others
- **Archive lifecycle** — merges change deltas into main specs
- **MIT licensed, no API key** — open source, specs are just markdown

### Migration path (if chosen)

1. Install: `npm install -g @fission-ai/openspec@latest`
2. Initialize: `openspec init`
3. Move existing `specs/<feature>/spec.md` content into `openspec/specs/<capability>/spec.md` format
4. The `constitution.md` content maps to OpenSpec's configuration and project-level rules

---

## Spec Kit vs OpenSpec: lifecycle model

|                  | Spec Kit (this project)                        | OpenSpec                                                |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Working artifact | The spec itself                                | A temporary "change"                                    |
| How specs evolve | Direct edits to `specs/<name>/spec.md`         | Delta specs proposed in the change, merged on archive   |
| Lifecycle        | Permanent — specs are the living documentation | Change → implement → archive → delta merge              |
| Archive step     | Not needed — specs persist in place            | Required — moves change to `archive/` and merges deltas |

---

## Tools evaluated and discarded

### Gentle-AI (Gentleman Programming)

A Go-based ecosystem configurator that includes a 9-phase SDD workflow alongside memory, persona, skills, and MCP server management.

**Discarded because:**

- Modifies global `~/.claude/` configuration (CLAUDE.md, settings.json, MCP servers), affecting all projects on the machine.
- Significant overlap with existing tools already in use (claude-mem for memory, CLAUDE.md for conventions).
- Would require maintaining a fork to scope installations to project-level only.
- Higher adoption barrier for teams — requires buy-in to the full ecosystem, not just the SDD workflow.

### DIY (custom markdown conventions)

A fully manual approach with no tooling or predefined format.

**Discarded because:**

- Not standardizable across teams without significant discipline overhead.
- No automation, no validation, no structured change tracking.
- Essentially what the manual Spec Kit approach is, but without even a conventional structure to follow.
