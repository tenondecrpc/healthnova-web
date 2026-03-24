---
name: "Spec Kit: Implement"
description: "Execute implementation from feature spec tasks"
category: Workflow
tags: [workflow, implementation]
---

Implement tasks from an existing feature spec.

**Input**: The argument after `/speckit.implement` is the feature name matching `specs/<NNN>-name/`.

---

## Steps

1. **If no input provided**, list available specs and ask which to implement:

   ```bash
   ls specs/ | head -20
   ```

2. **Read all spec artifacts** in order:
   - `.specify/memory/constitution.md` — Project constraints (stack, architecture, security)
   - `specs/<NNN>-name/spec.md` — Requirements and decisions
   - `specs/<NNN>-name/plan.md` — Implementation phases and Phase -1 gates
   - `specs/<NNN>-name/tasks.md` — Task checklist

3. **Verify Phase -1 gates** in `plan.md` — all constitution checks must pass before starting.

4. **Identify incomplete tasks** from `tasks.md` (unchecked boxes `- [ ]`)

5. **Execute tasks sequentially** (respect `[P]` parallel groups where safe):
   - Announce which task you're starting
   - Implement following the plan phases and spec decisions
   - Respect constitution constraints (stack, architecture, folder structure, security)
   - After completing each task, update `tasks.md` — check off the completed box (`- [x]`)
   - After completing each phase, verify the phase **Checkpoint** passes

6. **On ambiguity or blockers**:
   - If a task contradicts the spec, stop and ask
   - If a task requires decisions not covered in spec.md, ask
   - Do NOT make undocumented architectural decisions silently

7. **After all tasks complete**, run the verification loop:

   ```bash
   npm run lint && npx tsc --noEmit && npm run test:run
   ```

8. **Show summary**:
   - Tasks completed
   - Any deviations from the plan (and why)
   - Update spec status to `done` in `spec.md`
   - Clear active feature from CLAUDE.md: `.specify/scripts/update-claude-md.sh`
   - Suggest: "Run `/speckit.security <NNN>-name` to review before merging"

## Guidelines

- One task at a time — don't batch
- Commit after each logical unit of work if the user has asked for commits
- Follow existing code patterns in the codebase
- Tests are mandatory per constitution §6

## Guardrails

- Never skip tasks or mark them done without implementing
- Never modify spec artifacts without asking (specs are the source of truth)
- If you discover the plan is wrong, stop and discuss — don't silently deviate
- Respect constitution §3 folder structure — files go where the spec says
