---
name: "Spec Kit: Tasks"
description: "Generate actionable task breakdown from a plan"
category: Workflow
tags: [workflow, tasks, breakdown]
---

Generate an actionable task breakdown from an existing plan.

**Input**: The argument after `/speckit.tasks` is the feature name matching `specs/<NNN>-name/`.

---

## Steps

1. **If no input provided**, list available specs and ask which to break down:

   ```bash
   ls specs/ | head -20
   ```

2. **Read spec artifacts**:
   - `specs/<NNN>-name/plan.md` — Implementation phases and deliverables
   - `specs/<NNN>-name/spec.md` — Requirements and user stories (for traceability)
   - `.specify/memory/constitution.md` — Project constraints (especially §6 Testing)

3. **Load the tasks template**:

   ```bash
   cat .specify/templates/tasks-template.md
   ```

4. **Create `specs/<NNN>-name/tasks.md`** — Task breakdown:
   - One section per plan phase
   - Concrete checkboxes — each task is independently verifiable
   - Mark parallelizable tasks with `[P]`
   - Each task maps to a specific file path in `src/` or `tests/`
   - Include test tasks per constitution §6 — every phase has test deliverables
   - End each phase section with a **Checkpoint** (e.g., `npm run test:run` passes)
   - Tasks should be granular enough for a single implementation session each

5. **Update CLAUDE.md** to reflect the active feature:

   ```bash
   .specify/scripts/update-claude-md.sh <NNN>-name
   ```

6. **Show summary** and prompt: "Run `/speckit.implement <NNN>-name` to start implementing."

## Guidelines

- Follow the style of existing task files (check `specs/*/tasks.md` for reference)
- Tasks must map to plan phases — no orphan tasks
- All content in English (per constitution §5)
- Parallel tasks (`[P]`) must not have dependencies on each other within the same group

## Guardrails

- Do NOT write application code — only the tasks artifact
- Do NOT create tasks.md if plan.md doesn't exist — ask the user to run `/speckit.plan` first
- Each task must be independently verifiable
- Do NOT mark tasks as `[P]` if they share a dependency
