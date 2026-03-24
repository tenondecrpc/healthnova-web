# Spec — [Feature Name]

**Feature branch:** `NNN-feature-name`
**Status:** `draft` | `in-progress` | `done`

---

## Summary

[One paragraph: what is this feature, who does it serve, and why does it matter.]

---

## User Stories

### US-1: [Story title]

**As a** [role],
**I want to** [action],
**So that** [outcome].

**Acceptance Criteria:**

- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
- [ ] [Testable criterion 3]

### US-2: [Story title]

**As a** [role],
**I want to** [action],
**So that** [outcome].

**Acceptance Criteria:**

- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]

---

## Requirements

### Functional

- The feature SHALL [requirement]. [NEEDS CLARIFICATION: if unclear]
- The feature SHALL [requirement].
- The feature SHALL NOT [anti-requirement].

### Non-functional

- The feature SHALL [performance/security/accessibility requirement].
- The feature SHALL comply with constitution §4 (security rules).

---

## Decisions

### D1: [Decision title]

[Rationale: why this choice over alternatives. Reference constitution constraints where relevant.]

### D2: [Decision title]

[Rationale.]

---

## Data contracts

[Zod schemas for API responses and form inputs, if applicable. Otherwise remove this section.]

```typescript
// Example
export const featureSchema = z.object({
  id: z.string().uuid(),
  // ...
});
```

---

## Review & Acceptance Checklist

- [ ] All [NEEDS CLARIFICATION] markers resolved
- [ ] Requirements are testable and unambiguous
- [ ] Decisions reference constitution constraints
- [ ] No speculative or "might need" features included
- [ ] Security rules (constitution §4) addressed
- [ ] Test tasks included (constitution §6)
