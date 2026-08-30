# Backfill and Reconciliation

## Purpose
Execute historical backfills safely and prove that repaired or newly derived data is complete and consistent with authoritative sources.

## When to use
Use after logic corrections, source outages, historical model changes, late source availability, or migrations requiring historical regeneration.

## Inputs
Affected date/key ranges, transformation version, source availability, target tables, reconciliation rules, compute limits, consumer impact.

## Context to inspect
Current production data, incremental state, partitions, downstream dependencies, retention, prior incidents, and orchestration backfill controls.

## Core knowledge
Backfills can overwhelm sources, duplicate data, overwrite newer corrections, or publish mixed logic versions. Safe execution requires bounded scope, deterministic transformations, version awareness, capacity controls, and independent reconciliation.

## Procedure
1. Define the exact affected range and expected correction.
2. Freeze or coordinate conflicting writers when necessary.
3. Confirm source history is complete for the range.
4. Select merge, partition replacement, or rebuild strategy.
5. Dry-run on a small representative range.
6. Rate-limit concurrency to protect shared systems.
7. Execute in observable batches with restart checkpoints.
8. Reconcile counts, totals, keys, and business invariants.
9. Re-run dependent models in correct order.
10. Record evidence, changed ranges, and release status.

## Decision points
Use partition replacement when boundaries are clean and deterministic. Use keyed merge when corrections are sparse. Rebuild a model when state complexity makes surgical repair riskier than recomputation.

## Common failure patterns
Unbounded historical scans, mixed code versions, advancing checkpoints before validation, duplicate rows after retries, and declaring success from job completion alone.

## Verification
Compare repaired ranges to independent source aggregates, run quality tests, inspect downstream deltas, and repeat a batch to prove idempotency.

## Expected output
A controlled backfill with reconciliation evidence and documented affected scope.

## Stop conditions
Stop when source history is incomplete, reconciliation materially disagrees, or downstream impact cannot be bounded.