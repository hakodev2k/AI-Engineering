# Session and Token Rules

## Purpose
Limit session hijacking, replay, fixation, token leakage, and excessive credential lifetime.

## Scope
Applies to browser sessions, API tokens, refresh tokens, reset links, signed links, and other bearer or proof-of-possession credentials.

## MUST
- Session and token lifetimes MUST reflect compromise impact and revocation capability.
- Browser authentication cookies MUST use appropriate Secure, HttpOnly, SameSite, path, and domain restrictions.
- Session identifiers and bearer tokens MUST be generated using cryptographically secure randomness or trusted protocol implementations.
- Privilege elevation and sensitive account changes MUST rotate or otherwise invalidate relevant session state when fixation or stale privilege is possible.
- Logout, credential compromise, and high-risk account events MUST have a defined invalidation strategy.
- Tokens MUST be validated for integrity, intended audience/purpose, time constraints, and other protocol-required claims.

## MUST NOT
- MUST NOT place reusable bearer tokens in URLs when they can leak through history, logs, referrers, or analytics.
- MUST NOT log raw session IDs, access tokens, refresh tokens, or reset tokens.
- MUST NOT accept unsigned or algorithm-confused tokens because parsing succeeds.

## SHOULD
- SHOULD minimize token scope and lifetime and bind tokens to a specific purpose.
- SHOULD use server-side revocation or short-lived credentials for high-impact access.

## Exceptions
Exceptions require explicit threat analysis, bounded exposure, compensating controls, and security approval.

## Verification
Inspect cookie/token configuration, validation code, expiry and revocation tests, session rotation, logs, browser behavior, and replay scenarios.