# Access Control Rules

## Purpose
Ensure production data access follows least privilege and accountable ownership.

## Scope
Datasets, storage locations, orchestration identities, service accounts, administrative roles, and operational access.

## MUST
- Grant access according to documented job need and least privilege.
- Separate human, service, and administrative identities where practical.
- Review privileged access to critical data periodically.
- Require accountable approval for high-risk production access changes.

## MUST NOT
- Share credentials between users or services.
- Grant broad administrative access merely to simplify troubleshooting.
- Disable access controls to unblock a pipeline without explicit approval and compensating controls.

## SHOULD
- Prefer short-lived credentials and role-based access.
- Automate access review evidence where supported.

## Exceptions
Emergency elevation requires bounded duration, reason, approver, audit trail, and prompt revocation.

## Verification
Inspect identity policies, role assignments, audit logs, approval records, stale privileges, and service-account usage.