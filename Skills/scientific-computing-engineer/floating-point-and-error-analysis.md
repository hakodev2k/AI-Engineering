# Floating-Point and Error Analysis

## Purpose
Reason about rounding, cancellation, overflow, underflow, conditioning, and propagated numerical error so scientific results remain trustworthy.

## When to use
Use when results differ across platforms, tolerances are unclear, cancellation is suspected, values span extreme magnitudes, or validation fails near precision limits.

## Inputs
Algorithms, numeric ranges, precision types, tolerance requirements, compiler options, hardware behavior, and reference calculations.

## Preconditions
Separate modeling error, discretization error, solver error, and floating-point error where possible.

## Context to inspect
Data ranges, normalization, reduction order, transcendental functions, casts, fused operations, fast-math flags, and platform-specific math libraries.

## Core knowledge
Floating-point arithmetic is finite, non-associative, and scale-sensitive. Backward stability, condition numbers, ulps, machine epsilon, catastrophic cancellation, and compensated algorithms are practical tools for evaluating risk.

## Procedure
1. Identify numerically sensitive operations.
2. Estimate input and intermediate value ranges.
3. Inspect subtraction of nearly equal values and long reductions.
4. Assess problem conditioning independently from algorithm stability.
5. Compare precision levels on targeted cases.
6. Use scaling or reformulation where it reduces sensitivity.
7. Apply compensated summation or stable identities where justified.
8. Define absolute, relative, or mixed tolerances from domain needs.
9. Test edge magnitudes, signed zero, infinities, and NaNs where relevant.
10. Document precision assumptions and accepted error bounds.

## Decision points
Increase precision only when analysis shows it addresses the dominant error; reformulate unstable computations before paying global precision costs.

## Common failure patterns
Exact equality checks, one tolerance for all scales, silent fast-math changes, assuming double precision guarantees correctness, and confusing ill-conditioning with implementation bugs.

## Verification
Compare against higher-precision or analytical references, perform perturbation tests, and confirm error remains within documented bounds across supported platforms.

## Expected output
An error analysis with identified sensitivities, tolerance rules, mitigation choices, and verification evidence.

## Stop conditions
Stop when required accuracy exceeds feasible precision or when domain owners cannot define acceptable error.