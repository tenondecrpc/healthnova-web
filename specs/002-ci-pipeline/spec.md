# Spec — CI Pipeline

**Feature branch:** `002-ci-pipeline`
**Status:** `done`

---

## Summary

Implement a continuous integration (CI) pipeline using GitHub Actions to automatically verify code quality, types, and test passing on every pull request and push to main.

---

## User Stories

### US-1: Automated checks

**As a** team member,
**I want to** have automated checks run on every PR,
**So that** I don't accidentally merge broken code, failing tests, or formatting issues into the main branch.

**Acceptance Criteria:**

- [x] GitHub action triggers on push to main and on PR.
- [x] The pipeline runs `npm run lint`.
- [x] The pipeline runs `npx tsc --noEmit`.
- [x] The pipeline runs tests using Vitest.

---

## Requirements

### Functional

- The project SHALL have a GitHub Actions workflow in `.github/workflows/ci.yml`.
- The workflow SHALL trigger on push to `main` and on pull requests.
- The workflow SHALL install dependencies using `npm ci`.
- The workflow SHALL run type checking via `tsc`.
- The workflow SHALL run linting via ESLint.
- The workflow SHALL run tests via Vitest in CI mode (`test:run`).

### Non-functional

- The workflow execution SHALL be as fast as possible utilizing cache.

---

## Decisions

### D1: GitHub Actions for CI

Since the repository is hosted on GitHub, GitHub Actions provides the most seamless and integrated CI experience without needing external platforms.

### D2: Fail fast on Lint and Types before Tests

The jobs should either run in parallel or sequence, but type checking and linting should fail the build before running potentially heavier test suites if there are basic syntax or typing errors.

---

## Review & Acceptance Checklist

- [x] All [NEEDS CLARIFICATION] markers resolved
- [x] Requirements are testable and unambiguous
- [x] Decisions reference constitution constraints
- [x] No speculative or "might need" features included
- [x] Security rules (constitution §4) addressed
- [x] Test tasks included (constitution §6)
