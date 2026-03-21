@AGENTS.md

# HealthNova Web

Web dashboard for a preventive health platform. Consumes a separate backend API authenticated via Cognito JWT.

## Rules

- No PII or sensitive health data in logs, error messages, or client-side storage.
- Health data must only be displayed to the authenticated user who owns it.
- Read `specs/constitution.md` for stack constraints and immutable project rules.

## SDD workflow

- Every non-trivial feature must have a spec in `specs/<feature-name>/` before implementation.
- Only read the specific spec you need — do not load all specs into context.
- See `docs/sdd-approach.md` for rationale and migration path to OpenSpec.
