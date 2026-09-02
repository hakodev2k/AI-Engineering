# Interpolation and Quadrature

## Purpose
Choose and validate interpolation, approximation, and numerical integration methods while controlling error, smoothness assumptions, and extrapolation risk.

## When to use
Use for resampling fields, reconstructing tabulated data, integrating functions or datasets, coupling grids, or post-processing simulation outputs.

## Inputs
Sample locations, data values, dimensionality, smoothness information, integration domain, desired accuracy, and computational budget.

## Context to inspect
Sampling density, discontinuities, monotonicity, boundary behavior, coordinate transforms, missing regions, and existing interpolation/integration libraries.

## Core knowledge
Higher-order methods are not automatically better: oscillation, Runge phenomena, discontinuities, irregular grids, and extrapolation can dominate error. Quadrature should exploit known smoothness and geometry while respecting singularities and sharp features.

## Procedure
1. Characterize sample geometry and function regularity.
2. Identify monotonicity, positivity, conservation, or boundedness requirements.
3. Select candidate interpolation or quadrature families.
4. Define behavior outside the sampled domain.
5. Test on analytical or synthetic functions with similar regularity.
6. Measure convergence under increased sampling/order.
7. Check conservation or integral consistency where material.
8. Evaluate computational and memory cost.
9. Validate edge and discontinuity behavior.
10. Document assumptions and error estimates.

## Decision points
Prefer shape-preserving methods when overshoot is unacceptable; prefer spectral/high-order methods for smooth functions; use adaptive quadrature around localized difficulty.

## Common failure patterns
Uncontrolled extrapolation, high-order oscillations, ignoring coordinate Jacobians, interpolation across discontinuities, and validating only interior points.

## Verification
Compare against known integrals/functions, perform refinement studies, and check domain-specific invariants.

## Expected output
A selected method with error evidence, boundary/extrapolation policy, and applicability limits.

## Stop conditions
Escalate when sampling is too sparse or irregular to support the requested accuracy.