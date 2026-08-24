# Batch Processing Rules

## Purpose
Make large SQL workloads bounded, restartable, observable, and safe for concurrent production traffic.

## Scope
Backfills, ETL-style SQL, archival, reconciliation, bulk updates, and maintenance scripts.

## MUST
- Large operations MUST estimate affected rows, runtime, log/WAL growth, locks, and resource demand before production execution.
- Batches MUST have deterministic selection boundaries and progress evidence.
- Long-running jobs MUST support safe restart or clearly defined recovery.
- Throttling or scheduling MUST protect critical workloads when contention risk exists.

## MUST NOT
- MUST NOT execute an unbounded production-wide update/delete merely because it completes in a small environment.
- MUST NOT use arbitrary sleeps or batch sizes without observing their operational effect.
- MUST NOT report completion without validating expected row counts and invariants.

## SHOULD
- Use idempotent or checkpointed processing where feasible.
- Prefer small committed batches when atomic whole-dataset change is not required.

## Exceptions
Whole-set atomic operations require documented necessity, capacity evidence, maintenance window, recovery plan, and human approval.

## Verification
Rehearse at representative scale, monitor duration/locks/log growth, verify checkpoints and restart behavior, compare counts/checksums, and inspect application health during execution.