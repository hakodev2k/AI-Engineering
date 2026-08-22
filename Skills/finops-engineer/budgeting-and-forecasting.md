# Budgeting and Forecasting

## Purpose
Create actionable cloud budgets and forecasts that account for growth, seasonality, planned changes, and commitment economics.

## When to use
Use for annual/quarterly planning, monthly forecast updates, major launches, migrations, or persistent budget variance.

## Inputs
Historical spend and usage, business growth assumptions, roadmap, pricing, commitments, seasonality, unit metrics, finance targets.

## Context to inspect
Inspect one-time costs, migrations, new regions, traffic trends, data growth, contractual discounts, commitment expirations, and accounting boundaries.

## Core knowledge
A useful forecast is assumption-driven and continuously recalibrated. Separate run-rate, growth, planned step changes, and uncertainty. Budget is a decision constraint; forecast is the current best estimate.

## Procedure
1. Define scope, horizon, and financial calendar.
2. Clean historical spend and identify structural breaks.
3. Establish baseline run-rate by major cost driver.
4. Model organic growth and seasonality.
5. Add roadmap-driven step changes and decommissions.
6. Model commitment purchases/expirations separately.
7. Produce base, upside, and downside scenarios where uncertainty matters.
8. Compare forecast to budget and explain variance.
9. Assign assumptions and owners.
10. Reforecast on a regular cadence using actuals.

## Decision points
Use driver-based forecasting when usage metrics explain spend; use statistical trends for stable services; use scenario ranges when roadmap uncertainty dominates.

## Common failure patterns
Straight-line extrapolation through migrations, confusing budget with forecast, hiding uncertainty in a single precise number, ignoring commitment expiration, and failing to reconcile actuals.

## Verification
Back-test forecast error; reconcile actual billing; validate major assumptions with service owners; ensure scenario totals are internally consistent.

## Expected output
A versioned forecast with assumptions, scenarios, budget variance, confidence, and owner actions.

## Stop conditions
Escalate when business growth assumptions or finance accounting rules are unavailable and materially affect the result.