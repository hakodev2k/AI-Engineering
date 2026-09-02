# Variational Quantum Algorithms

## Purpose
Design and operate hybrid variational algorithms with disciplined ansatz selection, optimizer control, noise awareness, and convergence evidence.

## When to use
Use for VQE, QAOA, variational classifiers, and other parameterized-circuit workflows where classical optimization drives repeated quantum evaluations.

## Inputs
Objective function, Hamiltonian or cost operator, ansatz, parameter bounds, optimizer options, backend, shot budget, and baseline results.

## Context to inspect
Parameter initialization, circuit depth, gradient method, optimizer state, measurement grouping, noise level, and classical baseline.

## Core knowledge
Variational performance depends on expressibility, trainability, measurement cost, optimizer behavior, and noise. Barren plateaus, shot noise, local minima, and optimizer instability are distinct failure modes.

## Procedure
1. Define the objective and classical baseline.
2. Choose the smallest ansatz that can represent useful solutions.
3. Establish reproducible parameter initialization.
4. Group commuting measurements where safe.
5. Select gradient-based or gradient-free optimization based on noise and parameter count.
6. Run noiseless small-instance tests.
7. Track objective, gradient, variance, and evaluation count.
8. Test multiple initializations.
9. Add hardware noise and mitigation only after semantic validation.
10. Compare solution quality against compute and shot cost.

## Decision points
Increase ansatz depth only when evidence shows under-capacity. Prefer gradient-free methods under severe stochastic noise; prefer analytic or parameter-shift gradients when stable and affordable.

## Common failure patterns
Using an overexpressive ansatz, declaring convergence from one initialization, ignoring measurement cost, comparing against weak baselines, and tuning directly on noisy hardware without a simulator reference.

## Verification
Reproduce convergence across runs, compare to known optima for small cases, inspect parameter sensitivity, and report confidence intervals and total quantum evaluations.

## Expected output
A validated variational workflow with ansatz rationale, optimizer settings, convergence evidence, and resource accounting.

## Stop conditions
Stop when optimization is untrainable, measurement cost is prohibitive, or the classical baseline dominates under realistic resource assumptions.