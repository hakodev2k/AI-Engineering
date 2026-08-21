# Identity and Access Rules

## Purpose
Control administrative and workload access to infrastructure using least privilege and auditable identities.

## Scope
Applies to cloud IAM, platform accounts, service identities, CI identities, and operator access.

## MUST
- Privileged access MUST use named identities and auditable authentication.
- Roles and permissions MUST be scoped to required actions and resources.
- Production administrative access MUST require strong authentication and explicit authorization.
- Dormant, orphaned, or unnecessary privileged identities MUST be removed promptly.
- Machine identities MUST have clearly owned credentials or managed identity configuration.

## MUST NOT
- MUST NOT share privileged accounts among operators.
- MUST NOT grant broad wildcard permissions to avoid designing proper access boundaries.
- MUST NOT use personal long-lived credentials for production automation.

## SHOULD
- Prefer temporary elevation, just-in-time access, and workload federation.
- Review high-risk permissions regularly.

## Exceptions
Emergency elevation requires approval, limited duration, audit trail, and post-event review.

## Verification
Inspect IAM policies, role assignments, authentication settings, access logs, stale identities, and privileged-access review records.