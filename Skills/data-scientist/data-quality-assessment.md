# Data Quality Assessment

## Purpose
Determine whether data is trustworthy and fit for a specific analytical or modeling decision.

## When to use
Use during discovery, before training, after source changes, and when metrics or model behavior shift unexpectedly.

## Inputs
Datasets, schemas, lineage, source documentation, sampling rules, timestamps, labels, and known business constraints.

## Context to inspect
Collection mechanisms, joins, missingness, units, duplicates, source ownership, historical changes, and production availability.

## Core knowledge
Quality is contextual. Completeness, validity, consistency, uniqueness, timeliness, representativeness, and label reliability matter differently by use case. Missingness can be informative and source defects can masquerade as signal.

## Procedure
1. Define critical fields and invariants from the intended use.
2. Profile distributions, nulls, uniqueness, ranges, and cardinality.
3. Validate keys, joins, units, timestamps, and temporal ordering.
4. Detect duplicates, impossible values, discontinuities, and schema drift.
5. Compare important cohorts and time periods.
6. Investigate missingness mechanisms and label construction.
7. Trace anomalies to source systems where possible.
8. Quantify the impact of defects on analysis or model metrics.
9. Define automated quality checks and ownership.
10. Document residual limitations.

## Decision points
Repair data only when semantics are defensible. Prefer exclusion or explicit missing indicators over invented values when imputation assumptions are weak.

## Common failure patterns
Blind imputation, checking only aggregate statistics, silently dropping rows, ignoring temporal anomalies, and treating source-system values as ground truth without validation.

## Verification
Re-run quality checks on representative partitions and confirm critical defects have either been corrected, bounded, or explicitly accepted.

## Expected output
A fitness assessment, defect inventory, automated checks, and documented limitations.

## Stop conditions
Escalate when critical semantics cannot be established, lineage is unavailable, or defects invalidate the intended conclusion.