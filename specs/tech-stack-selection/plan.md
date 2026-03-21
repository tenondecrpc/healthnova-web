# Plan — Tech Stack Selection

## Phases

### Phase 1: Project initialization

1. Initialize Next.js 16 project with App Router, TypeScript, Tailwind CSS 4, and React Compiler
2. Verify build succeeds with default template

### Phase 2: Core dependency installation

1. Install authentication stack: `aws-amplify`, `@aws-amplify/adapter-nextjs`
2. Install data layer: `@tanstack/react-query`, `axios`
3. Install state management: `zustand`
4. Install charts: `recharts`
5. Install forms: `react-hook-form`, `zod`, `@hookform/resolvers`
6. Install i18n: `next-intl`
7. Install tables: `@tanstack/react-table`
8. Install utilities: `date-fns`, `sonner`, `lucide-react`

### Phase 3: UI system setup

1. Initialize shadcn/ui with Tailwind v4 integration
2. Install Button component as reference implementation
3. Verify `cn()` utility and CSS variables are configured

### Phase 4: Dev tooling

1. Install Prettier + prettier-plugin-tailwindcss
2. Verify ESLint config from Next.js initialization
