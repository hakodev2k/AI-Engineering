# Identity Threat Investigation

## Purpose
Investigate account takeover, token abuse, privilege escalation and suspicious authentication across workforce and cloud identities.

## When to use
Use for impossible travel, MFA anomalies, token misuse, privilege changes, suspicious consent or abnormal service-account activity.

## Inputs
Authentication logs, token/session events, MFA records, device posture, IP/ASN context, directory changes, privilege assignments and application consent.

## Context to inspect
Understand identity type, expected locations/devices, federation path, conditional-access policy, privileged roles, break-glass accounts and service dependencies.

## Core knowledge
Successful MFA does not prove legitimate use. Session/token theft may bypass fresh authentication. Identity investigations require session, device and control-plane context.

## Procedure
1. Identify account type and privilege.
2. Reconstruct authentication and session timeline.
3. Compare source networks, devices and user agents.
4. Inspect MFA method changes and recovery events.
5. Review token grants, app consent and federation activity.
6. Check privilege/group/role modifications.
7. Search downstream resource access.
8. Determine whether credentials, tokens or devices are compromised.
9. Revoke affected sessions and rotate credentials when justified.
10. Validate restoration and monitor for re-entry.

## Decision points
Prefer session revocation plus credential reset for token uncertainty; require stronger containment for privileged identities. Avoid relying on geo-location alone.

## Common failure patterns
Closing because password was correct; resetting password without revoking tokens; ignoring OAuth consent; overlooking service-account blast radius.

## Verification
Confirm invalidation of sessions, removal of malicious grants/roles, clean subsequent authentication and scoped downstream access review.

## Expected output
Identity compromise assessment with timeline, blast radius, containment and residual risk.

## Stop conditions
Escalate immediately for tenant-wide privilege, federation compromise, break-glass account abuse or inability to revoke active sessions.