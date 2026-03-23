---
name: "Spec Kit: Specify"
description: "Define requirements and specifications for a feature"
category: Workflow
tags: [workflow, spec, requirements]
---

Create a specification for a feature — the "what and why".

**Input**: The argument after `/speckit.specify` is the feature name (kebab-case), OR a description of what to build.

---

## Steps

1. **If no input provided**, ask what the user wants to build. Derive a kebab-case name from their description.

2. **If `specs/<name>/` already exists**, ask if the user wants to continue it or start fresh.

3. **Read project constraints**
   - Read `specs/constitution.md` for immutable rules
   - Check existing specs for patterns and conventions: `ls specs/`

4. **Create `specs/<name>/` directory** (if it doesn't exist)

5. **Create artifacts**:

   **a. `research.md`** — Exploration: what was evaluated and why
   - Investigate the codebase for relevant existing code
   - Research options, alternatives, trade-offs
   - Document findings with clear sections

   **b. `spec.md`** — Specification: requirements + decisions + contracts
   - Problem statement
   - Requirements (functional and non-functional)
   - Decisions with rationale (D1, D2, ... format matching existing specs)
   - Data contracts (Zod schemas, API interfaces) if applicable

6. **Show summary** of what was created and prompt next steps:
   - "Run `/speckit.plan <name>` to create the implementation plan."
   - "Run `/speckit.clarify <name>` if requirements need further exploration."

## Guidelines

- Follow the style of existing specs (check `specs/tech-stack-selection/` or `specs/ci-pipeline/` for reference)
- Decisions use `### D1:`, `### D2:` format
- All content in English (per constitution §5)
- No code comments unless user asks
- If context is unclear, ask the user — but prefer reasonable decisions to keep momentum

## Guardrails

- Do NOT write application code — only spec artifacts
- Ensure spec.md references constitution constraints where relevant
- Focus on the "what and why", not the "how" — that's for `/speckit.plan`
