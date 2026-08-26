# Backfill Validation

## Purpose
Plan and verify historical reprocessing so repairs do not introduce duplicates, gaps, inconsistent semantics, or excessive operational impact.

## When to use
Use after bug fixes, schema migrations, late source corrections, logic changes, or historical enrichment.

## Inputs
Affected time range, corrected logic, source retention, checkpoints, target schema, dependencies, capacity limits, and reconciliation controls.

## Preconditions
Root cause is understood and corrected logic is validated on representative data.

## Context to inspect
Inspect idempotency, partition overwrite semantics, downstream triggers, CDC, mutable sources, historical schema versions, retention, and compute/database capacity.

## Core knowledge
Backfills are production changes. Reprocessing old data under new logic may intentionally change results, but those differences must be defined and reconciled.

## Procedure
1. Define exact affected range and target grain.
2. Establish stable source snapshot or source semantics.
3. Validate corrected logic on a small known partition.
4. Define overwrite/upsert/idempotency behavior.
5. Prevent accidental downstream side effects.
6. Estimate resource load and throttle plan.
7. Backfill in bounded batches.
8. Reconcile each batch using counts, keys, and critical aggregates.
9. Monitor failures and retry only from safe checkpoints.
10. Validate downstream derived datasets.
11. Record completion, exceptions, and changed semantics.

## Decision points
Prefer partition replacement when outputs are deterministic and isolated; use idempotent upserts for mutable keyed data. Run shadow tables first when risk is high. Throttle when production workload shares constrained resources.

## Common failure patterns
Unbounded historical reruns; duplicate side effects; mixing old/new source snapshots; skipping downstream validation; retries that duplicate records; backfill logic diverging from normal pipeline logic.

## Verification
All target partitions reconcile, rerunning a completed batch is safe, downstream critical outputs are consistent, and operational SLOs remain acceptable.

## Expected output
A bounded backfill plan, execution evidence, reconciliation results, residual exceptions, and rollback/recovery notes.

## Stop conditions
Stop when source history is incomplete, writes are non-idempotent without containment, load threatens production, or discrepancies exceed approved tolerance.