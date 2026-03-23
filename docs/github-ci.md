# GitHub CI — Known Behaviors

## Merge button blocked after all checks pass

After all 5 required checks turn green, the merge button may still be blocked with:

> "Code scanning is waiting for results from CodeQL"

This is a GitHub UI caching issue. The checks panel and the merge eligibility state update independently. **Reload the page** — the button will be enabled.

Not a bug in the workflows. No action needed on the PR.
