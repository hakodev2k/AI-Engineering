# Passwordless Authentication

## Purpose
Plan and deploy passwordless authentication that materially improves phishing resistance and user experience without weakening enrollment or recovery.

## When to use
Use for passkey/FIDO2/security-key/platform-authenticator programs, privileged-user modernization, or password-risk reduction.

## Inputs
User populations, devices, authenticator support, identity provider capabilities, assurance requirements, enrollment/recovery flows, and legacy application constraints.

## Context to inspect
Inspect authenticator binding, attestation requirements, device portability, synced versus device-bound credentials, fallback methods, recovery, shared-device scenarios, and legacy protocols.

## Core knowledge
Passwordless is only stronger when the authenticator and surrounding lifecycle are strong. Phishing-resistant public-key authentication removes reusable shared secrets, but weak fallback and recovery can preserve the old attack surface.

## Procedure
1. Segment users and applications by compatibility and risk.
2. Select authenticator types appropriate to assurance needs.
3. Harden initial enrollment and device binding.
4. Define replacement and recovery procedures.
5. Pilot with supportable cohorts.
6. Require stronger passwordless methods for privileged access first where feasible.
7. Measure login success, fallback, recovery, and support burden.
8. Reduce password/fallback exposure as adoption matures.
9. Address shared devices and inaccessible authenticators explicitly.
10. Test lost-device, new-device, phishing, and recovery scenarios.

## Decision points
Use device-bound authenticators for higher assurance when portability is less important; synced passkeys improve usability but require trust in ecosystem recovery. Maintain legacy fallback only as long as necessary.

## Common failure patterns
Calling OTP passwordless, keeping password fallback indefinitely, weak enrollment, insecure help-desk recovery, no plan for device loss, and assuming every legacy application supports modern authentication.

## Verification
Test enrollment, authentication, phishing resistance, device replacement, recovery, fallback restrictions, and privileged-user policy.

## Expected output
A staged passwordless design with authenticator policy, lifecycle, compatibility plan, metrics, and verified recovery.

## Stop conditions
Escalate when required recovery would be materially weaker than target assurance or critical applications force unsafe legacy authentication.