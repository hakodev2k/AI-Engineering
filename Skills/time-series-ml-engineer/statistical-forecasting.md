# Statistical Forecasting

## Purpose
Select, fit, diagnose, and operationalize classical statistical forecasting models when their assumptions and interpretability fit the problem.

## When to use
Use for univariate or low-dimensional series with meaningful trend/seasonality, limited data, interpretability requirements, or when strong statistical baselines are needed.

## Inputs
Historical series, cadence, horizon, exogenous variables if available, backtesting protocol, business constraints.

## Context to inspect
Inspect stationarity, seasonal periods, structural breaks, outliers, missingness, autocorrelation, and data volume per entity.

## Core knowledge
ARIMA/SARIMA, exponential smoothing/ETS, state-space models, dynamic regression, and decomposition-based methods make different assumptions about trend, seasonality, noise, and covariates. Residual diagnostics matter because systematic residual structure indicates missed signal or invalid assumptions.

## Procedure
1. Plot and profile level, trend, seasonality, and variance behavior.
2. Establish naive and seasonal-naive controls.
3. Test transformations only when they improve model assumptions and remain invertible.
4. Choose candidate ETS, ARIMA/state-space, or regression formulations based on structure.
5. Fit within temporal training windows only.
6. Diagnose residual autocorrelation, heteroskedasticity, bias, and outliers.
7. Evaluate forecast intervals as well as point accuracy when relevant.
8. Compare candidates across rolling origins and horizons.
9. Prefer parsimonious specifications when performance is equivalent.
10. Document parameter interpretation and known limitations.
11. Package deterministic preprocessing and inverse transforms with the model.
12. Monitor residual behavior after deployment.

## Decision points
Prefer ETS for explicit level/trend/seasonality; ARIMA-family models for autocorrelation structure; dynamic regression when exogenous signals are important; state-space models when latent components and uncertainty propagation matter.

## Common failure patterns
Over-differencing, fitting seasonality unsupported by data, selecting by in-sample fit, ignoring residual diagnostics, using future exogenous variables not available at prediction time, and producing intervals without calibration checks.

## Verification
Verify residual diagnostics, rolling-origin performance, numerical stability, inverse transformation correctness, and coverage of forecast intervals on untouched periods.

## Expected output
A justified statistical model specification with diagnostics, backtest evidence, intervals where applicable, and deployment-ready preprocessing.

## Stop conditions
Stop if assumptions are grossly violated, the history is too short for the requested seasonal structure, or required future covariates are unavailable.