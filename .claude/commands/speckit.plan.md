---
name: "Spec Kit: Plan"
description: "Create technical implementation plan from a specification"
category: Workflow
tags: [workflow, plan, architecture]
---

Create a technical implementation plan — the "how".

**Input**: The argument after `/speckit.plan` is the feature name matching `specs/<name>/`.

---

## Steps

1. **If no input provided**, list available specs and ask which to plan:

   ```bash
   ls specs/
   ```

2. **Read spec artifacts**:
   - `specs/<name>/spec.md` — Requirements and decisions
   - `specs/<name>/research.md` — Exploration context (if exists)
   - `specs/constitution.md` — Project constraints (stack, architecture, folder structure)

3. **Create `specs/<name>/plan.md`** — Implementation plan:
   - Break work into sequential phases
   - Each phase has clear scope and deliverables
   - Dependencies between phases are explicit
   - Reference architecture decisions from spec.md
   - Respect constitution constraints (stack, folder structure, security)

4. **Show summary** and prompt: "Run `/speckit.tasks <name>` to generate the task breakdown."

## Guidelines

- Follow the style of existing plans (check other `specs/*/plan.md` for reference)
- Plan should be implementable from the spec alone — no undocumented assumptions
- All content in English (per constitution §5)
- If the spec is unclear or incomplete, stop and suggest: "Run `/speckit.clarify <name>` first."

## Guardrails

- Do NOT write application code — only the plan artifact
- Do NOT create plan.md if spec.md doesn't exist — ask the user to run `/speckit.specify` first
- Focus on the "how" — requirements belong in spec.md, not here
