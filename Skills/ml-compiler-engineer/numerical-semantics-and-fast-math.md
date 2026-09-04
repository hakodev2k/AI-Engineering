# Numerical Semantics and Fast Math

## Purpose
Control numerical transformations so compiler optimizations deliver performance without violating required precision, IEEE behavior, or model-quality tolerances.

## When to use
Use when enabling algebraic rewrites, mixed precision, approximate math, reassociation, or investigating compiled-versus-reference numerical drift.

## Inputs
Operator semantics, dtype policy, tolerance requirements, target math capabilities, representative workloads, reference outputs.

## Context to inspect
Inspect NaN/Inf handling, signed zero, overflow/underflow, denormals, rounding, reassociation, reduction order, transcendental approximations, and mixed-precision accumulation.

## Core knowledge
Mathematically equivalent expressions are not always floating-point equivalent. Fast-math flags are semantic permissions and should propagate deliberately. Model-level sensitivity can differ greatly across operators and layers.

## Procedure
1. Define required numerical guarantees for the affected region.
2. Identify transformations that alter rounding, ordering, exceptional values, or precision.
3. Audit fast-math flags and their propagation.
4. Use higher-precision accumulation for sensitive reductions when required.
5. Compare exact, ULP-based, relative/absolute, and task-level tolerances appropriately.
6. Test extreme values, NaN/Inf, zeros, and cancellation cases.
7. Benchmark strict and relaxed variants.
8. Gate approximate rewrites behind explicit policy/capability.
9. Document any quality/performance trade-off.

## Decision points
Use strict semantics for correctness-critical or externally specified behavior. Use relaxed math only when explicitly permitted and validated end-to-end. Prefer local relaxation over global flags when sensitivity varies.

## Common failure patterns
Global fast-math enabling, unstable reductions, tolerance chosen after seeing failures, silent dtype narrowing, and tests containing only typical values.

## Verification
Run differential numerical suites, edge-value tests, model-quality evaluation, and performance comparison under the exact target configuration.

## Expected output
A documented numerical policy or optimization with explicit semantic permissions, tolerances, edge-case coverage, and measured impact.

## Stop conditions
Stop if required numerical guarantees are unknown, quality degradation exceeds limits, or a transformation relies on semantics not explicitly permitted.