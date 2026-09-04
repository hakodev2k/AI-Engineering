# Forecast Metrics and Loss Selection

## Purpose
Choose evaluation metrics and training objectives that reflect operational costs across horizons, entities, scales, and asymmetric errors.

## When to use
Use when defining success criteria, comparing models, or diagnosing disagreement between offline metrics and business outcomes.

## Inputs
Target distribution, business cost model, horizon, entity hierarchy, baseline forecasts, downstream decision rules.

## Context to inspect
Inspect zeros, negative values, scale variation, outliers, asymmetry, weighting requirements, and whether aggregate or per-entity performance matters.

## Core knowledge
MAE, RMSE, WAPE, MASE, RMSSE, pinball loss, log scores, and business-specific losses answer different questions. MAPE fails near zero; RMSE emphasizes large errors; aggregate metrics can hide weak minority entities. Training loss need not equal release metric.

## Procedure
1. Translate downstream consequences into error preferences.
2. Identify invalid metrics for the target support.
3. Select one primary release metric and complementary diagnostics.
4. Define horizon and entity weighting explicitly.
5. Normalize across scales when comparisons span heterogeneous series.
6. Include probabilistic scores when uncertainty outputs are required.
7. Compare against naive baselines using scaled or relative measures.
8. Report metric distributions and tail performance, not only averages.
9. Slice by horizon, season, regime, volume, and business segment.
10. Check whether model ranking changes under plausible alternative metrics.
11. Connect offline improvements to decision simulation when possible.

## Decision points
Use MAE-like metrics for linear error costs, RMSE when large misses are disproportionately harmful, scaled metrics for cross-series comparison, and quantile/proper scores for probabilistic forecasts.

## Common failure patterns
MAPE with zeros, optimizing a convenient metric unrelated to decisions, averaging across scales without weighting, hiding tail failures, and changing metrics after seeing results.

## Verification
Verify metric formulas on hand-calculated cases, edge cases around zero, weighting rules, baseline scaling, and consistency between evaluation code and dashboards.

## Expected output
A metric specification with formulas, weighting, slicing, release thresholds, and rationale.

## Stop conditions
Stop if business error costs are contradictory or target support makes the proposed primary metric undefined.