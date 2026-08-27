# Data Quality Anomaly Detection

## Purpose
Detect statistically or rule-based anomalies in data values that indicate broken sources, transformations, or business semantics.

## When to use
Use when simple schema and volume checks are insufficient to catch incorrect distributions, impossible values, or unexpected relationships.

## Inputs
Historical distributions, domain constraints, critical fields, incident examples, seasonality, segmentation dimensions.

## Preconditions
Baseline data must be sufficiently representative; known bad periods should be excluded from learning baselines.

## Context to inspect
Inspect transformations, business rules, source behavior, null handling, outliers, metric definitions, dimensionality, and downstream consequences.

## Core knowledge
Anomaly detection complements deterministic validation. Statistical models can identify unexpected behavior but must account for drift, seasonality, sparse data, multiple testing, and operational explainability.

## Procedure
1. Rank fields and metrics by business impact.
2. Define deterministic invariants first.
3. Establish historical baselines for variable metrics.
4. Choose appropriate univariate or multivariate methods.
5. Segment only where segment-level anomalies are actionable.
6. Set sensitivity using historical incidents and false-positive tolerance.
7. Attach lineage, ownership, and sample evidence to alerts.
8. Suppress expected changes during known migrations when controlled.
9. Backtest detection against known incidents.
10. Recalibrate when legitimate behavior shifts materially.

## Decision points
Prefer rules for hard domain invariants and statistical methods for variable behavior. Use adaptive thresholds when seasonality is significant. Avoid opaque models when responders cannot interpret the signal.

## Common failure patterns
- Learning baselines from corrupted history
- Alerting on every distribution shift
- Ignoring seasonality
- Excessive dimensional segmentation
- No distinction between statistical surprise and business impact

## Verification
Backtest against known good and bad periods, measure precision and recall operationally, and confirm responders receive diagnostic evidence.

## Expected output
A calibrated anomaly-detection suite with documented baselines, thresholds, and incident routing.

## Stop conditions
Stop when insufficient clean history exists or when the domain cannot define what deviations matter.