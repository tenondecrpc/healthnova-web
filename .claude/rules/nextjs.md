---
paths:
  - "src/**/*.{ts,tsx}"
  - "app/**/*.{ts,tsx}"
  - "next.config.ts"
---

# Next.js Rules

- This project uses **Next.js 16** (App Router) + React 19. APIs and conventions may differ from your training data.
- Always read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
- `app/` is routing only — no components or business logic. Use route groups `(auth)` and `(dashboard)`.
- No components colocated inside `app/`.
- React Compiler handles memoization — do not use manual `useMemo` / `useCallback` unless profiling proves necessity.
