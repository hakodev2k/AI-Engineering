# Data Reconciliation

## Purpose
Prove that data transferred or transformed between systems remains materially complete and consistent.

## When to use
Use for migrations, financial or operational pipelines, replicated data, major transformations, and incident recovery.

## Inputs
Source and target datasets, keys, transformation rules, time boundaries, expected tolerances, and lineage.

## Preconditions
Define comparable grain and authoritative semantics before comparing values.

## Context to inspect
Inspect filters, joins, deduplication, late data, time zones, currency/units, rounding, CDC behavior, deletes, and backfills.

## Core knowledge
Row counts alone are weak evidence. Strong reconciliation combines control totals, key coverage, aggregates, checksums where useful, and targeted record comparisons while accounting for legitimate transformation differences.

## Procedure
1. Define reconciliation scope and cutoff.
2. Normalize comparable keys, units, and time semantics.
3. Compare population counts by meaningful partitions.
4. Measure missing and extra keys.
5. Compare critical aggregates and control totals.
6. Compare selected record-level values.
7. Segment mismatches by cause pattern.
8. Account explicitly for expected lag or transformations.
9. Trace unexplained differences through lineage.
10. Correct defects and rerun from a stable boundary.
11. Preserve evidence and residual exceptions.

## Decision points
Use exact matching for correctness-critical values; tolerances only where rounding or approximation is legitimate. Prefer partitioned comparisons for large datasets. Use checksums as screening evidence, not semantic proof.

## Common failure patterns
Comparing different cutoffs; ignoring deletes; count-only validation; hidden timezone differences; floating-point equality; accepting unexplained residuals; reconciliation queries that alter source load materially.

## Verification
All critical controls reconcile within approved tolerance, unmatched records are explained, and repeated execution produces consistent results.

## Expected output
A reconciliation report with scope, controls, mismatch classifications, remediation, residual exceptions, and verification evidence.

## Stop conditions
Escalate when authoritative semantics are unclear, snapshots cannot be aligned, discrepancies affect regulated totals, or correction would overwrite source-of-record data.