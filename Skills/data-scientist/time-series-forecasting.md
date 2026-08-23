# Time Series Forecasting

## Purpose
Build and evaluate forecasts that respect temporal structure, uncertainty, horizon, and operational use.

## When to use
Use for demand, capacity, revenue, workload, inventory, or other future-valued quantities indexed by time.

## Inputs
Historical series, exogenous variables, forecast horizon, frequency, business calendar, and decision costs.

## Context to inspect
Trend, seasonality, holidays, structural breaks, missing periods, hierarchy, censoring, and future availability of regressors.

## Core knowledge
Forecast evaluation must use rolling or forward validation. Strong baselines such as seasonal naive are essential. Prediction intervals and horizon-specific error often matter more than one aggregate score.

## Procedure
1. Define horizon, granularity, and decision use.
2. Validate timestamp regularity and historical coverage.
3. Plot trend, seasonality, breaks, and anomalies.
4. Establish naive and seasonal baselines.
5. Build lag, calendar, and known-future features safely.
6. Compare suitable statistical and machine-learning approaches.
7. Backtest across multiple origins.
8. Evaluate errors by horizon, season, and important segments.
9. Produce calibrated uncertainty intervals when decisions require them.
10. Define retraining and drift triggers.

## Decision points
Prefer classical models for stable interpretable structure; use global or ML models when many related series and covariates provide evidence of benefit.

## Common failure patterns
Random splitting, using unknown future regressors, ignoring structural breaks, weak baselines, and evaluating only average error.

## Verification
Reproduce backtests, compare to baselines, inspect residuals, and validate interval coverage.

## Expected output
A forecast method with backtest evidence, uncertainty, operational assumptions, and monitoring criteria.

## Stop conditions
Stop when history is too short, future covariates are unavailable, or the process changed so fundamentally that historical validation is irrelevant.