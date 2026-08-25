# Source Decommissioning

## Purpose
Retire legacy database assets only after the target is proven authoritative and recoverable.

## Scope
Covers old databases, replicas, schemas, accounts, routes, jobs, backups, and infrastructure.

## MUST
- Decommissioning MUST wait until acceptance criteria, reconciliation, consumer migration, and retention requirements are satisfied.
- Final source state and required recovery artifacts MUST be retained according to the approved recovery window.
- Access, replication, monitoring, scheduled jobs, and infrastructure dependencies MUST be explicitly removed or transferred.

## MUST NOT
- MUST NOT destroy the source merely because traffic has switched successfully.
- MUST NOT delete recovery artifacts or data subject to retention requirements without approval.

## SHOULD
- Disable or isolate legacy write paths before destructive retirement to expose hidden consumers safely.
- Track decommissioning as a separate reviewed phase.

## Exceptions
Accelerated retirement requires evidence of target correctness, dependency clearance, recovery sufficiency, and explicit human approval.

## Verification
Inspect consumer telemetry, reconciliation sign-off, retention records, IAM cleanup, job inventories, routing, backups, and infrastructure state.