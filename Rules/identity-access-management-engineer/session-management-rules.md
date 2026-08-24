# Session Management Rules

## Purpose
Bound authenticated sessions so stolen or stale sessions cannot provide indefinite access.

## Scope
Web sessions, refresh tokens, session cookies, revocation, reauthentication, device sessions, and administrative sessions.

## MUST
- Sessions MUST have explicit idle and absolute lifetime policies proportional to risk.
- Session identifiers MUST be unpredictable, protected in transit and storage, and rotated after security-sensitive authentication transitions.
- Revocation MUST be supported for compromised, terminated, or materially changed identities.
- Sensitive actions MUST re-evaluate authorization and authentication freshness when risk requires it.

## MUST NOT
- MUST NOT expose session tokens to logs, URLs, analytics, or insecure client storage.
- MUST NOT allow logout to be purely cosmetic when server-side revocation is required.
- MUST NOT keep privileged sessions indefinitely renewable.

## SHOULD
- Prefer secure cookie attributes and centralized session visibility for users and operators.

## Exceptions
Extended sessions require documented use case, threat assessment, compensating controls, and approval.

## Verification
Inspect session configuration, browser behavior, revocation tests, token rotation, logout tests, and compromise-response exercises.