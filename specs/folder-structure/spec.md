# Spec — Folder Structure

## Status: done

## Summary

Define the folder structure for HealthNova Web using a hybrid approach: Atomic Design for the component layer, feature-based grouping for domain logic, and Next.js App Router conventions for routing.

## Requirements

- The structure SHALL separate routing (`app/`) from business logic and UI components.
- The structure SHALL use shadcn's `components/ui/` as the atomic layer — no parallel atoms folder.
- The structure SHALL use `components/composed/` for shared molecules and organisms — no strict molecule/organism distinction.
- The structure SHALL group feature-specific components under `components/<feature>/`.
- The structure SHALL use Zod schemas in `schemas/` as the single source of truth for data contracts.
- The structure SHALL use route groups in `app/` to separate auth and authenticated flows.
- The structure SHALL colocate hooks, services, and stores as flat folders under `src/`.

## Folder structure

```
src/
  app/                                  # Routing layer (Next.js App Router)
    (auth)/                             # Route group: unauthenticated pages
      login/
        page.tsx
      register/
        page.tsx
      layout.tsx
    (dashboard)/                        # Route group: authenticated pages
      page.tsx                          # Dashboard home
      patients/
        page.tsx
        [id]/
          page.tsx
      appointments/
        page.tsx
      settings/
        page.tsx
      layout.tsx                        # Sidebar + header layout
    layout.tsx                          # Root layout (fonts, providers)
    globals.css
    not-found.tsx

  components/                           # UI layer
    ui/                                 # Atoms — shadcn primitives (button, input, card, etc.)
    composed/                           # Shared molecules/organisms — reusable across features
    auth/                               # Auth-specific components (login form, register form)
    dashboard/                          # Dashboard-specific components (stats grid, overview)
    patients/                           # Patient-specific components (patient card, vitals chart)
    appointments/                       # Appointment-specific components

  schemas/                              # Data contracts — Zod schemas (source of truth)

  hooks/                                # Custom React hooks (useAuth, useMediaQuery, etc.)

  services/                             # API layer — axios instances, endpoint functions

  stores/                               # Client state — Zustand stores

  lib/                                  # Utilities — helpers, config, constants
    utils.ts                            # cn() helper (already exists)

  i18n/                                 # Internationalization — next-intl messages and config

  types/                                # Shared TypeScript types (derived or auxiliary)
```

## Decisions

### D1: Hybrid atomic over strict atomic folders

Strict atomic (atoms/molecules/organisms) creates classification friction. With shadcn, atoms are already in `ui/`. Everything else that's shared goes in `composed/` — whether it's a molecule or organism is irrelevant to the developer.

### D2: Route groups over nested layouts for auth/dashboard split

`(auth)` and `(dashboard)` route groups separate public and authenticated flows without affecting URLs. Each group gets its own layout — auth gets a centered card layout, dashboard gets sidebar + header.

### D3: Schemas as top-level folder, not inside features

Schemas are shared across components, hooks, services, and forms. Nesting them inside features would create circular import temptations. Top-level `schemas/` enforces the dependency rule: everything depends on schemas, schemas depend on nothing.

### D4: Flat hooks/services/stores over feature-nested

At this project's scale, flat folders with descriptive filenames are simpler than nested feature dirs. If a folder grows past ~15 files, split by domain then (e.g., `services/patients.ts`, `services/auth.ts` → `services/patients/`, `services/auth/`).

### D5: No components colocated inside app/

Although Next.js 16 allows colocating non-route files in `app/`, keeping `app/` routing-only makes the routing tree scannable. All UI lives in `components/`.

## Acceptance criteria

- [ ] All folders created with a `.gitkeep` where empty
- [ ] Existing files (`components/ui/button.tsx`, `lib/utils.ts`) remain in place
- [ ] `components.json` aliases still resolve correctly
- [ ] `npm run build` passes
