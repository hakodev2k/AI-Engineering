# Portfolio Construction

## Purpose
Translate forecasts into implementable positions while balancing expected return, risk, costs, constraints, and model uncertainty.

## When to use
Use when converting signals into weights or reviewing unstable or concentrated allocations.

## Inputs
Forecasts, covariance/risk model, current holdings, cost model, capital, constraints, and benchmark.

## Preconditions
Clarify objective, rebalance horizon, permitted instruments, leverage, and hard versus soft constraints.

## Context to inspect
Signal scaling, covariance estimation, turnover, exposure limits, optimizer settings, and live portfolio behavior.

## Core knowledge
Optimization amplifies estimation error. Constraints and regularization often matter more than optimizer sophistication. Portfolio decisions must account for current holdings and trading costs.

## Procedure
1. Normalize forecasts into comparable expected-return units.
2. Validate risk inputs and exposure definitions.
3. Specify objective and constraints explicitly.
4. Include current holdings and transaction costs.
5. Add regularization or robust bounds where estimates are noisy.
6. Solve and inspect binding constraints.
7. Stress forecasts, covariance, and costs.
8. Compare with simple benchmark allocations.
9. Decompose expected return, risk, turnover, and factor exposures.
10. Define fallback behavior if optimization fails.

## Decision points
Prefer closed-form or simple constrained approaches when transparency is valuable; use complex nonlinear optimization only for genuine nonlinear economics. Hard constraints protect mandates; soft penalties improve graceful trade-offs.

## Common failure patterns
Unstable inverse covariance, hidden leverage, concentration from correlated signals, infeasible constraints, excessive turnover, and treating optimizer output as unquestionable.

## Verification
Perturb inputs and confirm allocations remain economically sensible; reconcile all limits and compare ex-ante versus realized risk.

## Expected output
An auditable allocation process with diagnostics, constraint evidence, and fallback logic.

## Stop conditions
Stop on infeasible mandates, missing risk inputs, materially stale holdings, or unresolved exposure definitions.