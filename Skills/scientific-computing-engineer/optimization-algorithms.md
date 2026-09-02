# Optimization Algorithms

## Purpose
Select and operate optimization methods for scientific parameter estimation, design, inverse problems, and constrained numerical objectives.

## When to use
Use when minimizing or maximizing computational objectives, tuning model parameters, solving inverse problems, or diagnosing optimizer stagnation.

## Inputs
Objective function, constraints, variable bounds, gradients/Hessians if available, scaling, noise characteristics, initial guesses, and evaluation cost.

## Context to inspect
Objective smoothness, dimensionality, conditioning, derivative accuracy, parameter identifiability, and existing convergence logs.

## Core knowledge
Optimization behavior depends on smoothness, convexity, scale, constraints, derivative quality, stochastic noise, and initialization. Convergence status does not automatically imply scientifically meaningful parameters.

## Procedure
1. Characterize variables, constraints, and objective structure.
2. Scale variables and residuals appropriately.
3. Verify analytical or automatic derivatives against finite differences where feasible.
4. Select candidate local or global methods.
5. Define stopping criteria based on scientific goals.
6. Test multiple initializations when local minima are possible.
7. Track objective, gradients, feasibility, and step behavior.
8. Evaluate parameter sensitivity and identifiability.
9. Benchmark evaluation and memory cost.
10. Document convergence evidence and remaining uncertainty.

## Decision points
Use gradient-based methods for smooth high-dimensional problems with reliable derivatives; use derivative-free or global methods when objectives are noisy, discontinuous, or multimodal.

## Common failure patterns
Unscaled variables, trusting faulty gradients, declaring success from a status code alone, overfitting noisy data, and confusing non-identifiability with optimizer failure.

## Verification
Check feasibility, gradient norms or equivalent criteria, repeat from alternate starts, and validate optimized parameters on independent or synthetic cases.

## Expected output
A justified optimization configuration, convergence evidence, sensitivity findings, and known limitations.

## Stop conditions
Escalate when the objective is ill-defined, constraints conflict, or the data cannot identify requested parameters.