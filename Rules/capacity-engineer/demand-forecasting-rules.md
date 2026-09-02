# Demand Forecasting

## Purpose
Ensure forecasts are evidence-based, uncertainty-aware, and suitable for capacity decisions.

## Scope
Applies to traffic, transactions, users, jobs, data volume, compute demand, and resource consumption forecasts.

## MUST
- Forecasts MUST use relevant historical observations or explicitly documented proxy evidence.
- Forecast models MUST state horizon, assumptions, confidence or uncertainty, and known structural changes.
- Material events such as launches, migrations, promotions, customer onboarding, or decommissions MUST be modeled separately when they can shift demand.
- Forecast accuracy MUST be reviewed against actual demand and recalibrated when error becomes operationally significant.

## MUST NOT
- MUST NOT extrapolate a short stable period indefinitely.
- MUST NOT hide forecast error behind a single point estimate.
- MUST NOT mix incompatible workload units without documented conversion logic.

## SHOULD
- Forecasts SHOULD include baseline, expected, and stress scenarios.
- Forecast methods SHOULD remain explainable enough for reviewers to challenge assumptions.

## Exceptions
Exceptions require rationale, alternative evidence, identified risk, and a defined review point.

## Verification
Compare forecast inputs and outputs with source metrics, historical backtests, error rates, event assumptions, and documented scenario ranges.
