# Time-Series Anomaly Detection

## Purpose
Design anomaly-detection systems that distinguish meaningful deviations from expected temporal variation while controlling alert fatigue.

## When to use
Use for operational monitoring, fraud/event detection, sensor health, demand spikes, or quality signals where anomalies are defined relative to temporal context.

## Inputs
Timestamped signals, anomaly examples if available, business severity rules, seasonality, alerting constraints, intervention process.

## Context to inspect
Inspect trend, seasonality, variance changes, missingness, maintenance windows, known events, multivariate dependencies, and label quality.

## Core knowledge
Anomalies may be point, contextual, collective, change-point, or multivariate. Forecast-residual, decomposition, robust statistics, isolation methods, autoencoders, and change detectors solve different cases. Threshold calibration and alert grouping are as important as detector choice.

## Procedure
1. Define what operationally constitutes an anomaly and what action follows.
2. Separate data-quality failures from genuine process anomalies.
3. Establish seasonal/statistical threshold baselines.
4. Choose detector family based on anomaly type and label availability.
5. Fit only on periods appropriate for the assumed normal regime.
6. Backtest against known incidents and quiet periods.
7. Calibrate thresholds using precision/recall, alert rate, severity, and response cost.
8. Add persistence, cooldown, grouping, or hysteresis when needed.
9. Slice performance by season, entity, and operating regime.
10. Define behavior for missing/stale inputs and detector warm-up.
11. Log explanation evidence such as residual magnitude or contributing variables.
12. Monitor alert volume and confirmed-action rate after deployment.

## Decision points
Prefer forecast-residual methods for predictable seasonal signals; change-point methods for sustained regime shifts; multivariate methods when relationships between signals carry the anomaly.

## Common failure patterns
Thresholds tuned on test incidents, treating outages as anomalies rather than bad data, excessive alerts from seasonal peaks, no cooldown, and evaluation based only on point-wise accuracy.

## Verification
Verify incident detection latency, false-alert burden, historical replay, quiet-period behavior, threshold stability, and response-team acceptance.

## Expected output
A detector with documented anomaly semantics, calibrated thresholds, alert policy, evaluation evidence, and fallback behavior.

## Stop conditions
Stop if no actionable anomaly definition exists, labels are too unreliable for claimed supervised evaluation, or alert consumers have no response path.