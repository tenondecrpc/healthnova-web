---
name: "Spec Kit: Plan"
description: "Create technical implementation plan from a specification"
category: Workflow
tags: [workflow, plan, architecture]
---

Create a technical implementation plan — the "how".

**Input**: The argument after `/speckit.plan` is the feature name matching `specs/<NNN>-name/`.

---

## Steps

1. **If no input provided**, list available specs and ask which to plan:

   ```bash
   ls specs/ | head -20
   ```

2. **Validate spec is ready**:

   ```bash
   .specify/scripts/setup-plan.sh <NNN>-name
   ```

   This verifies `spec.md` exists and has no unresolved `[NEEDS CLARIFICATION]` markers.

3. **Read spec artifacts**:
   - `.specify/memory/constitution.md` — Project constraints (stack, architecture, folder structure)
   - `specs/<NNN>-name/spec.md` — Requirements, user stories, decisions
   - `specs/<NNN>-name/research.md` — Exploration context (if exists)

4. **Load the plan template**:

   ```bash
   cat .specify/templates/plan-template.md
   ```

5. **Create `specs/<NNN>-name/plan.md`** — Implementation plan:
   - Complete the **Phase -1: Pre-Implementation Gates** checklist
   - Break work into sequential phases (Phase 1, 2, 3…)
   - Each phase has clear scope, deliverables, and test deliverables
   - Mark tasks that can run in parallel with `[P]`
   - Dependencies between phases are explicit
   - Reference architecture decisions from spec.md
   - Respect constitution constraints (stack, folder structure, security)
   - Document any complexity exceptions in "Complexity tracking"

6. **Show summary** and prompt: "Run `/speckit.tasks <NNN>-name` to generate the task breakdown."

## Guidelines

- Follow the style of existing plans (check `specs/*/plan.md` for reference)
- Plan should be implementable from the spec alone — no undocumented assumptions
- All content in English (per constitution §5)
- If the spec is unclear or incomplete, stop and suggest: "Run `/speckit.clarify <NNN>-name` first."

## Guardrails

- Do NOT write application code — only the plan artifact
- Do NOT create plan.md if spec.md doesn't exist — ask the user to run `/speckit.specify` first
- Do NOT continue if `[NEEDS CLARIFICATION]` markers remain unresolved (or get explicit user consent)
- Focus on the "how" — requirements belong in spec.md, not here
