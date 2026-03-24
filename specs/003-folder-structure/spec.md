# Spec — Folder Structure

**Feature branch:** `003-folder-structure`
**Status:** `done`

---

## Summary

Define the folder structure for HealthNova Web using a hybrid approach: Atomic Design for the component layer, feature-based grouping for domain logic, and Next.js App Router conventions for routing.

---

## User Stories

### US-1: Organized Codebase

**As a** team member,
**I want to** have a predictable and scalable folder structure,
**So that** I know exactly where to find and place components, hooks, schemas, and routes as the application grows.

**Acceptance Criteria:**

- [x] `app/` is strictly for routing and layouts.
- [x] `components/` follows a hybrid atomic/feature design.
- [x] `schemas/` exists at the top level as the single source of truth.

---

## Requirements

### Functional

- The structure SHALL separate routing (`app/`) from business logic and UI components.
- The structure SHALL use shadcn's `components/ui/` as the atomic layer — no parallel atoms folder.
- The structure SHALL use `components/composed/` for shared molecules and organisms — no strict molecule/organism distinction.
- The structure SHALL group feature-specific components under `components/<feature>/`.
- The structure SHALL use Zod schemas in `schemas/` as the single source of truth for data contracts.
- The structure SHALL use route groups in `app/` to separate auth and authenticated flows.
- The structure SHALL colocate hooks, services, and stores as flat folders under `src/`.

---

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

---

## Review & Acceptance Checklist

- [x] All [NEEDS CLARIFICATION] markers resolved
- [x] Requirements are testable and unambiguous
- [x] Decisions reference constitution constraints
- [x] No speculative or "might need" features included
- [x] Security rules (constitution §4) addressed
- [x] Test tasks included (constitution §6)
