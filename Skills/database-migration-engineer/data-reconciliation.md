# Data Reconciliation

## Purpose
Prove that migrated data is complete and semantically equivalent to the authoritative source.

## When to use
Use after baseline loads, during synchronization, at cutover, and after migration.

## Inputs
Source and target datasets, stable keys, transformation rules, canonicalization rules, expected exceptions, and tolerance definitions.

## Core knowledge
Reconciliation should be layered: object counts, row counts, null counts, aggregates, partition checksums, row-level comparison, and business invariants. Transformations require canonical comparison rather than raw byte equality.

## Procedure
1. Define what equality means for each transformed dataset.
2. Partition comparisons by stable key or time range.
3. Compare row counts and key coverage.
4. Compare null counts and critical aggregates.
5. Compute deterministic canonical checksums where valid.
6. Drill into mismatched partitions at row level.
7. Classify differences as expected, source defect, transformation defect, or sync defect.
8. Correct and rerun affected scopes.
9. Preserve reconciliation evidence.
10. Obtain acceptance for any residual exception.

## Decision points
Use cryptographic hashes when exact canonical equality is required; use aggregate tolerances only for domains where approximate equality is explicitly acceptable.

## Common failure patterns
Count-only validation, unstable hash ordering, comparing transformed values without canonicalization, and hiding exceptions in broad tolerances.

## Verification
All critical partitions reconcile or have explicit, owned, documented exceptions.

## Expected output
Repeatable reconciliation results with mismatch drill-down.

## Stop conditions
Stop cutover when unexplained critical mismatches remain.