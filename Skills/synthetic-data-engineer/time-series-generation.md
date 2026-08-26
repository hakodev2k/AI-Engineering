# Time-Series Generation

## Purpose
Generate synthetic temporal data preserving dynamics, seasonality, event relationships, and boundary conditions.

## When to use
For forecasting, anomaly detection, operations simulation, and temporal test data.

## Inputs
Series definitions, cadence, horizons, covariates, event rules, reference windows, and downstream metrics.

## Context to inspect
Inspect autocorrelation, seasonality, regime changes, missingness, cross-series dependence, and leakage boundaries.

## Core knowledge
Temporal order and conditional dynamics matter more than matching pointwise distributions.

## Procedure
1. Define timestamps, cadence, and timezone semantics.
2. Profile trend, seasonality, autocorrelation, and regimes.
3. Model cross-series and event dependencies.
4. Preserve hard temporal constraints.
5. Generate normal, rare, and transition regimes.
6. Inject anomalies only with explicit labels/rules.
7. Validate spectral/autocorrelation and distribution properties.
8. Test downstream forecasting/anomaly utility on real holdout periods.
9. Check future leakage.
10. Record seeds and horizon assumptions.

## Decision points
Use mechanistic simulation for known dynamics; learned generation when dependencies are complex and reference data is adequate.

## Common failure patterns
Shuffled temporal structure; impossible event order; future leakage; unrealistic anomaly frequency; timezone mistakes.

## Verification
Temporal statistics, constraints, and real-holdout downstream metrics pass thresholds.

## Expected output
Versioned temporal dataset and dynamics/utility validation report.

## Stop conditions
Stop if temporal semantics are ambiguous or reference windows leak evaluation periods.