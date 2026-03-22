# Research — Testing Infrastructure

## Context

HealthNova Web has zero testing infrastructure. Automated testing is a fundamental best practice for any production project — without it, quality is only validated in production and regressions go undetected. Next.js 16 official docs recommend Vitest for unit testing.

## Options evaluated

### O1: Vitest + React Testing Library

- **Pros**: Recommended by Next.js 16 docs. Native ESM support. Fast execution via Vite's transform pipeline. Compatible with `vite-tsconfig-paths` for `@/*` aliases. Built-in coverage via `@vitest/coverage-v8`. Watch mode by default. Same assertion API as Jest (`expect`).
- **Cons**: Requires `@vitejs/plugin-react` for JSX transform.
- **Verdict**: Selected.

### O2: Jest + React Testing Library

- **Pros**: Mature ecosystem. Widely documented.
- **Cons**: Slower than Vitest. Requires `next/jest` transformer and additional config for ESM modules. More boilerplate for TypeScript + path aliases. Next.js 16 docs list it as alternative, not primary recommendation.
- **Verdict**: Rejected. Next.js 16 recommends Vitest, and Vitest is faster with less config.

### O3: Playwright / Cypress for E2E

- **Pros**: Tests real browser behavior. Good for auth flows and full-page rendering.
- **Cons**: Slower, heavier dependency. Requires running dev server. Overkill for current project stage (most folders are scaffolded with .gitkeep).
- **Verdict**: Deferred. Will be evaluated when the app has real user flows to test.

## Key findings

- Next.js 16 docs: "async Server Components are new to the React ecosystem, Vitest currently does not support them. We recommend using E2E tests for async components."
- React Compiler (`babel-plugin-react-compiler`) is enabled in `next.config.ts`. Vitest uses `@vitejs/plugin-react` which handles JSX independently — no conflict.
- `@testing-library/react` v16+ supports React 19.
- `@testing-library/user-event` is preferred over `fireEvent` for realistic user interaction simulation.
- Test files can be colocated in `src/` or placed in a dedicated `tests/` directory. A dedicated directory keeps source and test concerns separated, simplifies glob patterns for CI, and avoids test files being bundled or processed by Next.js.
