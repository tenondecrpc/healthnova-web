# SDD Approach — HealthNova Web

## What is SDD?

Spec-Driven Development (SDD) is a methodology where specifications are written before code. Specs document the problem, exploration, decisions, and contracts — serving as the source of truth for both humans and AI coding agents.

There are three levels of SDD (per Martin Fowler's analysis):

- **Spec-first** — specs precede implementation but may be discarded after.
- **Spec-anchored** — specs persist and evolve alongside the code.
- **Spec-as-source** — specs are the primary artifact; code is generated and never manually edited.

This project uses **spec-anchored** — specs live in the repo, document decisions, and evolve with the codebase.

## Current approach: Spec-kit (Proof of Concept)

For the initial phase of HealthNova, we use a **Spec-kit style** workflow — a lightweight, manual, markdown-based approach with no external tooling dependency.

### Why Spec-kit for the PoC

- **Zero dependencies** — no CLI to install, just markdown files in `specs/`.
- **Full control** — we define the format, structure, and workflow ourselves.
- **Low friction** — any dev can read and write specs without learning a new tool.
- **Good enough to validate** — lets us test whether spec-anchored SDD works for the team before committing to a tool.

### Structure

```
specs/
  constitution.md                       # Immutable project rules
  <feature-name>/
    research.md                         # Exploration: what was evaluated and why
    spec.md                             # Requirements + decisions + contracts
    plan.md                             # Implementation phases
    tasks.md                            # Definition of done checklist
```

### Limitations

- **No spec deltas** — when requirements change, diffs are only visible in git history, not as a structured requirements-level diff.
- **No automation** — proposal generation, task decomposition, and archiving are manual.
- **No built-in validation** — nothing enforces that specs are complete or consistent.
- **Scalability depends on discipline** — without tooling, the quality of specs is only as good as the team's commitment to writing them.

## Recommended for production: OpenSpec

Once the PoC validates that spec-anchored SDD works for the team, the recommendation is to migrate to **OpenSpec** (`@fission-ai/openspec`).

### Why OpenSpec for production

- **Spec deltas** — when a change is proposed, OpenSpec generates a structured diff of requirements (not just code). This makes it clear what changed at the intent level.
- **Automated workflow** — `openspec:proposal` analyzes existing specs and codebase, then generates proposal, design, tasks, and spec deltas automatically.
- **Standardized format** — requirements use SHALL statements, scenarios use GIVEN/WHEN/THEN. Consistent across teams and projects.
- **30+ agent compatibility** — works natively with Claude Code, Cursor, Copilot, Gemini CLI, and others. The team is not locked into a single AI tool.
- **Archive lifecycle** — `openspec archive` merges change deltas into main specs, keeping the spec tree clean.
- **MIT licensed, no API key** — open source, no external service dependency. Specs are just markdown in the repo.

### Migration path

The migration from Spec-kit to OpenSpec is straightforward:

1. Install: `npm install -g @fission-ai/openspec@latest`
2. Initialize: `openspec init`
3. Move existing `specs/<feature>/spec.md` content into OpenSpec's `openspec/specs/<capability>/spec.md` format (Purpose + SHALL requirements + GIVEN/WHEN/THEN scenarios).
4. The `constitution.md` content maps to OpenSpec's configuration and project-level rules.

Existing research and decisions documented in Spec-kit specs remain valid and can be referenced during migration.

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
- Essentially what Spec-kit is, but without even a conventional structure to follow.
