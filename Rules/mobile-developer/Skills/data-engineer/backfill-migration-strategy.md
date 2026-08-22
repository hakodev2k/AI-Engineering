# Backfill and Data Migration Strategy

## Purpose
Move or recompute historical data safely while production continues, with explicit reconciliation, rollback, and capacity controls.

## When to use
Use for new models, logic corrections, platform migrations, schema changes, historical feature generation, and incident recovery.

## Inputs
Historical range, source-of-truth definition, target model, transformation version, capacity, dependencies, and acceptance criteria.

## Context to inspect
Inspect current writes, mutable history, partition boundaries, target uniqueness, pipeline idempotency, consumer cutover, and compute/storage quotas.

## Core knowledge
Backfills are production workloads. They compete for resources, may overlap live processing, and can amplify defects across years of history. Separate calculation, validation, publication, and cutover.

## Procedure
1. Define source of truth and exact historical scope.
2. Version transformation logic and parameters.
3. Choose safe processing partitions.
4. Estimate compute, storage, and source load.
5. Make publication idempotent.
6. Run a small representative slice first.
7. Reconcile counts, checksums, and business totals.
8. Throttle concurrency to protect current workloads.
9. Track completed partitions and failures durably.
10. Cut consumers over only after acceptance evidence.

## Decision points
Use shadow tables when validation or rollback requires isolation; overwrite in place only when partition boundaries and recovery are proven. Dual-run old and new pipelines for high-risk migrations.

## Common failure patterns
One giant backfill, unbounded concurrency, changing transformation code mid-run, mixing live and historical checkpoints, and no rollback copy.

## Verification
Validate sample and aggregate results, confirm every intended partition completed exactly once logically, compare old/new outputs, and monitor live SLA impact.

## Expected output
A resumable migration/backfill with capacity plan, progress tracking, reconciliation, and controlled cutover.

## Stop conditions
Stop when source load threatens production, validation diverges materially, transformation version changes unexpectedly, or rollback becomes impossible.