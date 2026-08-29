# Bulk Ingestion Rules

## Purpose
Load large graph datasets safely, deterministically, and at controlled operational cost.

## Scope
Initial loads, imports, ETL/ELT writes, backfills, and high-volume synchronization.

## MUST
- Validate source schema, identity rules, relationship endpoints, and required fields before loading.
- Define duplicate, missing-endpoint, malformed-record, and partial-failure behavior explicitly.
- Make resumability or restart strategy explicit for long-running loads.
- Measure write throughput, transaction pressure, memory, disk, index impact, and replication lag.
- Reconcile source and target counts plus graph invariants after completion.

## MUST NOT
- Disable integrity or security controls without an approved compensating plan.
- Treat successful process exit as proof of complete ingestion.
- Retry failed batches blindly when writes are not idempotent.

## SHOULD
- Batch writes according to measured database behavior.
- Stage and quarantine invalid records rather than silently discarding them.

## Exceptions
Offline import modes require documented downtime, backup/recovery readiness, validation, and approval.

## Verification
Use preflight validation, sampled source-to-target tracing, reconciliation reports, failed-record accounting, runtime telemetry, and post-load query checks.