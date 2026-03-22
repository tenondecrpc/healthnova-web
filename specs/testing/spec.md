# Spec — Testing Infrastructure

## Status: draft

## Summary

Configure Vitest + React Testing Library as the unit/component testing framework for HealthNova Web, following Next.js 16 official recommendations. Establish conventions, helpers, and initial tests for existing code.

## Requirements

### Framework

- The project SHALL use Vitest as the test runner.
- The project SHALL use React Testing Library (`@testing-library/react`) for component testing.
- The project SHALL use `@testing-library/user-event` for simulating user interactions.
- The project SHALL use `@vitest/coverage-v8` for code coverage reporting.
- The project SHALL use `jsdom` as the test environment.
- The project SHALL use `vite-tsconfig-paths` to resolve the `@/*` path alias in tests.

### Configuration

- The project SHALL have a `vitest.config.mts` file at the project root.
- The `vitest.config.mts` SHALL configure `jsdom` environment, React plugin, and tsconfig paths.
- The `vitest.config.mts` SHALL exclude `node_modules`, `.next`, and `e2e` directories.
- The `vitest.config.mts` SHALL define coverage thresholds (to be enforced in CI later).
- The `package.json` SHALL include the following scripts:
  - `test` — run Vitest in watch mode.
  - `test:run` — run Vitest once (for CI).
  - `test:coverage` — run Vitest with coverage report.

### Conventions

- Test files SHALL live in a dedicated `tests/` directory at the project root, mirroring the `src/` structure.
- Test files SHALL use the suffix `.test.tsx` or `.test.ts`.
- Test files SHALL use `describe` / `it` blocks with descriptive names.
- Tests SHALL NOT import or test async Server Components directly (per Next.js 16 limitation — use E2E for those).
- Tests SHALL NOT contain PII or sensitive health data in fixtures or mocks.
- Mock data SHALL use obviously fake values (e.g., "Jane Doe", "test@example.com").

### Test helpers

- The project SHALL have a `tests/setup.ts` file for global test setup (RTL cleanup, custom matchers).
- The project SHALL have a `tests/test-utils.tsx` file that re-exports RTL's `render` wrapped with common providers (QueryClientProvider, etc.) as features are implemented.
- The `setup.ts` SHALL import `@testing-library/jest-dom/vitest` for DOM matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.).

### Initial tests

- The project SHALL include a test for `src/lib/utils.ts` at `tests/lib/utils.test.ts`.
- The project SHALL include a test for `src/components/ui/button.tsx` at `tests/components/ui/button.test.tsx`.
- The project SHALL include a test for `src/app/not-found.tsx` at `tests/app/not-found.test.tsx`.

## Decisions

### D1: Vitest over Jest

Next.js 16 officially recommends Vitest. It's faster, has native ESM support, requires less config for TypeScript + path aliases, and has built-in coverage.

### D2: Dedicated `tests/` directory over colocated tests

Tests live in a dedicated `tests/` directory at the project root, mirroring the `src/` folder structure. This keeps source code clean, simplifies CI glob patterns, and avoids test files being processed by Next.js. Setup and shared utilities (`setup.ts`, `test-utils.tsx`) live at `tests/` root level.

### D4: `@testing-library/jest-dom/vitest` for DOM assertions

Provides idiomatic matchers like `toBeInTheDocument()` instead of raw `toBeDefined()`. The `/vitest` entry point auto-extends Vitest's `expect` without manual augmentation.

### D5: Coverage thresholds start low, increase over time

Initial thresholds: 0% (no enforcement). As features are built and tested, thresholds will be raised. This avoids blocking development on a mostly-scaffolded project.

### D6: E2E deferred

Playwright/Cypress will be evaluated when the app has real user flows (auth, forms, navigation). Current stage is too early for E2E.
