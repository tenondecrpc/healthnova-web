# Contributing to HealthNova Web

## Pull Requests

### Required checks

All PRs must pass the following checks before merging:

| Check                                 | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| Verify / Lint, Test & Build           | Lint, unit tests, and production build             |
| Security / Secret Scanning (Gitleaks) | Detects committed secrets or credentials           |
| Security / Claude Security Review     | AI-assisted review for health data and auth issues |
| CodeQL / CodeQL Analysis              | Static analysis for security vulnerabilities       |

### Merge button blocked after all checks pass

**Symptom:** All 5 checks show green, but the merge button is blocked with:

> "Code scanning is waiting for results from CodeQL"

**Cause:** GitHub's UI caches the code scanning status separately from the checks status. When CodeQL finishes, the checks panel updates in real time but the merge eligibility state does not.

**Fix:** Reload the page. The merge button will be enabled.

This is a GitHub platform issue, not a problem with the PR or the workflows.

## Security

See `specs/constitution.md` for security rules. All health data is sensitive — no PII or PHI in logs, error messages, or client-side storage.

See `.github/security-scan-instructions.md` for what the automated security review looks for.
