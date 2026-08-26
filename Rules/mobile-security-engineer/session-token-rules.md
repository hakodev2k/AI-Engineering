# Session and Token Rules

## Purpose
Limit compromise from stolen, replayed, leaked, or stale mobile session material.

## Scope
Access tokens, refresh tokens, session cookies, device-bound credentials, logout, revocation, and token refresh.

## MUST
- Store long-lived authentication material only using platform-protected credential storage appropriate to its sensitivity.
- Validate token audience, issuer, expiry, signature, and protocol-required claims at trusted services.
- Define rotation, revocation, expiry, logout, and account-switch behavior.
- Prevent concurrent refresh races from corrupting session state.

## MUST NOT
- Place bearer tokens in logs, analytics, crash reports, URLs, clipboard, or unprotected preferences/files.
- Interpret locally decoded token claims as authoritative authorization without trusted verification.
- Extend expired sessions silently beyond documented policy.

## SHOULD
- Prefer short-lived access tokens and bounded refresh credentials.
- Use sender-constrained or device-bound credentials where the platform and protocol support them.

## Exceptions
Deviations require documented threat impact, compensating controls, operational constraints, and security approval.

## Verification
Inspect storage and telemetry; test expiry, revocation, refresh races, replay, logout, reinstall, account switching, and clock-skew behavior.