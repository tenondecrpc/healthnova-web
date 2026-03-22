---
name: "SK: Propose"
description: "Create a new feature spec with all artifacts"
category: Workflow
tags: [workflow, spec, artifacts]
---

Create a new feature spec with all required artifacts in one step.

**Input**: The argument after `/sk:propose` is the feature name (kebab-case), OR a description of what to build.

---

## Steps

1. **If no input provided**, ask what the user wants to build. Derive a kebab-case name from their description.

2. **If `specs/<name>/` already exists**, ask if the user wants to continue it or start fresh.

3. **Read project constraints**
   - Read `specs/constitution.md` for immutable rules
   - Check existing specs for patterns and conventions: `ls specs/`

4. **Create `specs/<name>/` directory**

5. **Create artifacts in order**:

   **a. `research.md`** — Exploration: what was evaluated and why
   - Investigate the codebase for relevant existing code
   - Research options, alternatives, trade-offs
   - Document findings with clear sections

   **b. `spec.md`** — Requirements + decisions + contracts
   - Problem statement
   - Requirements (functional and non-functional)
   - Decisions with rationale (D1, D2, ... format matching existing specs)
   - Data contracts (Zod schemas, API interfaces) if applicable

   **c. `plan.md`** — Implementation phases
   - Break work into sequential phases
   - Each phase has clear scope and deliverables
   - Dependencies between phases are explicit

   **d. `tasks.md`** — Definition of done checklist
   - Concrete checkboxes per phase
   - Each task is testable/verifiable
   - Include test tasks per constitution §6

6. **Show summary** of what was created and prompt: "Run `/sk:apply <name>` to start implementing."

## Guidelines

- Follow the style of existing specs (check `specs/tech-stack-selection/` or `specs/ci-pipeline/` for reference)
- Decisions use `### D1:`, `### D2:` format
- All content in English (per constitution §5)
- No code comments unless user asks
- If context is unclear, ask the user — but prefer reasonable decisions to keep momentum

## Guardrails

- Do NOT write application code — only spec artifacts
- Ensure spec.md references constitution constraints where relevant
- Tasks must be granular enough for a single implementation session each
