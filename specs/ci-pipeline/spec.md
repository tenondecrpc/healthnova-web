# Spec — CI Pipeline

## Status: implemented

## Summary

GitHub Actions pipeline for HealthNova Web. Runs on every PR and push to `main`. Enforces code quality, security scanning, and SAST before merge.

## Workflows

### verify.yml — Lint, Test & Build

Triggers: `pull_request` and `push` to `main`.

- `npm run lint` — ESLint
- `npm run format:check` — Prettier
- `npm run test:coverage` — Vitest with coverage
- `npm run build` — Next.js production build

Uses `concurrency` with `cancel-in-progress: true` to avoid redundant runs on rapid pushes.

### security.yml — Security Review + Secret Scanning

Triggers: `pull_request` to `main`.

Two jobs:

**Claude Security Review** — `anthropics/claude-code-security-review@main`

- AI-based security analysis of the PR diff
- Posts findings as PR comments
- Uploads results as artifacts
- Excludes `node_modules`, `.next`, `coverage`, `.git`
- Uses custom instructions from `.github/security-scan-instructions.md`
- Requires `CLAUDE_API_KEY` secret

**Secret Scanning (Gitleaks)**

- Scans commits in the PR range for hardcoded secrets/tokens
- Uses `.gitleaks.toml` for configuration
- Exits with code 1 if secrets are found (blocks merge)

### codeql.yml — SAST

Triggers: `pull_request` and `push` to `main`, plus weekly schedule (Mondays 06:00 UTC).

- Language: `javascript-typescript`
- Uploads SARIF results to GitHub Security tab
- Required permissions: `contents: read`, `security-events: write`

## Branch Protection (protect-main ruleset)

Configured in `Settings → Rulesets → protect-main` targeting `main`.

Active rules:

- **Require a pull request before merging** — all changes via PR
- **Require status checks to pass** — the following jobs must be green before merge:
  - `Verify / Lint, Test & Build (pull_request)`
  - `Security / Claude Security Review (pull_request)`
  - `Security / Secret Scanning (Gitleaks) (pull_request)`
  - `CodeQL / CodeQL Analysis (pull_request)`
- **Require code scanning results** — CodeQL must upload SARIF results for the PR commits (separate from the job status check above)
- **Block force pushes**

## Decisions

### D1: Claude Security Review over CodeRabbit

The project already uses `anthropics/claude-code-security-review` for AI-based PR review. CodeRabbit solves the same problem — adding it would duplicate that layer.

### D2: CodeQL as the SAST gate

CodeQL is free for public repos, integrates natively with GitHub's "Require code scanning results" branch protection rule, and provides deterministic flow analysis for TypeScript/JavaScript (XSS, injection, prototype pollution). The AI review layer (Claude) handles broader code quality concerns.

### D3: Gitleaks for secret scanning

Lightweight, fast, and configurable via `.gitleaks.toml`. Scans only the PR commit range (`base..head`) to avoid full-history false positives on every run.

### D4: Weekly CodeQL schedule

GitHub requires a scheduled scan to keep the Security tab results fresh and to catch vulnerabilities introduced by dependency updates without a code change.

## Troubleshooting

### Claude Security Review passes green but does not execute

The action handles errors internally and does not fail the workflow. Check the "ClaudeCode Execution" step logs for:

- **"Credit balance is too low"** — The `CLAUDE_API_KEY` secret requires prepaid API credits at `platform.claude.com/settings/billing`. The Claude Pro/Max subscription does not include API credits — they are separate billing systems.
- **"authentication_error 401"** — The API key in GitHub Secrets is invalid or was rotated. Update `CLAUDE_API_KEY` in `Settings > Secrets and variables > Actions`.

OAuth tokens (`claude login`) cannot be used in CI — only API keys work in non-interactive environments.
