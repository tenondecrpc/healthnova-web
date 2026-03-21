# Plan — Folder Structure

## Phases

### Phase 1: Create directory structure

1. Create `src/components/composed/`
2. Create feature component dirs: `src/components/auth/`, `src/components/dashboard/`, `src/components/patients/`, `src/components/appointments/`
3. Create `src/schemas/`
4. Create `src/hooks/`
5. Create `src/services/`
6. Create `src/stores/`
7. Create `src/i18n/`
8. Create `src/types/`
9. Add `.gitkeep` to all empty directories

### Phase 2: Create route groups

1. Create `src/app/(auth)/` with `layout.tsx`
2. Create `src/app/(dashboard)/` with `layout.tsx`
3. Move `src/app/page.tsx` into `src/app/(dashboard)/page.tsx`
4. Create `src/app/not-found.tsx`

### Phase 3: Verify

1. Verify `components.json` aliases resolve correctly
2. Verify `npm run build` passes
