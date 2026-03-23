# SDD Approach — HealthNova Web

## What is SDD?

Specification-Driven Development (SDD) is a methodology where specifications are written before code. Specs document the problem, exploration, decisions, and contracts — serving as the source of truth for both humans and AI coding agents.

There are three levels of SDD (per Martin Fowler's analysis):

- **Spec-first** — specs precede implementation but may be discarded after.
- **Spec-anchored** — specs persist and evolve alongside the code.
- **Spec-as-source** — specs are the primary artifact; code is generated and never manually edited.

This project uses **spec-anchored** — specs live in the repo, document decisions, and evolve with the codebase.

## Current approach: manual Spec Kit workflow (Proof of Concept)

For the initial phase of HealthNova, we follow [Spec Kit](https://github.com/github/spec-kit)'s artifact model manually — a lightweight, markdown-based approach with no external tooling dependency.

The project's artifact structure already aligns with Spec Kit's official workflow: Constitution → Specification → Plan → Tasks → Implementation. The only project-specific addition is `research.md` (exploration phase), which has no Spec Kit equivalent.

### Why manual for the PoC

- **Zero dependencies** — no CLI to install, just markdown files in `specs/`.
- **Full control** — we define the format, structure, and workflow ourselves.
- **Low friction** — any dev can read and write specs without learning a new tool.
- **Good enough to validate** — lets us test whether spec-anchored SDD works for the team before committing to a tool.

### Artifact structure

| Spec Kit artifact    | Project file      | Description                          |
| -------------------- | ----------------- | ------------------------------------ |
| Constitution         | `constitution.md` | Immutable project rules              |
| _(project-specific)_ | `research.md`     | Exploration: what was evaluated, why |
| Specification        | `spec.md`         | Requirements + decisions + contracts |
| Plan                 | `plan.md`         | Implementation phases                |
| Tasks                | `tasks.md`        | Definition of done checklist         |

```
specs/
  constitution.md                       # Constitution (Spec Kit)
  <feature-name>/
    research.md                         # Exploration (project-specific)
    spec.md                             # Specification (Spec Kit)
    plan.md                             # Plan (Spec Kit)
    tasks.md                            # Tasks (Spec Kit)
```

### Limitations of manual workflow

- **No spec deltas** — when requirements change, diffs are only visible in git history, not as a structured requirements-level diff.
- **No automation** — proposal generation, task decomposition, and archiving are manual.
- **No built-in validation** — nothing enforces that specs are complete or consistent (Spec Kit's `/speckit.analyze` and `/speckit.checklist` commands address this).
- **Scalability depends on discipline** — without tooling, the quality of specs is only as good as the team's commitment to writing them.

## Alternative: OpenSpec

**OpenSpec** (`@fission-ai/openspec`) is a CLI-based SDD tool that adds automation and structure on top of markdown specs.

### What it adds over the manual Spec Kit workflow

- **Spec deltas** — structured diffs at the requirements level, not just code
- **Automated workflow** — CLI generates proposals, designs, tasks, and delta specs
- **Standardized format** — SHALL statements, GIVEN/WHEN/THEN scenarios
- **30+ agent compatibility** — works with Claude Code, Cursor, Copilot, Gemini CLI, and others
- **Archive lifecycle** — merges change deltas into main specs
- **MIT licensed, no API key** — open source, specs are just markdown

### What it costs

- **CLI dependency** — requires `npm install -g @fission-ai/openspec@latest`
- **Change-driven model** — daily work revolves around temporary changes, not specs directly (see lifecycle comparison above)
- **Learning curve** — team must learn CLI commands, schemas, and artifact conventions
- **More moving parts** — `.openspec.yaml`, delta specs, archive step

### Migration path (if chosen)

1. Install: `npm install -g @fission-ai/openspec@latest`
2. Initialize: `openspec init`
3. Move existing `specs/<feature>/spec.md` content into `openspec/specs/<capability>/spec.md` format
4. The `constitution.md` content maps to OpenSpec's configuration and project-level rules

Existing research and decisions documented in Spec Kit specs remain valid.

## Spec Kit vs OpenSpec: lifecycle model

Both are spec-anchored, but they differ in how specs evolve:

|                  | Spec Kit (manual)                              | OpenSpec                                                |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Working artifact | The spec itself                                | A temporary "change"                                    |
| How specs evolve | Direct edits to `specs/<name>/spec.md`         | Delta specs proposed in the change, merged on archive   |
| Lifecycle        | Permanent — specs are the living documentation | Change → implement → archive → delta merge              |
| Archive step     | Not needed — specs persist in place            | Required — moves change to `archive/` and merges deltas |

**Spec Kit** is purely spec-anchored: you edit the specification, implement, and the spec reflects the current state. There is no intermediary artifact.

**OpenSpec** introduces a change-driven layer on top of spec-anchored: daily work revolves around changes (temporary), not specs (permanent). Specs update as a side effect of archiving a completed change. This makes OpenSpec a hybrid between spec-anchored and spec-first in practice.

The practical consequence: Spec Kit's workflow has no archive step because there is nothing to archive — the specification is always the living document. OpenSpec needs `/opsx:archive` to close the change lifecycle and sync deltas back to the main specs.

## CLI note: both OpenSpec and Spec Kit have optional CLIs

Both tools work without their CLIs — the AI agent slash commands (`/opsx:propose`, `/speckit.specify`, `/speckit.plan`, etc.) read and write markdown files directly. The CLIs add convenience, not core functionality:

- **Scaffolding** — `openspec init` / `specify init` create directories, templates, and config.
- **Inspection** — list, view, and validate specs outside the agent.
- **Updates** — update skills/prompts when a new version is released.

All of this can be done manually. This project already demonstrates it: Spec Kit's artifact workflow works with just markdown files and slash commands (`/speckit.specify`, `/speckit.implement`, etc.), no CLI installed.

**The CLI is most valuable for new projects that don't have SDD structure yet** — it bootstraps the directory layout and configuration so you can start using slash commands immediately instead of creating everything by hand.

### Installing the Spec Kit CLI (`specify`)

Requires Python 3.11+ and [uv](https://docs.astral.sh/uv/):

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

Initialize a new project:

```bash
specify init my-project --ai claude
```

### Installing the OpenSpec CLI

```bash
npm install -g @fission-ai/openspec@latest
openspec init
```

### Quick comparison

|                | OpenSpec                       | Spec Kit (GitHub)                           |
| -------------- | ------------------------------ | ------------------------------------------- |
| Runtime        | npm (Node)                     | uv (Python 3.11+)                           |
| CLI            | `openspec`                     | `specify`                                   |
| Slash commands | `/opsx:propose`, `/opsx:apply` | `/speckit.specify`, `/speckit.plan`         |
| Spec directory | `openspec/changes/<name>/`     | `specs/` (manual) / `.specify/specs/` (CLI) |
| Agent support  | Claude Code, Cursor, etc.      | 30+ agents                                  |
| Extras         | Custom schemas, profiles       | Extensions, presets, auto Git branching     |

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
