# Linear Algebra Solvers

## Purpose
Choose, configure, and validate dense or sparse linear algebra solvers for scientific workloads.

## When to use
Use for linear systems, eigenproblems, least-squares problems, factorizations, or when solver performance or convergence is problematic.

## Inputs
Matrix properties, dimensions, sparsity pattern, conditioning, right-hand sides, tolerance, hardware, and library options.

## Context to inspect
Matrix assembly, symmetry, definiteness, storage format, preconditioners, parallelism, and existing benchmarks.

## Core knowledge
Solver choice depends on structure. Direct methods offer robustness but can be memory-heavy; iterative methods scale better for large sparse systems but require convergence control and often preconditioning.

## Procedure
1. Characterize size, sparsity, symmetry, definiteness, and conditioning.
2. Select candidate direct or iterative solvers.
3. Choose storage format compatible with access patterns.
4. Select or design a preconditioner when needed.
5. Define residual and solution-error criteria.
6. Benchmark representative matrices.
7. Check sensitivity to ordering and scaling.
8. Validate convergence and failure behavior.
9. Measure memory and parallel scaling.
10. Record solver configuration and assumptions.

## Decision points
Prefer specialized solvers that exploit verified matrix structure. Use iterative methods only with explicit convergence diagnostics and fallback behavior.

## Common failure patterns
Assuming symmetry that is not guaranteed, poor scaling, weak preconditioning, using residual alone as proof of accuracy, and ignoring fill-in.

## Verification
Check residuals, compare selected cases with trusted references, test ill-conditioned examples, and measure memory/runtime at production sizes.

## Expected output
A solver configuration with structural assumptions, convergence criteria, performance evidence, and fallback strategy.

## Stop conditions
Escalate when matrix properties are unknown or convergence cannot be demonstrated within required resource limits.