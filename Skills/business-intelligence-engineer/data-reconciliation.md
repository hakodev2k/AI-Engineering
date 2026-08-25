# Data Reconciliation

## Purpose
Prove that analytical data and metrics agree with authoritative sources within explicitly defined tolerances.

## When to use
Use for new pipelines, migrations, metric disputes, incident investigation, or changes to transformation logic.

## Inputs
Source extracts, target datasets, business rules, expected timing, tolerances, keys, transformation lineage.

## Context to inspect
Inspect refresh timestamps, late-arrival behavior, source corrections, filters, currencies, timezones, grain, and known exclusions.

## Core knowledge
Reconciliation must compare equivalent populations at equivalent cutoffs. Aggregate equality alone can hide offsetting errors; use layered checks from counts and sums to entity-level differences.

## Procedure
1. Define authoritative source and comparison cutoff.
2. Align grain, timezone, currency, status, and inclusion rules.
3. Compare row counts and key coverage.
4. Compare additive totals by meaningful partitions.
5. Compare distinct counts and distributions.
6. Isolate unmatched keys and value deltas.
7. Trace discrepancies through transformation stages.
8. Classify differences as timing, expected transformation, source defect, or target defect.
9. Correct root cause rather than adding unexplained adjustments.
10. Automate stable reconciliation checks and alert thresholds.

## Decision points
Use exact equality for deterministic integer/key checks; tolerances only for justified floating-point, currency-conversion, or timing behavior. Reconcile incrementally when full-history comparisons are prohibitively expensive.

## Common failure patterns
Different cutoff times, comparing different grains, silent source backfills, rounding before aggregation, duplicate joins, and declaring success from one grand total.

## Verification
Produce reproducible comparison queries and a discrepancy report showing zero unexplained material differences.

## Expected output
Reconciliation evidence, categorized discrepancies, root-cause findings, fixes, and automated regression checks.

## Stop conditions
Stop when no authoritative source exists, cutoffs cannot be aligned, required historical data is unavailable, or tolerance requires business approval.