# Variational Quantum Algorithms

## Purpose
Design and operate hybrid variational quantum algorithms with stable parameterization, optimization, measurement, and convergence controls.

## When to use
Use for VQE, QAOA-like, classifier, or other parameterized-circuit workflows on noisy devices.

## Inputs
Parameterized ansatz, objective function, optimizer options, backend, shot budget, baseline solution.

## Context to inspect
Parameter count, circuit expressibility, barren-plateau risk, gradient method, measurement grouping, initialization, and noise behavior.

## Core knowledge
Variational performance depends jointly on ansatz inductive bias, landscape conditioning, estimator variance, optimizer robustness, and hardware noise.

## Procedure
1. Define objective and acceptance threshold.
2. Choose an ansatz aligned with problem symmetries and hardware.
3. Minimize unnecessary parameters and depth.
4. Select initialization strategy and deterministic seeds.
5. Estimate objective with confidence intervals.
6. Choose gradient or gradient-free optimization based on noise and cost.
7. Track objective, variance, gradient norms, and evaluation count.
8. Detect plateaus and optimizer instability.
9. Compare multiple restarts against the classical baseline.
10. Preserve the full experiment configuration for replay.

## Decision points
Prefer structured ansatzes over highly expressive generic circuits when they reduce search complexity. Use gradient-free optimizers when gradient noise dominates.

## Common failure patterns
Single-run conclusions, unbounded shot consumption, overparameterization, hidden optimizer defaults, and reporting best sample without uncertainty.

## Verification
Reproduce convergence across seeds and compare final quality, cost, and confidence to baseline.

## Expected output
A reproducible hybrid optimization workflow with convergence and cost evidence.

## Stop conditions
Stop when repeated restarts do not improve materially, gradients vanish persistently, or shot/hardware cost exceeds the experiment budget.