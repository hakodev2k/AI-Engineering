# Session and Token Security

## Purpose
Secure access, refresh, and session tokens throughout issuance, storage, use, renewal, revocation, logout, and account switching.

## When to use
Use for authentication changes, token incidents, API integrations, SSO, offline sessions, or account lifecycle work.

## Inputs
Token types, issuer configuration, expiry policy, storage implementation, backend validation, logout semantics.

## Preconditions
Identify each token's authority, audience, lifetime, and revocation capability.

## Context to inspect
Token storage, HTTP headers, URL handling, logs, refresh logic, concurrency, background tasks, app extensions, and account switching.

## Core knowledge
Bearer tokens grant authority to whoever possesses them. Minimize lifetime and exposure; validate issuer, audience, signature, expiry, and relevant claims server-side.

## Procedure
1. Inventory tokens and privileges.
2. Remove tokens from URLs/logs/analytics.
3. Store sensitive tokens using platform-protected storage.
4. Define refresh serialization and rotation behavior.
5. Handle expiry and revocation deterministically.
6. Clear account-scoped state on logout/switch.
7. Prevent cross-account token races.
8. Test replay, stolen refresh token, clock skew, and interrupted refresh.

## Decision points
Use shorter access-token lifetimes when refresh is reliable. Use rotating refresh tokens when issuer support and replay detection justify complexity.

## Common failure patterns
Long-lived tokens, plaintext persistence, refresh races, incomplete logout, tokens in deep links, stale background sessions, and account mixing.

## Verification
Exercise expiration, revocation, concurrent refresh, logout, reinstall/restore, and multi-account transitions.

## Expected output
A bounded token lifecycle with protected storage, deterministic refresh, and tested revocation semantics.

## Stop conditions
Escalate when issuer behavior or backend revocation guarantees are undocumented.