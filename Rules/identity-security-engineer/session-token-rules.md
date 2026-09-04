# Session and Token Rules

## Purpose
Control session and token issuance, validation, lifetime, revocation, and replay risk.

## Scope
Applies to browser sessions, access tokens, refresh tokens, API tokens, and equivalent bearer or proof-of-possession artifacts.

## MUST
- Tokens MUST validate issuer, audience, signature, lifetime, and relevant claims before trust is granted.
- Session and token lifetimes MUST be proportional to privilege and exposure risk.
- Revocation or containment procedures MUST exist for compromised sessions and credentials.
- Sensitive session transitions MUST defend against fixation and replay.
- Token-handling components MUST avoid exposing token values in logs or telemetry.

## MUST NOT
- Expired, malformed, unsigned, or algorithmically unacceptable tokens MUST NOT be accepted.
- Refresh or long-lived tokens MUST NOT be stored in insecure client locations when safer mechanisms exist.
- Session identifiers MUST NOT be predictable.

## SHOULD
- Prefer sender-constrained or device-bound mechanisms for high-risk use cases where supported.
- Rotate refresh artifacts and detect suspicious reuse where practical.

## Exceptions
Exceptions require documented protocol constraint, risk, compensating controls, and approval.

## Verification
Review token validation configuration, protocol tests, session stores, revocation tests, browser security settings, and telemetry redaction.