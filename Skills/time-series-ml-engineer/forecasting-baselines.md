# Forecasting Baselines

## Purpose
Build strong, transparent baselines that establish whether a sophisticated time-series model adds real value.

## When to use
Use at project start, after major data changes, and whenever a new model claims improvement.

## Inputs
Historical target series, forecast horizon, seasonality assumptions, business rules, evaluation protocol.

## Context to inspect
Inspect cadence, trend, dominant seasonal periods, sparsity, intermittency, hierarchy, and incumbent operational forecasts.

## Core knowledge
Naive, seasonal-naive, moving-average, drift, exponential smoothing, and simple linear/autoregressive models often perform surprisingly well. A Senior engineer treats them as controls, not throwaway prototypes.

## Procedure
1. Define deterministic naive and seasonal-naive forecasts.
2. Add drift and moving-average baselines where trend exists.
3. Fit exponential smoothing or simple autoregression when appropriate.
4. Include any existing business-rule or analyst forecast.
5. Evaluate all baselines on identical temporal folds and horizons.
6. Report metrics by horizon, entity, season, and volume.
7. Measure runtime, latency, and operational complexity as well as error.
8. Identify regions where complex models must outperform to justify deployment.
9. Preserve baseline implementations in the evaluation pipeline.
10. Re-run baselines after data or target-definition changes.

## Decision points
Use seasonal-naive when stable periodicity dominates. Use intermittent-demand baselines when zeros are common. Prefer the simplest model that meets the required decision quality.

## Common failure patterns
Comparing models on different splits, using weak baselines only, excluding incumbent human forecasts, and ignoring the cost advantage of simple approaches.

## Verification
Verify baseline outputs manually on small sequences and confirm all models share identical cutoffs, target definitions, and metrics.

## Expected output
A reproducible baseline suite with performance and cost comparisons used as release gates for complex models.

## Stop conditions
Stop if target semantics or seasonal period are not established, or evaluation data cannot be aligned consistently.