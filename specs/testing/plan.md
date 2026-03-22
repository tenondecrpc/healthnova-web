# Plan — Testing Infrastructure

## Phase 1: Install dependencies

Install all testing devDependencies:

```
vitest @vitejs/plugin-react jsdom vite-tsconfig-paths
@testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
@vitest/coverage-v8
```

## Phase 2: Configuration files

1. Create `vitest.config.mts` at project root with:
   - `@vitejs/plugin-react` plugin for JSX transform.
   - `vite-tsconfig-paths` plugin for `@/*` alias resolution.
   - `jsdom` test environment.
   - Coverage config with `v8` provider.
   - Exclude patterns: `node_modules`, `.next`, `e2e`.
   - Setup file: `tests/setup.ts`.

2. Add scripts to `package.json`:
   - `"test": "vitest"`
   - `"test:run": "vitest run"`
   - `"test:coverage": "vitest run --coverage"`

## Phase 3: Test utilities

1. Create `tests/setup.ts`:
   - Import `@testing-library/jest-dom/vitest` for DOM matchers.
   - Import `@testing-library/react/cleanup-after-each` if needed (RTL auto-cleanup).

2. Create `tests/test-utils.tsx`:
   - Custom `render` function wrapping components with providers.
   - Re-export everything from `@testing-library/react`.
   - Initially minimal (no providers yet), will grow as features are added.

## Phase 4: Initial tests

1. `tests/lib/utils.test.ts` — Test `cn()` function:
   - Merges class names correctly.
   - Handles conditional classes.
   - Resolves Tailwind conflicts via `tailwind-merge`.

2. `tests/components/ui/button.test.tsx` — Test Button component:
   - Renders with default variant.
   - Renders each variant (default, destructive, outline, secondary, ghost, link).
   - Renders each size (default, sm, lg, icon).
   - Forwards ref correctly.
   - Applies custom className.

3. `tests/app/not-found.test.tsx` — Test NotFound page:
   - Renders 404 message.

## Phase 5: Verify

1. Run `npm run test:run` — all tests pass.
2. Run `npm run test:coverage` — coverage report generates.
3. Run `npm run build` — build still succeeds (no interference).
