# Backtesting and Temporal Cross-Validation

## Purpose
Design evaluation splits that reproduce deployment chronology and expose model instability across time, horizons, and regimes.

## When to use
Use for model selection, feature validation, hyperparameter tuning, and pre-release evaluation of any temporal model.

## Inputs
Timestamped dataset, prediction cadence, horizon, retraining cadence, validation budget, and deployment policy.

## Context to inspect
Inspect data revisions, availability delays, overlapping labels, entity lifecycles, seasonality, structural breaks, and intended retraining behavior.

## Core knowledge
Random cross-validation is usually invalid for temporally dependent prediction. Expanding-window, rolling-window, blocked, purged, and walk-forward designs answer different deployment questions. Evaluation must reproduce feature availability and model update timing.

## Procedure
1. Define the production prediction and retraining schedule.
2. Choose historical cutoffs that span representative regimes and seasons.
3. Enforce train-before-validation chronology.
4. Purge or embargo observations when label windows overlap split boundaries.
5. Recompute features independently at each cutoff.
6. Refit preprocessing using training data only.
7. Evaluate each horizon separately before aggregating.
8. Track metrics by time, entity cohort, volume, and relevant regime.
9. Compare against naive and incumbent baselines at every fold.
10. Report distribution of fold results, not only the mean.
11. Stress recent periods and known disruptions separately.
12. Freeze a final untouched temporal test period for release decisions.

## Decision points
Use expanding windows when all history remains useful; rolling windows when old regimes can become misleading. Use multiple origins when variance over time matters. Purge overlapping labels for event-based targets.

## Common failure patterns
Random shuffling, preprocessing before splitting, feature caches containing future data, tuning on the final test period, and hiding poor recent performance behind long-history averages.

## Verification
Verify split timestamps programmatically, assert maximum training time precedes each validation cutoff, inspect feature provenance, and reproduce at least one fold end-to-end as a historical replay.

## Expected output
A deterministic backtesting protocol with fold definitions, metrics, baseline comparisons, and release thresholds.

## Stop conditions
Stop if historical feature state cannot be reconstructed, timestamp ordering is unreliable, or the available evaluation period does not represent deployment.