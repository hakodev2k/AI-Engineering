# Data Quality and Leakage

## Purpose
Assess whether training and evaluation data are trustworthy, representative, and free from leakage that would invalidate model results.

## When to use
Use before training, after dataset changes, when offline metrics look suspiciously strong, or when production performance diverges from validation.

## Inputs
- Dataset schemas and samples
- Feature-generation code
- Label-generation logic
- Event timestamps
- Train/validation/test split logic

## Context to inspect
Inspect source systems, joins, timestamp semantics, missingness, duplicates, outliers, sampling, label delays, post-outcome fields, and whether preprocessing is fit only on training data.

## Core knowledge
Leakage can enter through time, labels, joins, target-derived aggregates, preprocessing, duplicate entities, and random splitting of correlated observations. Data quality must be evaluated relative to the intended inference distribution.

## Procedure
1. Map each feature and label to its source and availability time.
2. Validate types, ranges, null rates, cardinality, and uniqueness.
3. Detect duplicate or near-duplicate entities across splits.
4. Audit joins for future or target-derived information.
5. Inspect label construction and delay.
6. Compare segment and temporal distributions.
7. Rebuild splits using entity or time boundaries when required.
8. Fit preprocessing exclusively on training data.
9. Run leakage probes such as single-feature models and shuffled-label checks.
10. Record data assumptions and quality gates.

## Decision points
Use temporal splits for future-facing systems, grouped splits for repeated entities, and stratification only when it does not break temporal or group independence. Remove suspicious features unless availability can be proven.

## Common failure patterns
- Random split across the same users or devices.
- Global normalization before splitting.
- Labels indirectly encoded in status fields.
- Backfilled production data used as if historically available.
- Silent schema coercion.

## Verification
Verify split independence, feature availability at inference time, reproducible quality checks, and realistic performance after suspicious signals are removed.

## Expected output
A data-quality report, leakage findings, corrected split strategy, and executable validation checks.

## Stop conditions
Stop if feature lineage cannot be established, timestamps are unreliable, or evaluation independence cannot be guaranteed.