# Measurement and Shot Planning

## Purpose
Design measurement strategies and shot budgets that achieve required statistical precision at acceptable execution cost.

## When to use
Use whenever observables, probabilities, tomography, or variational objectives are estimated from samples.

## Inputs
Target observables, confidence requirement, expected variance, grouped measurements, hardware cost and limits.

## Context to inspect
Commuting groups, covariance, rare-event probabilities, readout error, batching limits, and adaptive allocation options.

## Core knowledge
Sampling error scales slowly with shots, so measurement design can dominate total runtime. Grouping and adaptive allocation can reduce cost but may introduce implementation complexity.

## Procedure
1. Define the estimator and required confidence/precision.
2. Estimate variance from simulation or pilot shots.
3. Group compatible observables where valid.
4. Allocate initial shots by expected contribution to total variance.
5. Execute pilot batches and update variance estimates.
6. Reallocate adaptively if permitted.
7. Report confidence intervals, not only point estimates.
8. Separate readout/systematic error from sampling error.

## Decision points
Use uniform allocation for simplicity when variances are similar; use adaptive allocation for expensive heterogeneous terms.

## Common failure patterns
Fixed arbitrary shot counts, no uncertainty reporting, invalid commuting-group assumptions, and interpreting rare samples without enough evidence.

## Verification
Check empirical estimator variance against planned precision and repeat selected measurements.

## Expected output
A justified shot plan with confidence targets and cost estimate.

## Stop conditions
Stop when required precision exceeds practical shot or budget limits.