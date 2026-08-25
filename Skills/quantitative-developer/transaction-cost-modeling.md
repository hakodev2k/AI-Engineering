# Transaction Cost Modeling

## Purpose
Estimate implementation shortfall so research reflects executable economics rather than frictionless returns.

## When to use
Use before strategy approval, when turnover changes, or when live slippage diverges from simulation.

## Inputs
Orders, fills, quotes, volumes, venue data, fees, borrow/funding rates, latency, and strategy horizon.

## Preconditions
Define the benchmark price and distinguish explicit fees from spread, impact, delay, and opportunity cost.

## Context to inspect
Order types, participation rates, liquidity buckets, market regimes, routing, and live execution reports.

## Core knowledge
Costs are nonlinear and state-dependent. Spread and market impact vary with volatility, size, urgency, venue, and participation. Calibrate on comparable execution rather than global averages.

## Procedure
1. Define implementation-shortfall decomposition.
2. Clean and align orders, fills, and contemporaneous market state.
3. Segment by asset, liquidity, volatility, size, and execution style.
4. Estimate explicit and implicit cost components.
5. Fit parsimonious impact relationships with uncertainty.
6. Validate chronologically and across regimes.
7. Apply conservative extrapolation outside calibrated ranges.
8. Integrate the model into backtests and portfolio optimization.
9. Compare predicted versus realized costs in production.
10. Recalibrate when drift is material.

## Decision points
Use simple bucketed estimates when data is sparse; use richer models only when they improve out-of-sample calibration and remain interpretable enough for risk review.

## Common failure patterns
Using closing price as an inappropriate benchmark, leakage from post-trade data, ignoring opportunity cost, extrapolating beyond liquidity support, and calibrating only successful fills.

## Verification
Check calibration curves, residuals, regime stability, and live predicted-versus-realized distributions.

## Expected output
A versioned cost model with documented scope, uncertainty, and monitoring thresholds.

## Stop conditions
Escalate when execution data is incomplete, benchmark semantics are disputed, or sample coverage cannot support the intended order sizes.