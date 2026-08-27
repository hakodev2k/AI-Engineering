# Backup Security and Access Control

## Purpose
Reduce the probability that compromised production identities, insiders, or excessive privileges can alter, exfiltrate, or destroy recovery assets.

## When to use
Use during backup-platform design, IAM reviews, ransomware hardening, audits, or privileged-access changes.

## Inputs
Identity architecture, backup roles, service accounts, storage policies, threat model, audit requirements, and break-glass process.

## Context to inspect
Inspect effective permissions, inherited roles, API tokens, MFA, workload identities, storage ACLs, KMS grants, network access, and audit logging.

## Core knowledge
Backup systems contain sensitive production data and powerful restore capabilities. Least privilege, separation of duties, independent authentication, immutable storage, and auditable emergency access are core controls.

## Procedure
1. Enumerate human and machine identities touching backups.
2. Map actions: configure, create, read, restore, delete, change retention, and manage keys.
3. Remove broad or unused privileges.
4. Separate backup administration from production administration.
5. Require strong authentication for privileged operations.
6. Restrict service identities to required resources and actions.
7. Protect deletion/retention changes with stronger controls.
8. Limit network exposure of management planes.
9. Enable immutable audit logs and alert on sensitive actions.
10. Test break-glass access and revoke stale credentials.

## Decision points
Use just-in-time privilege for rare administrative actions. Require dual control when a single action can eliminate all recoverability.

## Common failure patterns
Shared admin accounts; production root can delete backups; restore roles can read every tenant; dormant tokens; audit logs stored in same mutable boundary.

## Verification
Perform effective-permission review and controlled negative tests proving unauthorized identities cannot read or delete protected copies.

## Expected output
A least-privilege backup access model with monitored high-risk operations.

## Stop conditions
Escalate if removing privilege would break unowned automation, identity dependencies are undocumented, or current access permits immediate destruction of all recovery copies.