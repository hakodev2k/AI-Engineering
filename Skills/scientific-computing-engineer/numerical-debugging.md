# Numerical Debugging

## Purpose
Diagnose incorrect, unstable, divergent, non-reproducible, or physically implausible numerical results using evidence rather than parameter guessing.

## When to use
Use when NaNs appear, solvers diverge, conservation fails, outputs differ across platforms, convergence regresses, or results contradict known physics.

## Inputs
Failing case, logs, solver diagnostics, source code, inputs, tolerances, platform/build details, reference results, and recent changes.

## Context to inspect
Initialization, units, boundary conditions, indexing, array bounds, scaling, convergence tests, precision, reduction order, compiler flags, parallel races, and library versions.

## Core knowledge
Numerical failures often emerge far from their root cause. A Senior investigation separates model, discretization, algorithm, implementation, floating-point, and concurrency failures while preserving the smallest reproducible case.

## Procedure
1. Freeze the failing inputs and environment.
2. Reproduce deterministically where possible.
3. Identify the earliest quantity that becomes invalid or diverges from a reference.
4. Reduce the problem size while preserving the failure.
5. Add checks for units, bounds, invariants, conservation, and finite values.
6. Compare debug/release and serial/parallel execution.
7. Compare precision levels and compiler optimization settings selectively.
8. Inspect solver residual histories and stopping logic.
9. Differentially compare against a trusted implementation or simplified model.
10. Test the root-cause hypothesis with one controlled change.
11. Add a regression test reproducing the failure.
12. Document causal chain and prevention measures.

## Decision points
Investigate algorithm/model correctness before increasing tolerances. Disable parallelism or aggressive math optimizations temporarily when they help isolate the fault, not as permanent fixes without justification.

## Common failure patterns
Random parameter tuning, increasing iteration limits indefinitely, suppressing NaNs, debugging only final outputs, and assuming cross-platform differences are harmless.

## Verification
Demonstrate the original failure before the fix, show the causal mechanism, pass the regression case, and confirm no unacceptable change to validated scientific outputs or performance.

## Expected output
A root-cause report, minimal reproducer, verified fix, regression protection, and any remaining numerical risks.

## Stop conditions
Escalate when reproduction requires unavailable hardware/data, the mathematical requirements are contradictory, or evidence indicates an external library defect requiring upstream action.