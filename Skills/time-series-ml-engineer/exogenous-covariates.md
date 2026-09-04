# Exogenous Covariates

## Purpose
Use external and known-future variables without leaking unavailable information into temporal models.

## When to use
Use when weather, prices, promotions, holidays, schedules, macro indicators, controls, or operational states materially influence the target.

## Inputs
Covariate sources, publication/availability timestamps, horizon, target series, backtest protocol.

## Context to inspect
Inspect when each covariate becomes known, revision history, forecast-versus-actual versions, missingness, source reliability, and serving latency.

## Core knowledge
A historically recorded covariate is not automatically available at prediction time. Future weather actuals, finalized economic figures, and revised schedules are classic leakage sources. Models should train on the same information version available in production.

## Procedure
1. Classify covariates as static, observed-past, known-future, forecasted-future, or unavailable.
2. Record publication and revision timing.
3. Reconstruct historical as-of values where possible.
4. Establish a target-only baseline before adding covariates.
5. Add covariates incrementally and run temporal ablations.
6. For future-forecasted inputs, train/evaluate using historical forecasts rather than realized values.
7. Add missing/late-source behavior and fallbacks.
8. Check interactions by horizon and regime.
9. Test sensitivity to source errors and stale values.
10. Document serving SLA and provenance for every covariate.

## Decision points
Use covariates only when incremental value survives realistic as-of evaluation. Prefer robust fallbacks when external sources are unreliable. Scenario inputs may be appropriate when future values are decisions rather than observations.

## Common failure patterns
Using realized future values, ignoring publication lag, training on revised history, brittle dependence on one API, and adding correlated covariates without measurable gain.

## Verification
Verify as-of joins, ablation gains, fallback behavior, historical forecast versions, and inference-time availability.

## Expected output
A versioned covariate contract and validated feature set with availability guarantees.

## Stop conditions
Stop if historical as-of data cannot be approximated credibly or a covariate has no reliable production source.