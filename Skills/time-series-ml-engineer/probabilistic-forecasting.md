# Probabilistic Forecasting

## Purpose
Produce and validate predictive distributions or quantiles so downstream decisions can account for uncertainty rather than relying only on point forecasts.

## When to use
Use when inventory, staffing, capacity, risk, scheduling, or safety decisions depend on tails and confidence, not only expected values.

## Inputs
Historical targets, horizons, required quantiles or distributions, decision costs, temporal evaluation folds.

## Context to inspect
Inspect heteroskedasticity, non-Gaussian tails, censoring, intermittency, aggregation level, and whether downstream systems consume intervals, quantiles, or samples.

## Core knowledge
Probabilistic forecasts may be produced through parametric likelihoods, quantile regression, conformal methods, ensembles, Bayesian/state-space methods, or predictive sampling. Sharpness without calibration is dangerous. Marginal interval coverage does not guarantee conditional calibration across horizons or regimes.

## Procedure
1. Identify the uncertainty representation downstream decisions require.
2. Establish simple empirical or residual-based interval baselines.
3. Choose parametric distributions only when support and tail behavior are credible.
4. Use quantile objectives when specific service levels matter.
5. Fit using temporally valid splits and training-only transformations.
6. Measure pinball loss, proper scoring rules, coverage, width, and calibration by horizon.
7. Check interval behavior by entity, magnitude, season, and regime.
8. Apply calibration or conformal correction on a dedicated calibration period when justified.
9. Test monotonicity of predicted quantiles.
10. Stress rare events and distribution shifts separately.
11. Document how uncertainty propagates through aggregation or downstream optimization.
12. Monitor coverage after deployment.

## Decision points
Use quantiles for asymmetric decision costs; full distributions for simulation/optimization; conformal approaches when distributional assumptions are weak and exchangeability approximations are acceptable.

## Common failure patterns
Reporting nominal intervals without coverage testing, Gaussian assumptions on skewed data, quantile crossing, calibrating on the test set, and treating epistemic uncertainty as solved by a single likelihood.

## Verification
Verify untouched-period coverage, quantile monotonicity, proper-score improvement over baselines, interval width, subgroup calibration, and decision-level impact.

## Expected output
A calibrated uncertainty model with explicit semantics, evaluation evidence, and downstream consumption contract.

## Stop conditions
Stop if uncertainty semantics are unspecified, calibration data is insufficient, or downstream users may interpret probabilistic outputs incorrectly.