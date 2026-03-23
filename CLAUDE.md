# HealthNova Web

Web dashboard for a preventive health platform. Consumes a separate backend API authenticated via Cognito JWT.

<!-- BEGIN:nextjs-agent-rules -->

## ⚠️ This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Rules

- When using bash commands, always pipe output to limit results: `grep` add `| head -20`, `ls` add `| head -30`. Never display more than 30 lines of command output.
- No PII or sensitive health data in logs, error messages, or client-side storage.
- Health data must only be displayed to the authenticated user who owns it.
- Read `specs/constitution.md` for stack constraints and immutable project rules.

## Navigation

1. Query claude-mem first (`mem-search` or `$CMEM`)
2. If relevant context is found, use it to locate files
3. If not found, proceed with repo search
4. Always verify paths with Glob/Grep before acting

## Spec Kit workflow (SDD)

- Every non-trivial feature must have a spec in `specs/<feature-name>/` before implementation.
- Only read the specific spec you need — do not load all specs into context.
- Artifact model follows [Spec Kit](https://github.com/github/spec-kit): Constitution → Specification → Plan → Tasks → Implementation.
- Commands: `/speckit.clarify` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement` → `/speckit.verify` → `/speckit.security`.
- See `docs/sdd-approach.md` for rationale and alternative tools (OpenSpec, `specify` CLI).
