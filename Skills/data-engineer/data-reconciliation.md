# Data Reconciliation

## Purpose
Prove that data moved or transformed through a pipeline remains complete and semantically correct relative to authoritative sources.

## When to use
Use for new pipelines, migrations, backfills, financial or regulated datasets, incident recovery, and changes to transformation logic.

## Inputs
Source and target datasets, business keys, expected transformations, time boundaries, tolerances, and authoritative metrics.

## Context to inspect
Inspect source mutability, late arrivals, duplicates, filters, timezone boundaries, rounding, deleted records, and transformation version.

## Core knowledge
Row counts alone are weak evidence. Strong reconciliation combines population coverage, key sets, aggregates, checksums or hashes, exception samples, and business-level totals while accounting for intentional transformations.

## Procedure
1. Define exact source and target comparison boundaries.
2. Document expected exclusions and transformations.
3. Compare record counts by meaningful partitions.
4. Compare distinct business-key coverage.
5. Reconcile important sums, min/max, and distributions.
6. Use hashes or field comparisons where practical.
7. Classify mismatches by known causes.
8. Investigate unexplained differences to root cause.
9. Persist reconciliation evidence for high-risk changes.
10. Repeat after final publication or cutover.

## Decision points
Use exact comparison for deterministic high-value data; use statistical or sampled comparison only when scale makes exact checks disproportionate and risk permits it.

## Common failure patterns
Comparing moving source windows, ignoring timezone differences, counts that hide substituted rows, tolerances without business rationale, and accepting unexplained mismatches as noise.

## Verification
Ensure comparisons use consistent snapshots/boundaries, reproduce mismatches independently, and obtain acceptance for any documented residual difference.

## Expected output
A reconciliation report with coverage, metric comparisons, explained exceptions, and a clear pass/fail conclusion.

## Stop conditions
Stop when source and target cannot be compared at consistent logical points or unexplained differences exceed accepted tolerance.