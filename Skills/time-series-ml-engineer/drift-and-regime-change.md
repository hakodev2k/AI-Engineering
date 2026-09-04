# Drift and Regime Change

## Purpose
Detect, diagnose, and respond to structural changes in temporal data and model behavior without confusing ordinary seasonality or transient noise with genuine regime shifts.

## When to use
Use when forecast bias changes persistently, residual distributions move, operational policies change, new market or sensor regimes appear, or an incumbent time-series model degrades unexpectedly.

## Inputs
- Historical predictions and realized targets
- Covariates and feature distributions
- Model and data-pipeline versions
- Known operational or external events
- Baseline forecasts and backtest results
- Retraining and deployment constraints

## Context to inspect
Inspect recent versus reference periods, label delay, seasonality, data-source changes, entity mix, timezone/cadence changes, target-definition revisions, and upstream outages before attributing degradation to concept drift.

## Core knowledge
Temporal drift can appear as covariate drift, target drift, concept drift, residual drift, variance change, or structural break. Seasonality and predictable lifecycle effects are not necessarily drift. Change-point tests and distribution-distance metrics are diagnostic evidence, not proof of causal change. Responses may include retraining, shorter windows, recency weighting, regime-specific models, feature changes, or fallback policies.

## Procedure
1. Confirm the degradation is statistically and operationally meaningful rather than normal metric variance.
2. Establish exact change timing using prediction, label, and pipeline timestamps.
3. Rule out data-quality, feature-serving, schema, timezone, and model-version defects.
4. Compare recent target, feature, prediction, and residual distributions with appropriate historical reference windows.
5. Slice changes by horizon, entity, geography, product, season, and other relevant segments.
6. Compare against naive and incumbent baselines to determine whether the environment changed or only the model failed.
7. Use change-point or rolling-statistic diagnostics to estimate regime boundaries where useful.
8. Examine known business, policy, system, or external events around candidate breakpoints.
9. Re-backtest candidate responses using only information available after the inferred change.
10. Compare full-history retraining, rolling-window retraining, recency weighting, feature changes, and regime-specific modeling.
11. Quantify the cost of false drift alarms versus delayed adaptation.
12. Define monitoring thresholds and minimum persistence before automated retraining or escalation.
13. Record the detected regime, evidence, response, and rollback path.

## Decision points
- Prefer retraining when relationships remain similar but parameters have moved.
- Prefer shorter windows or recency weighting when old data becomes actively misleading.
- Prefer regime-specific models when distinct, recurring operating states have defensible semantics.
- Do not automate model replacement from a single drift metric without performance evidence.

## Common failure patterns
- Treating seasonality as drift.
- Retraining before ruling out broken pipelines.
- Using labels that arrive too late to support the proposed reaction speed.
- Selecting a new window length on the final test period.
- Ignoring entity-mix changes that alter aggregate metrics.
- Triggering repeated retraining from noisy thresholds.

## Verification
Verify the inferred change across multiple diagnostics, reproduce the degradation with historical replay, demonstrate that the selected response improves post-change performance versus baselines, and confirm it does not catastrophically regress stable regimes.

## Expected output
A drift assessment containing evidence, estimated change timing, affected segments, recommended response, retraining policy, monitoring thresholds, and rollback criteria.

## Stop conditions
Stop and escalate if labels are unavailable, a pipeline defect cannot be ruled out, post-change history is insufficient to validate adaptation, or the proposed response would materially change production behavior without required approval.