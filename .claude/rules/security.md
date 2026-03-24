# Security Rules

- No PII or sensitive health data in logs, error messages, or client-side storage.
- Health data must only be displayed to the authenticated user who owns it.
- Treat all health data as sensitive — follow privacy-first practices for rendering and caching.
- Auth is via AWS Cognito (`aws-amplify`) — no other auth provider allowed.
- Cognito JWT tokens are added via axios interceptors — never pass tokens manually.
