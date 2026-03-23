---
name: "Spec Kit: Verify"
description: "Run autonomous verification loop (lint, type-check, test) and fix issues"
category: Workflow
tags: [workflow, verify, lint, test, tsc, loop]
---

Run a strict, autonomous verification loop to ensure code quality and correctness.

**Input**: Optional specific path or component to verify. If empty, runs globally.

---

## Steps

1. **Acknowledge the goal**: You are entering a Verification Loop. You will run checks, analyze failures, fix the code, and repeat until all checks pass.

2. **Execute the Verification Loop**:
   Run the following checks sequentially. If any step fails, stop, fix the issues, and restart the loop from the failing step. Do not proceed to the next check until the current one passes.

   **a. Linter (ESLint)**
   - Run: `npm run lint` or `npx eslint .` (adjust path if input provided)
   - If errors: fix them, then run again.

   **b. Type Checker (TypeScript)**
   - Run: `npx tsc --noEmit`
   - If errors: fix the type definitions, then run again.

   **c. Tests (Vitest)**
   - Run: `npm run test --run` (or target specific test file based on input)
   - If failures: fix the implementation or the test, then run again.

3. **Fixing Guidelines**:
   - Do NOT disable rules (e.g., `// @ts-ignore`, `eslint-disable`) unless absolutely necessary and justified in a comment.
   - Ensure fixes adhere to the project's `specs/constitution.md` (e.g., proper use of Zod schemas, React Compiler memoization rules).
   - If a fix requires architectural changes, pause and ask the user for guidance.

4. **Completion Summary**:
   - Once all checks pass, output a concise summary of the issues found and fixed.
   - Suggest running `/speckit.tasks` to mark the current task as done, or `/speckit.security` if applicable.

## Guardrails

- Be mindful of token usage: Pipe large test or lint outputs (e.g., `npx tsc --noEmit | head -n 50`) to avoid flooding the context.
- If you are stuck in a loop (failing -> fixing -> failing with same error > 3 times), STOP and ask the user for help.
