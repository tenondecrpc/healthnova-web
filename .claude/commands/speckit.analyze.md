---
name: "Spec Kit: Analyze"
description: "Analyze an existing spec for completeness, consistency, and constitution compliance"
category: Workflow
tags: [workflow, analyze, validation]
---

Analyze a feature spec to identify gaps, inconsistencies, and constitution violations before planning or implementation.

**Input**: The argument after `/speckit.analyze` is the feature name matching `specs/<NNN>-name/`, or empty to analyze all specs.

---

## Steps

1. **If no input provided**, list available specs and ask which to analyze (or offer to analyze all):

   ```bash
   ls specs/ | head -20
   ```

2. **Read all available artifacts** for the feature:
   - `.specify/memory/constitution.md` — Governing principles
   - `specs/<NNN>-name/research.md` — Exploration context (if exists)
   - `specs/<NNN>-name/spec.md` — Requirements and decisions
   - `specs/<NNN>-name/plan.md` — Implementation plan (if exists)
   - `specs/<NNN>-name/tasks.md` — Task list (if exists)

3. **Run analysis checks**:

   ### Spec Completeness
   - [ ] Summary is clear and one paragraph
   - [ ] User stories have "As a / I want / So that" format
   - [ ] All acceptance criteria are testable (not vague)
   - [ ] Requirements use SHALL statements
   - [ ] No `[NEEDS CLARIFICATION]` markers remain unresolved
   - [ ] Data contracts defined where API interaction exists
   - [ ] Decisions section explains "why" not just "what"

   ### Constitution Compliance
   - [ ] Stack constraints respected (§1) — no unauthorized libraries referenced
   - [ ] Architecture rules followed (§2) — Zod as source of truth, no manual memoization
   - [ ] Folder structure rules respected (§3) — no components in `app/`, schemas top-level
   - [ ] Security rules addressed (§4) — PII handling mentioned where relevant
   - [ ] Tests included in plan/tasks (§6)

   ### Plan/Tasks Coherence (if plan.md exists)
   - [ ] Phase -1 gates are all addressed
   - [ ] Every phase has test deliverables
   - [ ] Tasks map back to plan phases (no orphan tasks)
   - [ ] Parallel tasks `[P]` have no dependencies on each other

4. **Output a structured report**:
   - List each failing check with: file, what's missing, and suggested fix
   - Categorize as: BLOCKING (must fix before proceeding) | ADVISORY (recommended)

5. **Show summary** and suggest next steps:
   - If BLOCKING issues: "Fix these before running `/speckit.plan`"
   - If ADVISORY only: "Spec is ready for planning. Run `/speckit.plan <NNN>-name`"

## Guardrails

- Do NOT fix issues yourself — only report them (unless user explicitly asks)
- Do NOT rewrite the spec — suggest specific targeted edits
- Report only real gaps — don't invent problems where none exist
