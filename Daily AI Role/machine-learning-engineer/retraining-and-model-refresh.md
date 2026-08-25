# Retraining and Model Refresh

## Purpose
Refresh models based on evidence while controlling data changes, regression risk and unnecessary retraining cost.

## When to use
Use for scheduled refreshes, detected degradation, new labeled data or meaningful domain change.

## Inputs
Current model, new data, drift/quality metrics, retraining cost, evaluation gates and rollout policy.

## Context to inspect
Label maturity, seasonality, upstream changes, prior retraining outcomes and feature compatibility.

## Core knowledge
More recent data is not automatically better. Retraining can encode temporary anomalies, bad labels or changed selection mechanisms.

## Procedure
1. Define retraining trigger and expected benefit.
2. Validate new data and label maturity.
3. Compare new versus historical distributions and coverage.
4. Choose training window with seasonality and concept evolution in mind.
5. Rebuild splits with point-in-time correctness.
6. Train candidate reproducibly.
7. Compare against incumbent on common evaluation sets and recent slices.
8. Require all quality, fairness, latency and cost gates.
9. Roll out progressively with rollback available.
10. Record trigger, data window and outcome.

## Decision points
Use scheduled retraining for predictable drift; event/metric-triggered retraining when labels and monitoring support reliable triggers. Prefer no retraining when degradation is caused by broken inputs.

## Common failure patterns
Blind daily retraining, immature labels, ever-shrinking windows, incumbent comparison on different data and automatic promotion on one metric.

## Verification
Confirm candidate gains on untouched/recent evaluation, reproduce lineage and monitor post-rollout outcomes.

## Expected output
A justified refreshed model or an evidence-backed decision not to retrain.

## Stop conditions
Stop when data quality, label maturity, evaluation comparability or rollback readiness is inadequate.