# Authentication and MFA

## Purpose
Design and assess authentication controls that resist phishing, credential theft, replay, and account takeover while preserving usable recovery.

## When to use
Use when introducing MFA, changing sign-in policy, reviewing high-risk access, or investigating account takeover.

## Inputs
Identity population, authenticators, device posture, applications, threat model, recovery requirements, regulatory constraints.

## Context to inspect
IdP policies, authenticator enrollment, session settings, risk signals, recovery flows, legacy protocols, bypasses, break-glass accounts.

## Core knowledge
Authentication strength depends on verifier binding, phishing resistance, enrollment integrity, recovery strength, session security, and downgrade resistance. MFA can be bypassed if recovery or legacy paths are weaker.

## Procedure
1. Classify users and access sensitivity.
2. Inventory all authentication and recovery paths.
3. Prefer phishing-resistant authenticators for privileged and high-risk access.
4. Define enrollment proofing and re-enrollment controls.
5. Disable or constrain legacy authentication.
6. Set step-up rules for sensitive actions.
7. Define session lifetime and reauthentication triggers.
8. Protect recovery with equivalent assurance.
9. Test bypass, downgrade, lost-device, and outage scenarios.
10. Monitor enrollment, failures, risky sign-ins, and exceptions.

## Decision points
Balance assurance against device support and operational recovery. Use adaptive signals as additional evidence, not as the sole control for high-impact access.

## Common failure patterns
Weak SMS-only recovery, persistent MFA bypass groups, shared OTP seeds, unchecked trusted devices, and forgotten basic-auth endpoints.

## Verification
Execute representative sign-in, recovery, step-up, and revocation tests and confirm expected audit events.

## Expected output
Authentication policy, assurance tiers, authenticator requirements, recovery design, exceptions, and test evidence.

## Stop conditions
Escalate when business-critical systems cannot support required assurance or recovery cannot be made at least as strong as primary authentication.