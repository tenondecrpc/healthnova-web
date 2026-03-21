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

- The frontend consumes an external backend API. There is no database in this project.
- Zod schemas are the source of truth for data contracts, form validation, and API response validation.
- Components must use Radix UI primitives via shadcn/ui for accessibility compliance.
- React Compiler handles memoization — do not use manual `useMemo` / `useCallback` unless profiling proves necessity.

## 3. Code standards

- All markdown files in English.
- No code comments unless explicitly requested.
- Prettier + prettier-plugin-tailwindcss enforces formatting.
- ESLint with next config enforces code quality.

## 4. Spec-kit workflow

- Every non-trivial feature must have a spec before implementation.
- Specs live in `specs/<feature-name>/` with: `research.md`, `spec.md`, `plan.md`, `tasks.md`.
- Decisions are documented in `spec.md` — no separate ADR files.
- This constitution can only be amended by explicit team consensus.
