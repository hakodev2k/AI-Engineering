# Service Identity Rules

## Purpose
Govern non-human identities with the same rigor as human access while accounting for automation needs.

## Scope
Service accounts, workload identities, managed identities, bots, API principals, and machine credentials.

## MUST
- Every service identity MUST have a documented owner, purpose, environment, and allowed resources.
- Machine identities MUST use non-interactive authentication methods appropriate to the platform.
- Permissions MUST be scoped to the workload's minimum required operations.
- Ownership and continued need MUST be reviewed periodically.
- Unused or ownerless service identities MUST be disabled or remediated promptly.

## MUST NOT
- MUST NOT use personal user identities to run unattended production workloads.
- MUST NOT share one service identity across unrelated systems when isolation is practical.
- MUST NOT grant broad interactive-login capability to service identities without an explicit requirement.

## SHOULD
- Workload federation or managed identity SHOULD replace long-lived static secrets where supported.
- Service identities SHOULD be environment-specific.

## Exceptions
Exceptions require owner, reason, bounded scope, compensating controls, expiry, and approval.

## Verification
Inspect service-principal inventory, owner metadata, authentication method, effective permissions, usage telemetry, and stale-identity reports.