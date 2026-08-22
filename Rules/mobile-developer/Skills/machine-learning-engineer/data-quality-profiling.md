# Data Quality Profiling

## Purpose
Determine whether training and inference data are trustworthy enough for ML decisions.

## When to use
During dataset onboarding, pipeline changes, unexplained model degradation, or before retraining.

## Inputs
Schemas, samples, lineage, statistics, label definitions, timestamps, source-system behavior.

## Context to inspect
Missingness, duplicates, ranges, cardinality, outliers, temporal coverage, label consistency, source changes, and train-serving parity.

## Core knowledge
ML quality depends on semantic correctness, not only schema validity. Missing values and outliers may encode business processes. Temporal and subgroup distributions matter.

## Procedure
1. Map fields to business meaning and source lineage.
2. Profile completeness, validity, uniqueness, distributions, and correlations.
3. Inspect labels and annotation consistency.
4. Segment quality by time and important cohorts.
5. Detect impossible values and source-specific artifacts.
6. Compare training and serving schemas.
7. Define automated data-quality assertions.
8. Record remediation and ownership.

## Decision points
Reject corrupt records only when semantics justify it; otherwise model missingness explicitly. Prefer upstream fixes over repeated downstream cleaning when ownership permits.

## Common failure patterns
Blind imputation, removing useful rare events, profiling only aggregate statistics, silently coercing types, and ignoring lineage.

## Verification
Assertions reproduce identified defects; cleaned data retains traceability; quality thresholds run automatically on future data.

## Expected output
A data-quality report, validated dataset contract, checks, and remediation plan.

## Stop conditions
Escalate when source semantics are unknown, labels are unreliable, or remediation would alter regulated records.