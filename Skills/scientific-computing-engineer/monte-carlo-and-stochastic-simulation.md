# Monte Carlo and Stochastic Simulation

## Purpose
Design reliable stochastic simulations with controlled randomness, statistically meaningful estimates, and reproducible execution.

## When to use
Use for uncertainty propagation, probabilistic models, particle methods, sampling-based integration, reliability analysis, or simulation studies involving randomness.

## Inputs
Probability model, target estimands, random distributions, confidence requirements, sample budget, random-number generator constraints, and parallel execution model.

## Context to inspect
Seed handling, generator choice, sampling strategy, variance-reduction methods, convergence diagnostics, parallel stream management, and output aggregation.

## Core knowledge
Monte Carlo error decreases slowly with sample count. Independent random streams, estimator variance, confidence intervals, burn-in, autocorrelation, and bias matter more than raw sample volume.

## Procedure
1. Define the estimator and required uncertainty bound.
2. Validate probability distributions and parameterization.
3. Choose a suitable RNG and seed policy.
4. Design independent streams for parallel runs.
5. Apply stratification, importance sampling, control variates, or other variance reduction when justified.
6. Run pilot samples to estimate variance.
7. Determine sample size from accuracy requirements.
8. Track convergence and statistical diagnostics.
9. Repeat selected runs with controlled seeds.
10. Report estimates with uncertainty, not only point values.

## Decision points
Use quasi-Monte Carlo for smooth integration problems when deterministic low-discrepancy sequences help; use MCMC only when direct sampling is impractical and diagnostics are available.

## Common failure patterns
Seed collisions, correlated parallel streams, reporting too many significant digits, insufficient burn-in, ignoring autocorrelation, and cherry-picking favorable runs.

## Verification
Reproduce seeded runs, compare moments against known distributions, inspect confidence-interval coverage on synthetic cases, and verify parallel stream independence assumptions.

## Expected output
A reproducible stochastic experiment with estimator definition, uncertainty bounds, RNG policy, diagnostics, and limitations.

## Stop conditions
Stop when the probability model is not well defined or required confidence cannot be achieved within resource constraints.