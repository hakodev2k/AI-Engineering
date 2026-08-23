# Authentication and Session Testing

## Purpose
Determine whether identity establishment and session lifecycle controls resist account takeover, impersonation, replay, and session abuse.

## When to use
Use for login, SSO, MFA, password recovery, registration, session refresh, logout, device trust, and step-up authentication flows.

## Inputs
Test identities, supported authentication methods, identity architecture, session/token formats, and policy requirements.

## Context to inspect
Inspect enrollment, login, recovery, MFA, session issuance, refresh, revocation, logout, timeout, device changes, and privileged reauthentication.

## Core knowledge
Authentication strength is determined by the complete lifecycle. Recovery and enrollment paths can bypass strong login controls. Tokens require appropriate audience, issuer, lifetime, storage, rotation, and revocation semantics.

## Procedure
1. Map all identity entry and recovery paths.
2. Establish expected authentication states.
3. Test account enumeration and policy consistency.
4. Validate MFA enrollment, challenge, recovery, and downgrade resistance.
5. Inspect session identifiers/tokens for lifecycle and binding behavior.
6. Test logout, expiry, rotation, and revocation.
7. Test privilege changes and sensitive operations for reauthentication needs.
8. Evaluate concurrent sessions and device trust.
9. Validate SSO boundaries and redirect handling when applicable.
10. Document only reproducible control failures.

## Decision points
Prioritize lifecycle bypasses over password-policy trivia. Test token cryptography only where evidence suggests implementation risk; first validate trust and claim enforcement.

## Common failure patterns
Ignoring recovery flows, assuming MFA means phishing resistance, testing only password login, leaking real credentials into evidence, and treating client-side logout as server revocation.

## Verification
Use controlled accounts, repeat across sessions, verify server-side state, and demonstrate the exact unauthorized identity outcome.

## Expected output
Authentication/session findings with prerequisites, affected lifecycle stage, impact, evidence, and remediation.

## Stop conditions
Stop if testing risks locking real users, triggering fraud controls at scale, or accessing non-test accounts.