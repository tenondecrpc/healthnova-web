# Research — Tech Stack Selection

> Exploration of libraries and frameworks for the HealthNova medical dashboard.

## Context

HealthNova is a greenfield medical dashboard that consumes an external backend API with AWS Cognito authentication. It needs to display health data visualizations, support internationalization, and provide form-heavy workflows for patient and appointment management.

## Areas investigated

### Authentication

| Option | Evaluated | Verdict |
|---|---|---|
| `aws-amplify` + `@aws-amplify/adapter-nextjs` | Native Cognito support, login/registration/token refresh, SSR adapter for Next.js App Router | **Selected** |
| `next-auth` (Auth.js) | Generic OAuth — requires custom Cognito provider config, no native Amplify token management | Rejected — redundant layer over Cognito |

### Data fetching & server state

| Option | Evaluated | Verdict |
|---|---|---|
| `@tanstack/react-query` | Intelligent caching, refetch strategies, devtools, mutation support | **Selected** |
| `swr` | Simpler but inferior DX for mutations and cache invalidation | Rejected |
| `redux` + RTK Query | Over-engineered for a project that splits server/client state | Rejected |

### Client state

| Option | Evaluated | Verdict |
|---|---|---|
| `zustand` | Minimal API, no boilerplate, perfect for UI state (sidebar, filters, preferences) | **Selected** |
| `redux` | Over-engineered for UI-only state | Rejected |
| React Context | Performance issues with frequent updates | Rejected |

### Charts & data visualization

| Option | Evaluated | Verdict |
|---|---|---|
| `recharts` | React-native, composable, integrates with shadcn chart components | **Selected** |
| `d3` | Overkill — low-level, imperative API not suited for React dashboard | Rejected |
| `tremor` | Redundant with shadcn/ui, less customizable | Rejected |

### UI component system

| Option | Evaluated | Verdict |
|---|---|---|
| `shadcn/ui` (Radix + Tailwind + CVA) | Copy-paste architecture, full ownership, accessible via Radix primitives | **Selected** |
| Material UI | Opinionated styling conflicts with Tailwind approach | Rejected |
| Ant Design | Heavy bundle, design language mismatch | Rejected |

### Forms & validation

| Option | Evaluated | Verdict |
|---|---|---|
| `react-hook-form` + `zod` + `@hookform/resolvers` | Performant (uncontrolled), schema-based validation, type-safe | **Selected** |
| Formik | Controlled inputs — performance concerns with large medical forms | Rejected |

### Internationalization

| Option | Evaluated | Verdict |
|---|---|---|
| `next-intl` | Built for Next.js App Router, SSR support, locale-based routing | **Selected** |
| `i18next` / `react-i18next` | Generic — requires manual SSR setup for App Router | Rejected |

### Data tables

| Option | Evaluated | Verdict |
|---|---|---|
| `@tanstack/react-table` | Headless, sortable, filterable, pagination, integrates with shadcn DataTable | **Selected** |
| AG Grid | Commercial license, overkill for dashboard tables | Rejected |

### Utilities

| Library | Purpose |
|---|---|
| `axios` | HTTP client with interceptors for Cognito JWT tokens |
| `date-fns` | Lightweight, tree-shakeable date formatting |
| `sonner` | Toast notifications |
| `lucide-react` | Icon system consistent with shadcn |
| `tailwind-merge` + `clsx` + `class-variance-authority` | Class merging, conditional classes, component variants |

### Dev tooling

| Tool | Purpose |
|---|---|
| `prettier` + `prettier-plugin-tailwindcss` | Code formatting + Tailwind class ordering |
| `eslint` + `eslint-config-next` | Code quality |
| `babel-plugin-react-compiler` | Automatic React memoization (React Compiler) |
