---
name: "Spec Kit: Implement"
description: "Execute implementation from feature spec tasks"
category: Workflow
tags: [workflow, implementation]
---

Implement tasks from an existing feature spec.

**Input**: The argument after `/speckit.implement` is the feature name matching `specs/<name>/`.

---

## Steps

1. **If no input provided**, list available specs and ask which to implement:

   ```bash
   ls specs/
   ```

2. **Read all spec artifacts** in order:
   - `specs/<name>/spec.md` — Requirements and decisions
   - `specs/<name>/plan.md` — Implementation phases
   - `specs/<name>/tasks.md` — Task checklist
   - `specs/constitution.md` — Project constraints

3. **Identify incomplete tasks** from `tasks.md` (unchecked boxes)

4. **Execute tasks sequentially**:
   - Announce which task you're starting
   - Implement following the plan phases and spec decisions
   - Respect constitution constraints (stack, architecture, folder structure, security)
   - After completing each task, update `tasks.md` — check off the completed box

5. **On ambiguity or blockers**:
   - If a task contradicts the spec, stop and ask
   - If a task requires decisions not covered in spec.md, ask
   - Do NOT make undocumented architectural decisions silently

6. **After all tasks complete**, show summary:
   - Tasks completed
   - Any deviations from the plan (and why)
   - Suggest: "Run `/speckit.security <name>` to review before merging"

## Guidelines

- One task at a time — don't batch
- Commit after each logical unit of work if the user has asked for commits
- Follow existing code patterns in the codebase
- Tests are mandatory per constitution §6

## Guardrails

- Never skip tasks or mark them done without implementing
- Never modify spec artifacts without asking (specs are the source of truth)
- If you discover the plan is wrong, stop and discuss — don't silently deviate
