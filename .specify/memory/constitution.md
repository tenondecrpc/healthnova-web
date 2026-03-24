# Constitution — HealthNova Web

> Immutable architectural principles governing all changes to this project.
> Any spec or change that violates these rules must be flagged before implementation.

## 1. Stack constraints

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Auth**: AWS Cognito via `aws-amplify` — no other auth provider
- **Server state**: TanStack Query — no SWR, no Redux
- **Client state**: Zustand — only for UI-level state (sidebar, filters, preferences)
- **Forms**: react-hook-form + Zod schemas via `@hookform/resolvers`
- **Charts**: recharts integrated with shadcn chart components
- **i18n**: next-intl with App Router SSR
- **HTTP**: axios with Cognito JWT interceptors

## 2. Architecture rules

- The frontend consumes an external REST API authenticated via Cognito JWT tokens. There is no database in this project.
- Zod schemas are the source of truth for data contracts, form validation, and API response validation.
- Components must use Radix UI primitives via shadcn/ui for accessibility compliance.
- React Compiler handles memoization — do not use manual `useMemo` / `useCallback` unless profiling proves necessity.

## 3. Folder structure rules

- `app/` is routing only — no components, no business logic. Use route groups `(auth)` and `(dashboard)`.
- `components/ui/` is atoms (shadcn owns this). `components/composed/` is shared molecules/organisms. `components/<feature>/` is feature-scoped.
- `schemas/` is top-level — everything depends on schemas, schemas depend on nothing.
- `hooks/`, `services/`, `stores/` are flat. Split by domain only when a folder exceeds ~15 files.
- No components colocated inside `app/`.
- Full structure documented in `specs/folder-structure/spec.md`.

## 4. Security rules

- No PII or sensitive health data in logs, error messages, or client-side storage.
- Health data must only be displayed to the authenticated user who owns it.
- Treat all health data as sensitive — follow privacy-first practices for rendering and caching.

## 5. Code standards

- All markdown files in English.
- No code comments unless explicitly requested.
- Prettier + prettier-plugin-tailwindcss enforces formatting.
- ESLint with next config enforces code quality.

## 6. Testing

- Every feature spec must include test tasks in `tasks.md`.
- Tests live in a dedicated `tests/` directory at the project root, mirroring the `src/` structure.
- Tests must not contain PII or sensitive health data in fixtures or mocks.

## 7. Spec Kit workflow

- Every non-trivial feature must have a spec before implementation.
- Specs live in `specs/<NNN>-feature-name/` with: `research.md`, `spec.md`, `plan.md`, `tasks.md`.
- Feature directories use sequential numeric prefixes (001, 002, 003…) for ordering.
- Decisions are documented in `spec.md` — no separate ADR files.
- Workflow commands: `/speckit.constitution` → `/speckit.clarify` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`.
- This constitution can only be amended by explicit team consensus.
