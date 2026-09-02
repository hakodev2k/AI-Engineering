# Numerical Method Selection

## Purpose
Select numerical algorithms whose accuracy, stability, complexity, and implementation characteristics fit the scientific problem and hardware constraints.

## When to use
Use when choosing solvers, discretizations, interpolation, optimization, integration, or approximation methods; when an existing method is unstable or too slow; or when requirements change materially.

## Inputs
Mathematical formulation, data scale, conditioning information, tolerance requirements, runtime and memory budgets, hardware, and reference results if available.

## Preconditions
Define the physical or mathematical quantity of interest and the acceptable error metric before comparing methods.

## Context to inspect
Existing equations, units, boundary conditions, data distributions, library dependencies, precision settings, benchmarks, and validation datasets.

## Core knowledge
A numerically elegant method can be operationally poor if it is unstable, ill-conditioned, memory-heavy, hard to parallelize, or mismatched to the problem structure. Method choice must consider convergence rate, stability region, conditioning, sparsity, smoothness, stiffness, dimensionality, and reproducibility.

## Procedure
1. Characterize the mathematical problem class.
2. Identify structural properties such as sparsity, symmetry, smoothness, stiffness, and constraints.
3. Define accuracy and convergence requirements.
4. Identify candidate methods supported by trusted libraries when practical.
5. Compare asymptotic and practical runtime/memory costs.
6. Analyze stability and conditioning sensitivity.
7. Prototype candidates on representative and adversarial cases.
8. Compare against analytical or high-accuracy references.
9. Measure scaling and hardware behavior.
10. Document the chosen method, assumptions, and rejected alternatives.

## Decision points
Prefer direct methods for smaller well-structured problems when robustness dominates; prefer iterative methods for large sparse systems when memory and scalability matter. Use adaptive methods when problem difficulty varies substantially across the domain.

## Common failure patterns
Choosing by popularity, ignoring conditioning, using default tolerances blindly, validating only easy cases, and benchmarking on non-representative sizes.

## Verification
Demonstrate convergence, sensitivity, accuracy against references, and resource use across representative problem sizes.

## Expected output
A justified method choice with numerical assumptions, tolerance policy, performance evidence, and fallback strategy.

## Stop conditions
Escalate when the mathematical model is underspecified, validation truth is unavailable for critical outputs, or numerical error cannot be separated from model error.