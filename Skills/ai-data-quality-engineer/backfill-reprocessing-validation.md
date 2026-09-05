# Backfill and Reprocessing Validation

## Purpose
Validate historical backfills and reprocessing jobs so corrected data does not introduce new inconsistencies, leakage, duplication, or version drift.

## When to use
Use after bug fixes, late-arriving data recovery, schema migrations, source repairs, or feature recomputation.

## Inputs
Affected time range, old and new pipeline versions, source snapshots, expected corrections, downstream consumers, validation thresholds.

## Preconditions
The intended scope and reason for reprocessing are documented.

## Context to inspect
Job idempotency, partitioning, checkpoints, deduplication, feature windows, label timing, dataset versions, publication and rollback paths.

## Core knowledge
Backfills can be logically correct yet operationally harmful if they duplicate records, cross temporal boundaries, overwrite newer data, or mix incompatible versions.

## Procedure
1. Define exact partitions and records to reprocess.
2. Freeze or coordinate conflicting writes.
3. Capture pre-backfill baselines.
4. Run on a limited sample or partition first.
5. Compare counts, keys, distributions, and quality metrics.
6. Check duplicates and temporal boundaries.
7. Verify corrected records match intended logic.
8. Confirm downstream versions and caches update safely.
9. Expand progressively with checkpoints.
10. Reconcile final coverage and record the produced dataset version.

## Decision points
Use in-place correction only when rollback and lineage remain reliable; otherwise publish a new version and migrate consumers.

## Common failure patterns
Reprocessing all history unnecessarily, non-idempotent writes, overlapping partitions, mixing old and new logic, and skipping downstream cache invalidation.

## Verification
Expected records changed, unaffected records remained stable, quality metrics improved, and no duplicate or missing partitions remain.

## Expected output
A validated backfill with reconciliation evidence, version metadata, and rollback record.

## Stop conditions
Stop when source snapshots are unavailable, writes cannot be made idempotent, or historical semantics cannot be reconstructed.