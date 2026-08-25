# Authentication Review

## Purpose
Assess whether identity proof, session establishment, credential handling, and account recovery resist realistic takeover attacks.

## When to use
Use for login, SSO, MFA, passwordless, service authentication, session redesign, or account-recovery changes.

## Inputs
Identity flows, protocol configuration, session code, token claims, recovery process, rate limits, and logs.

## Context to inspect
Inspect identity provider settings, redirect URIs, token validation, cookie attributes, device/session lifecycle, MFA enrollment, recovery, and privileged reauthentication.

## Core knowledge
Authentication establishes identity; it does not grant authorization. OIDC/OAuth/SAML must be validated according to protocol semantics. Sessions require secure issuance, binding where appropriate, expiration, revocation, and theft resistance.

## Procedure
1. Enumerate human, workload, and administrative identities.
2. Trace credential or assertion issuance through session creation.
3. Validate issuer, audience, signature, nonce/state, expiry, and redirect constraints as applicable.
4. Review credential storage and transport.
5. Review MFA enrollment, reset, bypass, and recovery paths.
6. Check session fixation, rotation, revocation, idle/absolute timeout, and concurrent sessions.
7. Test brute-force, enumeration, replay, token substitution, and downgrade cases.
8. Verify security events are logged without exposing credentials.
9. Add regression tests for critical protocol invariants.

## Decision points
Prefer mature identity providers over custom credential systems. Use step-up authentication for high-risk actions when continuous strong authentication would harm usability. Token lifetime must balance theft exposure with availability.

## Common failure patterns
Trusting unsigned/unvalidated claims, weak recovery defeating MFA, long-lived bearer tokens, user enumeration, session IDs in URLs, and missing reauthentication for sensitive changes.

## Verification
Demonstrate negative tests for invalid tokens and recovery abuse, confirm session lifecycle behavior, and inspect production-equivalent configuration.

## Expected output
Authentication findings, attack scenarios, remediation, and test evidence.

## Stop conditions
Escalate on credential exposure, protocol ambiguity affecting security, or identity-provider changes requiring privileged approval.