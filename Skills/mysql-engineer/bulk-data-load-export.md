# Bulk Data Load and Export

## Purpose
Move large datasets into or out of MySQL efficiently while controlling correctness, locking, replication, and resource impact.

## When to use
Use for backfills, imports, exports, archival, migrations, or large corrections.

## Inputs
Source/target format, row count, schema, transformation rules, maintenance window, replication topology, validation criteria.

## Context to inspect
Constraints, indexes, triggers, binlog settings, disk headroom, packet limits, transaction size, replica capacity, secure-file restrictions.

## Core knowledge
Large transactions amplify redo/undo, locks, replica lag, and recovery cost. Batching and resumability usually matter more than maximum single-stream throughput.

## Procedure
1. Define exact source/target semantics and validation totals.
2. Choose server-side load, batched SQL, logical dump, or ETL tooling based on environment.
3. Normalize/validate input before mutation.
4. Select bounded batch size and stable resume key.
5. Control concurrency and commit frequency.
6. Monitor redo, locks, disk, connections, and replica lag.
7. Throttle or pause at predefined thresholds.
8. Record progress idempotently.
9. Reconcile counts, checksums/aggregates, and sampled records.
10. Rebuild/analyze supporting structures if required.

## Decision points
Disable/rebuild indexes only when controlled offline economics clearly win. Prefer resumable batches for online systems; use larger bulk operations in isolated maintenance contexts.

## Common failure patterns
One giant transaction, no resume point, saturating replicas, unsafe constraint disabling, CSV encoding surprises, and validating only row count.

## Verification
Reconcile source/target, validate invariants, check replication, query plans, errors, and application behavior.

## Expected output
Resumable transfer procedure with throughput, throttle limits, and reconciliation evidence.

## Stop conditions
Stop on unexpected data loss/duplication, replica risk, disk pressure, lock escalation, or validation mismatch.