# Spec — Tech Stack Selection

**Feature branch:** `001-tech-stack-selection`
**Status:** `done`

---

## Summary

Define and install the complete frontend technology stack for HealthNova, a medical dashboard consuming an external backend API with AWS Cognito authentication.

---

## User Stories

### US-1: Developer setup

**As a** developer,
**I want to** have a modern, typing-safe, and performant tech stack already configured,
**So that** I can start building features immediately without worrying about boilerplate or incompatible libraries.

**Acceptance Criteria:**

- [x] Next.js 16 installed with App Router
- [x] React 19 + TypeScript + Tailwind v4 + shadcn/ui configured
- [x] Auth, state management, forms, and charts dependencies installed

---

## Requirements

### Functional

- The project SHALL use Next.js 16 with App Router as the application framework.
- The project SHALL use React 19 with React Compiler for automatic optimization.
- The project SHALL use TypeScript 5 for static type safety.
- The project SHALL use Tailwind CSS 4 for utility-first styling.
- The project SHALL use shadcn/ui with Radix UI primitives for accessible UI components.
- The project SHALL use AWS Amplify v6 for Cognito authentication integration.
- The project SHALL use TanStack Query v5 for server state management and caching.
- The project SHALL use Zustand v5 for lightweight client-side UI state.
- The project SHALL use react-hook-form v7 with Zod v4 for form validation.
- The project SHALL use recharts v3 for health data visualization.
- The project SHALL use next-intl v4 for internationalization with SSR support.
- The project SHALL use axios for HTTP requests with Cognito JWT interceptors.

### Non-functional

- The feature SHALL comply with constitution §4 (security rules).

---

## Decisions

### D1: Amplify over next-auth for authentication

Cognito is the auth provider. Amplify gives us native token management, login/registration flows, and an SSR adapter for Next.js. Adding next-auth would be a redundant abstraction layer.

### D2: TanStack Query over SWR/Redux for server state

TanStack Query offers superior mutation support, cache invalidation, and devtools. SWR is simpler but weaker for mutations. Redux is over-engineered when server state is handled by a dedicated library.

### D3: Zustand over Redux/Context for client state

UI state (sidebar, filters, preferences) doesn't need Redux's ceremony. Zustand provides a minimal API with no boilerplate. React Context was rejected due to performance issues with frequent updates.

### D4: recharts over d3/tremor for charts

recharts is React-native and composable. d3 is too low-level for a dashboard. tremor is redundant with shadcn/ui.

### D5: next-intl over i18next for i18n

next-intl is purpose-built for Next.js App Router with SSR support and locale-based routing. i18next requires manual SSR setup.

### D6: React Compiler over manual memoization

React Compiler handles memoization automatically. Manual useMemo/useCallback should only be used if profiling proves necessity.

---

## Review & Acceptance Checklist

- [x] All [NEEDS CLARIFICATION] markers resolved
- [x] Requirements are testable and unambiguous
- [x] Decisions reference constitution constraints
- [x] No speculative or "might need" features included
- [x] Security rules (constitution §4) addressed
- [x] Test tasks included (constitution §6)
