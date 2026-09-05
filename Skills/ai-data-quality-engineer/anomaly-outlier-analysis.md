# Anomaly and Outlier Analysis

## Purpose
Detect unusual records or distributions and distinguish legitimate rare cases from pipeline defects or corrupted data.

## When to use
Use during dataset validation, after source changes, when extreme values appear, or when models show instability on rare inputs.

## Inputs
Dataset, schema, expected ranges, historical baselines, domain rules, source metadata, downstream model behavior.

## Preconditions
Critical fields and plausible operational ranges are understood.

## Context to inspect
Parsing, units, source system changes, joins, transforms, normalization, sensor or event behavior, and prior incidents.

## Core knowledge
Outliers are not automatically errors. Rare but valid examples can be crucial for robust AI systems. Senior analysis combines statistical detection with domain semantics and lineage evidence.

## Procedure
1. Profile distributions and extreme values.
2. Apply deterministic range and cross-field checks.
3. Compare anomalies against historical baselines.
4. Segment by source, time, and relevant subgroup.
5. Trace suspicious records to origin and transformations.
6. Distinguish corruption, legitimate rare events, and previously unknown regimes.
7. Quantify downstream impact.
8. Correct source or transformation defects.
9. Preserve valuable rare cases when valid.
10. Add targeted monitoring for recurring anomalies.

## Decision points
Reject records only when evidence supports invalidity. Winsorize or clip only when model and domain semantics justify it.

## Common failure patterns
Deleting rare data automatically, using a single z-score rule for all features, ignoring units, and hiding source defects with clipping.

## Verification
Reviewed samples confirm anomaly classification and corrected pipelines stop producing invalid patterns without removing legitimate edge cases.

## Expected output
An anomaly analysis with classifications, root causes, remediation, and monitoring rules.

## Stop conditions
Stop when domain semantics are insufficient to determine whether extreme values are valid.