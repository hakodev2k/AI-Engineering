# Variational Algorithms

## Purpose
Design and evaluate hybrid variational quantum algorithms with controlled ansatz complexity, optimizer behavior, sampling cost, and noise sensitivity.

## When to use
Use for VQE, QAOA-like, or other parameterized-circuit workflows when near-term hardware is part of the target. Do not assume variational methods are automatically hardware-efficient.

## Inputs
Objective/Hamiltonian, ansatz candidates, parameter count, optimizer options, backend, shot budget, and classical baseline.

## Preconditions
The objective can be evaluated from measurable observables and known-answer instances exist.

## Context to inspect
Barren-plateau risk, parameter initialization, gradient method, measurement grouping, optimizer noise tolerance, symmetry constraints, circuit depth, and backend variance.

## Core knowledge
Variational performance depends jointly on expressivity, trainability, optimizer robustness, shot allocation, and hardware noise. More expressive ansätze can be harder to optimize and execute.

## Procedure
1. Define the objective and classical reference.
2. Select a minimally expressive ansatz consistent with known symmetries.
3. Choose initialization strategy and parameter bounds.
4. Group compatible measurements where valid.
5. Select gradient-free or gradient-based optimization based on noise and cost.
6. Test optimizer behavior in noiseless simulation.
7. Add realistic sampling and noise.
8. Track convergence, variance, circuit calls, and final quality.
9. Compare alternative ansätze and optimizers under equal budgets.
10. Re-run on multiple seeds and problem instances.

## Decision points
Use shallower structured ansätze when hardware fidelity dominates; use richer ansätze only when evidence shows optimization and accuracy benefit. Choose analytic/parameter-shift gradients only when extra evaluations are affordable.

## Common failure patterns
Single-seed conclusions, overparameterization, hidden optimizer budget inflation, ignoring measurement cost, and reporting best iteration instead of robust final behavior.

## Verification
Compare convergence distributions, solution quality, circuit-call count, and uncertainty against classical and simulation baselines.

## Expected output
Ansatz/optimizer rationale, convergence evidence, resource budget, noise sensitivity, and reproducible parameters.

## Stop conditions
Stop when optimization is non-trainable, variance overwhelms signal, or the hybrid loop is dominated by classical alternatives.