# Research — Folder Structure

## Context

The project has a minimal src/ directory (boilerplate from create-next-app + shadcn init). We need a scalable folder structure before writing any feature code.

### Current state

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    favicon.ico
  components/
    ui/
      button.tsx              ← shadcn atom
  lib/
    utils.ts                  ← cn() helper
```

### Constraints from existing config

- `tsconfig.json` alias: `@/*` → `./src/*`
- `components.json` aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`
- shadcn installs components into `src/components/ui/` — this cannot change.

## Atomic Design — what applies and what doesn't

Brad Frost's Atomic Design defines 5 levels: atoms → molecules → organisms → templates → pages.

| Level         | Classic definition                                                  | In this project                                    |
| ------------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| **Atoms**     | Smallest UI elements (button, input, label)                         | `components/ui/` — already handled by shadcn       |
| **Molecules** | Groups of atoms (search bar, form field with label + input + error) | Composed components that combine shadcn primitives |
| **Organisms** | Complex UI sections (header, sidebar, data table with filters)      | Feature-level composed sections                    |
| **Templates** | Page-level layouts with placeholder content                         | Next.js `layout.tsx` files handle this natively    |
| **Pages**     | Templates with real data                                            | Next.js `page.tsx` files handle this natively      |

### Key insight

Templates and Pages are already solved by Next.js App Router conventions (`layout.tsx`, `page.tsx`). Duplicating them as component folders would fight the framework.

The practical question is: how to organize molecules and organisms?

### Option A: Strict atomic folders

```
components/
  ui/                   ← atoms (shadcn)
  molecules/            ← all molecules flat
  organisms/            ← all organisms flat
```

**Problem**: as the app grows, `molecules/` becomes a dump of 50+ unrelated components. The classification "is this a molecule or organism?" creates friction and inconsistency.

### Option B: Feature-based grouping

```
components/
  ui/                   ← atoms (shadcn)
  common/               ← shared molecules/organisms (used across features)
  auth/                 ← auth-specific composed components
  dashboard/            ← dashboard-specific composed components
  patients/             ← patient-specific composed components
```

**Problem**: components that start feature-specific often become shared. Constant refactoring of imports when moving between folders.

### Option C: Hybrid — atomic for shared, feature for scoped

```
components/
  ui/                   ← atoms (shadcn)
  composed/             ← shared molecules/organisms (stat-card, search-bar, data-table)
  [feature]/            ← feature-specific components that are NOT reusable
```

**Selected**: Option C. Reasons:

- `ui/` is already atoms (shadcn owns this)
- `composed/` holds anything reusable that combines atoms — no molecule/organism distinction needed
- Feature folders hold components tightly coupled to a specific domain
- Components graduate from feature → composed when reused elsewhere

## Clean code principles applied

| Principle                  | Application                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Single Responsibility**  | Each folder has one reason to exist. `schemas/` = contracts. `hooks/` = reusable logic. `services/` = API calls. |
| **Dependency Rule**        | UI depends on schemas, not the other way around. Services depend on schemas for validation.                      |
| **Colocation**             | Feature-specific components live near their feature. Shared components live in `composed/`.                      |
| **Screaming Architecture** | Looking at `src/` tells you what the app does (auth, dashboard, patients), not what framework it uses.           |

## Next.js 16 conventions to respect

- `app/` is for routing only — route groups `(auth)`, `(dashboard)` for organization.
- `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` are reserved filenames.
- `params` and `searchParams` are async — must be awaited.
- `middleware.ts` is now `proxy.ts`.
- Colocating non-route files in `app/` is safe but adds noise — prefer `components/` + `lib/`.
