# Identity Incident Response

## Purpose
Contain and recover from identity compromise while preserving evidence, restoring trustworthy authentication, and eliminating persistence.

## When to use
Use for account takeover, credential leaks, malicious privilege changes, token theft, suspicious federation activity, or compromised service identities.

## Inputs
Incident description, affected identities, logs, session/token data, privilege state, credential inventory, business impact, recovery authorities.

## Context to inspect
Recent sign-ins, MFA and recovery changes, token issuance, group/role changes, federation configuration, service credentials, admin activity, endpoint/device state.

## Core knowledge
Identity incidents require more than password reset. Attackers may retain sessions, refresh tokens, federation keys, application credentials, delegated grants, or newly created privileged identities.

## Procedure
1. Establish incident scope and preserve evidence.
2. Disable or restrict confirmed compromised identities when safe.
3. Revoke sessions, refresh tokens, and active credentials.
4. Rotate exposed secrets, certificates, and application credentials.
5. Review privileged grants, groups, federation settings, and recovery methods for persistence.
6. Examine lateral movement and affected relying parties.
7. Restore access using trusted recovery channels.
8. Validate devices and authenticators before re-enrollment.
9. Monitor for recurrence using heightened detections.
10. Document root cause, control gaps, and durable remediation.

## Decision points
Contain aggressively when compromise is confirmed; use targeted restrictions when disabling an identity would create unacceptable operational or safety impact.

## Common failure patterns
Resetting passwords without revoking sessions, overlooking OAuth grants, rotating one secret while replicas remain valid, and restoring privileges before device trust is re-established.

## Verification
Confirm old sessions and credentials fail, unauthorized grants are removed, expected access is restored, and new suspicious activity is absent.

## Expected output
Containment actions, evidence timeline, recovery validation, residual risk, and remediation plan.

## Stop conditions
Escalate when privileged compromise may affect the identity provider control plane, evidence is insufficient to bound scope, or recovery requires business-critical outage approval.