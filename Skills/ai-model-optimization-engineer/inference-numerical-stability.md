# Inference Numerical Stability

## Purpose
Detect and control numerical errors introduced by low precision, optimized kernels, compilation, or hardware differences.

## When to use
When changing dtype, kernels, runtime, compiler, accelerator, or model transformations.

## Inputs
Reference outputs, candidate outputs, tensor diagnostics, task metrics, tolerances, problematic samples.

## Preconditions
Have a trusted reference path and deterministic test cases where feasible.

## Context to inspect
Inspect overflow/underflow, NaN/Inf, reductions, normalization, softmax/logits, accumulation precision, sensitive layers, and nondeterministic operators.

## Core knowledge
Small tensor differences can be harmless or amplify through nonlinear/iterative generation. Absolute/relative error alone is insufficient; task-level impact matters.

## Procedure
1. Reproduce candidate/reference on identical inputs.
2. Check NaN/Inf and output invariants.
3. Compare intermediate tensors around divergence.
4. Localize the first materially different operator/layer.
5. Test accumulation and sensitive operations at higher precision.
6. Sweep representative and extreme input ranges.
7. Measure task-level and generation-level effects.
8. Apply mixed precision or stable formulations where needed.
9. Benchmark the corrected path.
10. Add regression cases for discovered instability.

## Decision points
Accept bounded numerical differences when task behavior stays within predefined gates. Preserve higher precision for numerically sensitive operations rather than reverting the whole model.

## Common failure patterns
Bitwise-equivalence requirements without need, tolerances so loose they hide failures, aggregate metrics masking NaNs, and testing only short/easy inputs.

## Verification
No invalid numerics occur across stress cases and reference-vs-candidate differences remain within numerical and task-level gates.

## Expected output
Root-cause evidence, tolerance rationale, precision exceptions, regression tests, and performance impact.

## Stop conditions
Stop if instability could produce unsafe decisions or cannot be localized without unsupported production instrumentation.