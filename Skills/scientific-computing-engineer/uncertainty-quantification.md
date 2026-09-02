# Uncertainty Quantification

## Purpose
Quantify how uncertain inputs, parameters, models, and measurements affect scientific outputs and decisions.

## When to use
Use for risk-sensitive predictions, model calibration, sensitivity studies, experiment planning, or when deterministic outputs hide material uncertainty.

## Inputs
Input distributions or ranges, model, quantities of interest, calibration data, computational budget, and decision thresholds.

## Context to inspect
Parameter provenance, correlations, structural model assumptions, sampling methods, surrogate models, and previous sensitivity results.

## Core knowledge
Aleatoric variability and epistemic uncertainty have different interpretations and mitigation strategies. Correlated inputs, nonlinear responses, rare events, and model discrepancy can dominate output uncertainty.

## Procedure
1. Define quantities of interest and decision context.
2. Classify uncertainty sources.
3. Assign justified ranges/distributions and correlations.
4. Perform screening or sensitivity analysis.
5. Select propagation method: sampling, polynomial/spectral methods, linearization, or surrogate-based methods.
6. Allocate computational budget based on dominant uncertainty sources.
7. Quantify output distributions and confidence/credible intervals as appropriate.
8. Separate numerical error from input/model uncertainty.
9. Validate uncertainty predictions against held-out observations where possible.
10. Report assumptions and dominant contributors.

## Decision points
Use local sensitivity for near-linear regimes and screening; use global methods when interactions or nonlinearities matter. Use surrogates only after validating approximation error.

## Common failure patterns
Assuming independent inputs without evidence, assigning distributions for convenience, ignoring model discrepancy, and reporting narrow intervals from under-sampled tails.

## Verification
Repeat with alternative sampling or surrogate settings, check convergence of statistics, and validate known synthetic cases.

## Expected output
An uncertainty budget, sensitivity ranking, propagated output uncertainty, and assumptions.

## Stop conditions
Stop when critical input uncertainty cannot be characterized well enough to support the requested inference.