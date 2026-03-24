---
name: "Spec Kit: Specify"
description: "Define requirements and specifications for a feature"
category: Workflow
tags: [workflow, spec, requirements]
---

Create a specification for a feature — the "what and why".

**Input**: The argument after `/speckit.specify` is the feature name (`NNN-kebab-case` matching `specs/<NNN>-name/`), OR a description of what to build (the number will be auto-assigned).

---

## Steps

1. **If no input provided**, ask what the user wants to build. Derive a kebab-case slug from their description.

2. **Determine the feature number**:
   - If the user provided a number (`004-...`), use it.
   - If not, scan existing `specs/` directories to determine the next number.

3. **If `specs/<NNN>-name/` already exists**, ask if the user wants to continue it or start fresh.

4. **Read project constraints**:
   - Read `.specify/memory/constitution.md` for immutable rules
   - Check existing specs for patterns and conventions: `ls specs/ | head -20`

5. **Scaffold the feature directory** (if it doesn't exist):

   ```bash
   .specify/scripts/create-new-feature.sh "<description>"
   ```

   This creates `specs/<NNN>-name/` with all 4 artifacts from templates and the git branch.

6. **Populate artifacts**:

   **a. `research.md`** — Exploration: what was evaluated and why
   - Investigate the codebase for relevant existing code
   - Research options, alternatives, trade-offs
   - Document findings with clear sections

   **b. `spec.md`** — Specification: requirements + decisions + data contracts
   - Problem statement
   - User stories with acceptance criteria
   - Requirements using SHALL statements
   - Mark ambiguities: `[NEEDS CLARIFICATION: <question>]`
   - Decisions with rationale (D1, D2, ... format matching existing specs)
   - Data contracts (Zod schemas, API interfaces) if applicable
   - Review & Acceptance Checklist

7. **Validate** the Review & Acceptance Checklist in `spec.md` — check items that are satisfied.

8. **Show summary** of what was created and prompt next steps:
   - "Run `/speckit.clarify <NNN>-name` if requirements need further exploration."
   - "Run `/speckit.plan <NNN>-name` to create the implementation plan."

## Guidelines

- Follow the style of existing specs (check `specs/tech-stack-selection/` or `specs/ci-pipeline/` for reference)
- Feature directories use sequential numeric prefix: `001-`, `002-`, `003-`...
- Decisions use `### D1:`, `### D2:` format
- All content in English (per constitution §5)
- No code comments unless user asks
- If context is unclear, ask the user — but prefer reasonable decisions to keep momentum
- If `[NEEDS CLARIFICATION]` markers exist, note them in the summary and suggest running `/speckit.clarify`

## Guardrails

- Do NOT write application code — only spec artifacts
- Ensure spec.md references constitution constraints where relevant
- Focus on the "what and why", not the "how" — that's for `/speckit.plan`
- Do NOT create plan.md or tasks.md during this step
