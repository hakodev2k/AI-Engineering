# Session and Token Security

## Purpose
Design and review sessions and security tokens so authentication state cannot be easily stolen, replayed, extended, or confused across services.

## When to use
Use for web/API session design, token incidents, SSO integrations, refresh-token handling, or session-policy changes.

## Inputs
Authentication flows, token types, clients, APIs, session stores, cookie settings, token lifetimes, revocation needs, and threat model.

## Context to inspect
Inspect access/ID/refresh tokens, cookies, storage locations, issuer/audience validation, signing keys, rotation, revocation, idle/absolute timeout, logout, and concurrent sessions.

## Core knowledge
Bearer tokens confer authority to whoever possesses them. Minimize lifetime and exposure, validate tokens at trusted boundaries, and distinguish identity tokens from API authorization tokens. Session invalidation requirements influence architecture.

## Procedure
1. Inventory token and session types and consumers.
2. Define purpose, audience, scopes, and lifetime for each.
3. Store browser sessions/tokens using mechanisms appropriate to client risk.
4. Validate issuer, audience, signature, expiry, and required claims.
5. Protect refresh tokens more strongly than short-lived access tokens.
6. Rotate signing keys and refresh credentials safely.
7. Define idle and absolute session limits.
8. Design revocation for compromise and termination scenarios.
9. Prevent tokens from appearing in URLs and logs.
10. Test replay, expiration, logout, revocation, and key rollover.

## Decision points
Short-lived stateless access tokens scale well but make immediate revocation harder. Server-side sessions improve centralized invalidation at the cost of state and availability dependencies.

## Common failure patterns
Long-lived bearer tokens, localStorage exposure without threat consideration, accepting wrong audiences, trusting ID tokens at APIs, refresh-token reuse, missing logout invalidation, and tokens in telemetry.

## Verification
Run negative token validation tests, expiration/revocation tests, storage inspection, and key-rotation exercises.

## Expected output
A session/token security design with lifetimes, storage, validation, rotation, revocation, and evidence.

## Stop conditions
Escalate when compromise response requires revocation that the chosen token architecture cannot provide within acceptable risk.