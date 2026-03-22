This is a Next.js 16 frontend for a preventive health platform. It consumes a REST API authenticated via AWS Cognito JWT tokens. All health data is sensitive (HIPAA-adjacent).

Focus on:

## Authentication & Token Handling

- Cognito tokens stored insecurely (localStorage instead of httpOnly cookies)
- JWT tokens leaked in logs, error messages, or URL parameters
- Missing token refresh logic or improper expiry handling
- API calls made without proper Authorization headers

## Data Exposure (PHI/PII)

- Health data rendered in error messages, console logs, or client-side storage
- PII in component props passed to analytics or third-party scripts
- Sensitive data cached in browser storage (localStorage, sessionStorage, IndexedDB)
- User health data visible to unauthenticated users or other users

## XSS & Injection

- Unsanitized user input rendered with dangerouslySetInnerHTML
- Dynamic URLs constructed from user input without validation
- Script injection via query parameters or route segments

## Client-Side Security

- Secrets or API keys hardcoded in client-side code (exposed in browser bundle)
- Environment variables without NEXT*PUBLIC* prefix exposed client-side
- Sensitive data in React state that persists across route navigations

## Supply Chain

- Dependencies pinned to overly wide version ranges
- GitHub Actions steps using mutable tags instead of pinned versions
- Third-party scripts loaded without integrity checks (SRI)

Deprioritize:

- Style issues or code formatting
- Missing comments or documentation
- TypeScript strict mode warnings unrelated to security
- Test files (unless they embed real credentials or PHI)
