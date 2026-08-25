# Risk Modeling

## Purpose
Measure and decompose portfolio risk into actionable exposures for sizing, limits, stress testing, and attribution.

## When to use
Use when building a risk model, approving portfolio changes, or diagnosing unexpected P&L volatility.

## Inputs
Positions, returns, factors, instrument metadata, covariance estimates, scenarios, and mandates.

## Preconditions
Establish valuation conventions, exposure timestamps, horizons, and risk limits.

## Context to inspect
Factor definitions, covariance methodology, specific risk, missing-data handling, mappings, and historical breaches.

## Core knowledge
Risk estimates are model-dependent and backward-looking. Correlations change under stress; factor models trade detail for stability. Tail risk and nonlinear instruments may require scenario-based methods beyond covariance.

## Procedure
1. Map every position to economic risk drivers.
2. Validate units, signs, currencies, and market values.
3. Estimate or ingest factor and covariance inputs point-in-time.
4. Compute total, marginal, and component risk.
5. Reconcile factor and specific contributions.
6. Run historical and hypothetical stresses.
7. Test concentration, liquidity, and correlation shocks.
8. Compare model forecasts with realized outcomes.
9. Define alerts for exposure and model drift.
10. Document limitations and unsupported instruments.

## Decision points
Use factor models for scalable attribution; use full revaluation for nonlinear payoffs when approximations are unreliable. Prefer conservative proxies over fabricated precision for unmapped assets.

## Common failure patterns
Stale positions, double-counted hedges, unit errors, unstable covariance, omitted basis risk, normality assumptions in tails, and silent fallback mappings.

## Verification
Reconcile positions to source systems, test known hedge portfolios, backtest forecast volatility, and independently recompute representative risk contributions.

## Expected output
A monitored risk view with traceable exposures, scenarios, limitations, and breach evidence.

## Stop conditions
Escalate when positions cannot be reconciled, material instruments are unmapped, or model assumptions fail for the portfolio structure.