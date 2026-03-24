# Tasks — Tech Stack Selection

**Feature branch:** `001-tech-stack-selection`
**Plan:** `specs/001-tech-stack-selection/plan.md`

> Tasks map 1:1 to plan phases. Check off each task as completed.
> `[P]` marks tasks that can be executed in parallel with other `[P]` tasks in the same group.

---

## Phase 1: [Phase name]

- [ ] Create `src/schemas/[name].ts` — Zod schema for [entity]
- [ ] `[P]` Create `src/services/[name].ts` — API service functions
- [ ] `[P]` Create `src/hooks/use-[name].ts` — TanStack Query hook
- [ ] Create `tests/schemas/[name].test.ts` — schema validation tests
- [ ] `[P]` Create `tests/services/[name].test.ts` — service unit tests
- [ ] `[P]` Create `tests/hooks/use-[name].test.ts` — hook tests

**Checkpoint:** `npm run test:run` passes for Phase 1 tests.

---

## Phase 2: [Phase name]

- [ ] Create `src/components/[feature]/[Component].tsx` — [description]
- [ ] `[P]` Create `src/components/[feature]/[Component].tsx` — [description]
- [ ] Create `tests/components/[feature]/[Component].test.tsx` — component tests

**Checkpoint:** Components render without errors; tests pass.

---

## Phase 3: Integration & Verification

- [ ] Wire Phase 1 hooks/services into Phase 2 components
- [ ] Update route/page in `src/app/(dashboard)/[route]/page.tsx`
- [ ] Verify all acceptance criteria from `spec.md` are met
- [ ] Run verification loop: `npm run lint` → `npx tsc --noEmit` → `npm run test:run`
- [ ] Mark spec status as `done` in `specs/001-tech-stack-selection/spec.md`

**Checkpoint:** All gates in `plan.md` Phase -1 are satisfied post-implementation.
