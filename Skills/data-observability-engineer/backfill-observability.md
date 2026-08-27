# Backfill Observability

## Purpose
Monitor historical reprocessing so backfills complete correctly without duplicating, overwriting, or silently omitting data.

## When to use
Use for replaying failed intervals, rebuilding historical partitions, correcting transformations, or migrating logic across past data.

## Inputs
Backfill scope, partition ranges, idempotency behavior, source availability, destination semantics, lineage, capacity constraints.

## Preconditions
The backfill must have an explicit scope, expected output, and rollback or recovery approach.

## Context to inspect
Inspect existing partitions, checkpoints, deduplication keys, write mode, downstream refresh behavior, resource contention, and historical source retention.

## Core knowledge
Backfills differ from normal scheduled processing: they can create unusual volume, resource contention, duplicate events, and temporal ordering issues. Observability must distinguish intentional historical work from live-data failures.

## Procedure
1. Record the exact interval and assets to be backfilled.
2. Establish expected partition and row coverage before execution.
3. Tag runs so backfill telemetry is distinguishable from normal production.
4. Monitor progress, throughput, retries, and resource impact.
5. Validate idempotency or deduplication behavior.
6. Check partition completeness and reconciliation after each logical batch.
7. Monitor downstream consumers for unintended refresh or alert storms.
8. Pause when quality checks fail rather than continuing across the full range.
9. Validate final coverage and remove temporary suppressions.

## Decision points
Use small batches when rollback is difficult or historical data is heterogeneous. Parallelize only when source, destination, and downstream systems can tolerate the load. Suppress normal freshness alerts only with explicit scoped rules.

## Common failure patterns
- Replaying without idempotency analysis
- Hiding genuine incidents with broad alert suppression
- No progress metric
- Completing jobs without validating historical coverage
- Saturating production resources

## Verification
Reconcile expected and actual partitions, row/key counts, duplicate rates, and representative business aggregates before declaring completion.

## Expected output
Observable backfill progress, scoped alert behavior, validated historical data, and completion evidence.

## Stop conditions
Stop on unexpected duplicate growth, destructive write behavior, source-retention gaps, or material production degradation.