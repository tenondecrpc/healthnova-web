---
name: "SK: Security"
description: "Security review for health data compliance"
category: Workflow
tags: [workflow, security, hipaa]
---

Run a security review on a feature implementation, focused on health data compliance.

**Input**: The argument after `/sk:security` is the feature name matching `specs/<name>/`.

---

## Steps

1. **Read the spec** — `specs/<name>/spec.md` for intended behavior and constraints

2. **Identify changed files** — Find all files related to this feature:

   ```bash
   git diff main --name-only
   ```

3. **Review against checklist**:

   ### Health Data (Constitution §4)
   - [ ] No PII or sensitive health data in logs, error messages, or client-side storage
   - [ ] Health data only displayed to the authenticated user who owns it
   - [ ] Privacy-first practices for rendering and caching

   ### Authentication & Authorization
   - [ ] All data-fetching routes require Cognito JWT validation
   - [ ] No token exposure in URLs, logs, or error messages
   - [ ] Proper token refresh handling

   ### Input Validation
   - [ ] Zod schemas validate all external inputs (API responses, form data)
   - [ ] No raw user input rendered without sanitization
   - [ ] No SQL/NoSQL injection vectors (even via API params)

   ### Client-Side Security
   - [ ] No secrets or API keys in client-side code
   - [ ] No sensitive data in localStorage/sessionStorage
   - [ ] Proper CSP-compatible patterns (no inline scripts/eval)

   ### Dependencies
   - [ ] No known vulnerable dependencies (`npm audit`)
   - [ ] No unnecessary permissions requested

4. **Generate report** — Write findings to `specs/<name>/security-review.md`:
   - CRITICAL — Must fix before merge
   - WARNING — Should fix, acceptable risk if documented
   - INFO — Recommendations for improvement

5. **Show summary** with counts per severity. If CRITICAL issues exist, state clearly: "Do NOT merge until critical issues are resolved."

## Guardrails

- Do NOT fix issues yourself — only report them
- Be specific: file, line number, and what's wrong
- Reference constitution rules by section number
- If no issues found, say so — don't invent problems
