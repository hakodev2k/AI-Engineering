# Identity Incident Response

## Purpose
Contain and recover from identity compromise while preserving evidence, preventing re-entry, and minimizing unnecessary business disruption.

## When to use
Use for suspected account takeover, stolen tokens, leaked credentials, compromised federation, malicious admin activity, MFA bypass, or provisioning abuse.

## Inputs
Incident description, affected identities, authentication/token logs, privilege data, devices, applications, federation configuration, credential inventory, and business criticality.

## Context to inspect
Inspect recent authentication, MFA changes, recovery events, token issuance, privilege changes, sessions, credentials, federation trusts, service identities, mailbox/app rules where relevant, and downstream access.

## Core knowledge
Resetting a password alone may not remove attacker persistence. Identity incidents require revoking sessions/tokens, rotating credentials, reviewing MFA/recovery methods, privilege changes, federation, and affected workloads.

## Procedure
1. Confirm scope and preserve relevant evidence.
2. Identify compromised identities and current privileges.
3. Contain active sessions and risky access.
4. Revoke tokens and credentials appropriate to the incident.
5. Remove unauthorized authenticators, recovery methods, roles, grants, and federation changes.
6. Rotate dependent service credentials if exposed.
7. Hunt for lateral identity abuse and persistence.
8. Restore access through a trusted recovery path.
9. Monitor closely after recovery.
10. Document root cause and preventive changes.

## Decision points
Disable accounts when active compromise or high blast radius justifies disruption; targeted session revocation may suffice for lower-confidence events. Coordinate mass credential rotation to avoid cascading outages.

## Common failure patterns
Password reset only, failing to revoke refresh tokens, overlooking app grants/service principals, destroying evidence, re-enabling before persistence is removed, and rotating secrets without dependent systems.

## Verification
Prove old sessions/credentials fail, unauthorized access is removed, legitimate recovery works, and no new suspicious identity activity appears.

## Expected output
A contained and recovered identity incident with evidence, remediation, validation, and follow-up actions.

## Stop conditions
Escalate immediately for tenant-wide/federation compromise, unavailable emergency access, or containment actions with major irreversible impact.