---
name: "Spec Kit: Constitution"
description: "Create or update the project's governing principles in .specify/memory/constitution.md"
category: Workflow
tags: [workflow, constitution, principles]
---

Create or update the project constitution — the immutable set of governing principles that all specs, plans, and implementations must respect.

**Input**: Optional description of the focus areas for the constitution (e.g., "focus on security, testing, and performance requirements").

---

## Steps

1. **Read existing constitution** (if it exists):

   ```bash
   cat .specify/memory/constitution.md
   ```

   If it doesn't exist, start from the template in `.specify/templates/` (or create from scratch).

2. **If creating from scratch**, structure the constitution with these sections:
   - Stack constraints (frameworks, libraries, and what is NOT allowed)
   - Architecture rules (patterns, data flow, forbidden patterns)
   - Folder structure rules (where things live)
   - Security rules (PII, auth, data sensitivity)
   - Code standards (formatting, linting, comments policy)
   - Testing (where tests live, what must be tested)
   - Spec Kit workflow (how features flow from spec → implementation)

3. **Write the constitution** to `.specify/memory/constitution.md`

4. **Validate**:
   - Every rule is actionable and checkable
   - No ambiguous language ("try to", "should consider") — use "SHALL" and "must"
   - Security rules address the project's specific domain (health data)

5. **Show summary** of sections created/updated and prompt:
   - "Run `/speckit.specify <feature>` to create your first feature spec."

## Guidelines

- The constitution is **immutable** — it can only change by explicit team decision
- Write rules that a coding agent can verify: "No components colocated inside `app/`" not "keep things organized"
- Reference specific tools and libraries — not generic concepts
- All content in English (per §5 if adopting that convention)

## Guardrails

- Do NOT add speculative rules — only rules that are already decided
- Do NOT write application code — only the constitution artifact
- Constitution lives at `.specify/memory/constitution.md` — never move it
