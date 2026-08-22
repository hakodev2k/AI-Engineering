# Authentication and Session Rules
## Purpose
Protect identities and maintain predictable session behavior on mobile devices.
## Scope
Login, token storage, refresh, logout, biometric gates, and session expiration.
## MUST
- Tokens and credentials MUST use platform secure storage and least-privilege scopes.
- Refresh concurrency MUST prevent token races and request storms.
- Logout MUST clear or invalidate sensitive local session material according to threat model.
## MUST NOT
- Biometric success MUST NOT be treated as server authentication unless the protocol explicitly establishes it.
- Secrets MUST NOT appear in logs, analytics, crash reports, screenshots, or clipboard without explicit safe design.
## SHOULD
- Reauthentication SHOULD be required before high-risk actions based on risk and platform guidance.
## Exceptions
Public anonymous sessions may use lower assurance when they grant no sensitive access.
## Verification
Inspect secure storage, token lifecycle, concurrent refresh, logout, expiry, device lock, and compromised-session scenarios.