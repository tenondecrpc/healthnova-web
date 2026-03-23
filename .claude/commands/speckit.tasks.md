---
name: "Spec Kit: Tasks"
description: "Generate actionable task breakdown from a plan"
category: Workflow
tags: [workflow, tasks, breakdown]
---

Generate an actionable task breakdown from an existing plan.

**Input**: The argument after `/speckit.tasks` is the feature name matching `specs/<name>/`.

---

## Steps

1. **If no input provided**, list available specs and ask which to break down:

   ```bash
   ls specs/
   ```

2. **Read spec artifacts**:
   - `specs/<name>/plan.md` — Implementation phases
   - `specs/<name>/spec.md` — Requirements and decisions
   - `specs/constitution.md` — Project constraints

3. **Create `specs/<name>/tasks.md`** — Task breakdown:
   - Concrete checkboxes per phase (from plan.md)
   - Each task is testable/verifiable
   - Include test tasks per constitution §6
   - Tasks should be granular enough for a single implementation session each

4. **Show summary** and prompt: "Run `/speckit.implement <name>` to start implementing."

## Guidelines

- Follow the style of existing task files (check other `specs/*/tasks.md` for reference)
- Tasks must map to plan phases — no orphan tasks
- All content in English (per constitution §5)

## Guardrails

- Do NOT write application code — only the tasks artifact
- Do NOT create tasks.md if plan.md doesn't exist — ask the user to run `/speckit.plan` first
- Each task must be independently verifiable
