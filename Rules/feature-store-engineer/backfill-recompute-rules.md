# Backfill and Recompute Rules

## Purpose
Make historical recomputation safe, reproducible, and isolated from live production workloads.

## Scope
Backfills, replay, correction jobs, historical materialization, and large-scale recomputation.

## MUST
- Backfills MUST specify feature version, time range, source version, expected volume, and destination.
- Large recomputations MUST be capacity-assessed before execution.
- Backfills affecting online serving MUST define cutover and rollback behavior.
- Idempotency or duplicate-handling semantics MUST be explicit.
- Destructive correction of historical data MUST require human approval.

## MUST NOT
- MUST NOT run unbounded backfills against production stores without rate or capacity controls.
- MUST NOT overwrite current online values with older historical state.
- MUST NOT mix data produced by incompatible feature definitions without clear version boundaries.

## SHOULD
- Prefer isolated staging locations before committing large corrections.
- Record backfill provenance and operator identity.

## Exceptions
Emergency corrections require incident context, bounded scope, approval, and post-run verification.

## Verification
Inspect job parameters, dry-run evidence, capacity estimates, audit logs, and before/after reconciliation.