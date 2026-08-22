# Authentication and Session Rules

## Purpose
Protect identities and sessions across the complete application.
## Scope
Login, tokens, cookies, sessions, logout, and identity integration.
## MUST
- Use established identity protocols and secure framework primitives.
- Protect session credentials in transit and storage and define expiry/revocation behavior.
- Apply secure cookie attributes when cookies carry authentication state.
## MUST NOT
- Implement custom cryptography or authentication protocols without specialist review.
- Store bearer tokens in locations unnecessarily exposed to script execution.
## SHOULD
- Prefer short-lived credentials and centralized identity policy.
## Exceptions
Nonstandard identity designs require security review and threat-model evidence.
## Verification
Inspect configuration, browser behavior, token lifecycle tests, and security scans.