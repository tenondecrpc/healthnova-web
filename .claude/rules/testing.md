---
paths:
  - "tests/**/*.{ts,tsx}"
  - "vitest.config.mts"
---

# Testing Rules

- Test runner: **Vitest** (not Jest).
- Tests live in a dedicated `tests/` directory at the project root, mirroring the `src/` structure.
- Every feature spec must include test tasks in `tasks.md`.
- Tests must not contain PII or sensitive health data in fixtures or mocks.
- Use `npx vitest` to run tests; use `npx vitest --coverage` for coverage reports.
