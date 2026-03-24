---
name: "Spec Kit: Checklist"
description: "Review a feature spec against its acceptance criteria checklist"
category: Workflow
tags: [workflow, checklist, review, acceptance]
---

Review a feature implementation against its spec's acceptance criteria and constitution compliance checklist.

**Input**: The argument after `/speckit.checklist` is the feature name matching `specs/<NNN>-name/`.

---

## Steps

1. **If no input provided**, list available specs and ask which to check:

   ```bash
   ls specs/ | head -20
   ```

2. **Read artifacts**:
   - `specs/<NNN>-name/spec.md` — Acceptance criteria (User Stories + checklist)
   - `specs/<NNN>-name/tasks.md` — Task completion status
   - `.specify/memory/constitution.md` — Governing constraints

3. **For each User Story acceptance criterion**, verify against the implementation:
   - Read relevant source files
   - Check that the criterion is demonstrably met
   - Mark: ✅ PASSED | ❌ FAILED | ⚠️ PARTIAL | 🔍 NEEDS MANUAL VERIFICATION

4. **Check the Review & Acceptance Checklist** in `spec.md`:
   - `No [NEEDS CLARIFICATION] markers remain` — scan spec.md
   - `Requirements are testable and unambiguous` — review each SHALL statement
   - `Decisions reference constitution constraints` — check D1, D2... sections
   - `No speculative features included` — verify scope matches original intent
   - `Security rules (§4) addressed` — check auth gates and data handling
   - `Test tasks included (§6)` — confirm tests exist in `tasks.md` and `tests/`

5. **Check task completion status** in `tasks.md`:

   ```bash
   grep -c "^\- \[x\]" specs/<NNN>-name/tasks.md
   grep -c "^\- \[ \]" specs/<NNN>-name/tasks.md
   ```

6. **Output a pass/fail report**:
   - Summary: X/Y acceptance criteria met, Z tasks completed
   - For each failing criterion: what's missing and what needs to change

7. **Recommend next step**:
   - All passed → "Ready for `/speckit.security <NNN>-name`"
   - Some failing → "Fix the issues above, then re-run `/speckit.checklist <NNN>-name`"

## Guardrails

- Do NOT mark criteria as passed without evidence from the codebase
- Be specific about what was checked and how
- Do NOT modify spec.md or tasks.md during this review — only report
