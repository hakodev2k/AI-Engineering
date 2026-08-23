# Authentication, Keychain, and Session Security

## Purpose
Implement secure iOS authentication/session handling with appropriate credential storage, lifecycle controls, and least-privilege access.

## When to use
Use for login, OAuth/OIDC, token storage/refresh, biometric gates, or session-security review.

## Inputs
Identity protocol, token semantics, threat model, logout requirements, device-sharing policy.

## Context to inspect
Keychain accessibility, entitlements/access groups, redirect handling, token refresh, LocalAuthentication, logs, backup behavior.

## Core knowledge
Secrets should not live in UserDefaults or source code. Keychain accessibility must match required availability. Biometrics usually gate local access; they do not replace server authentication.

## Procedure
1. Document credential types and lifetimes.
2. Use platform-supported authorization flows and validated redirects.
3. Store only necessary secrets in Keychain with appropriate accessibility.
4. Serialize token refresh to prevent storms.
5. Define session expiration and revocation behavior.
6. Clear local credentials and sensitive caches on logout as required.
7. Protect logs/analytics from tokens and PII.
8. Handle device lock, restore, and biometric changes.
9. Test expiry, revocation, cancellation, and compromised-state assumptions.

## Decision points
Choose Keychain accessibility from actual background/device-lock needs. Require biometric/user-presence controls only where threat model and UX justify them.

## Common failure patterns
Tokens in preferences, refresh races, insecure web views, weak redirect validation, logging secrets, and assuming logout revokes server tokens.

## Verification
Security review plus tests for token expiry, refresh concurrency, logout, device lock, redirect tampering, and reinstall/restore semantics.

## Expected output
Documented credential lifecycle and verified secure storage/session behavior.

## Stop conditions
Stop when identity-provider requirements or security policy are unavailable, or cryptographic design would be invented locally.