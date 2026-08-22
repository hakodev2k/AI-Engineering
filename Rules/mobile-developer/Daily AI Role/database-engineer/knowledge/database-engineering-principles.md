# Database Engineering Principles

## Correctness is a production feature
Constraints, transaction boundaries, idempotency, and ownership protect data when applications fail or requests race.

## Design for transition states
Production schema changes occur while old/new code, backfills, replicas, caches, and jobs coexist. A target diagram is incomplete without a safe path from current state.

## Blast radius matters more than elegance
Prefer bounded batches, online operations, throttles, checkpoints, and reversible steps when they reduce lock time or recovery risk.

## Data size changes algorithms
An operation safe on thousands of rows can rewrite, scan, log, replicate, or lock billions. Estimate rows, bytes, log/WAL growth, duration, temp space, and replica impact.

## Recovery must be demonstrated
A backup artifact is useful only if accessible, decryptable, restorable, and consistent enough to meet recovery objectives.

## Evidence before folklore
Database tuning should start from workload, plans, waits, cardinality and before/after measures rather than universal index or configuration recipes.

## Ownership prevents shared-table entropy
Make authoritative writer and lifecycle explicit. Cross-domain shared mutation creates hidden coupling in migrations, incidents, and retention.

## Failure-aware completion
A change is not done when the command returns success; it is done after invariants, health, downstream behavior, recoverability, and residual risk are checked.