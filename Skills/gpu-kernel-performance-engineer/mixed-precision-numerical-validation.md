# Mixed Precision and Numerical Validation

## Purpose
Use reduced precision safely to improve GPU throughput and memory efficiency while preserving application-level numerical requirements.

## When to use
Use when evaluating FP16, BF16, TF32, FP8, integer, or mixed-precision execution, especially for matrix-heavy or bandwidth-bound kernels.

## Inputs
Reference implementation, input distributions, numerical tolerances, target data types, accumulation rules, representative workloads, profiler throughput and conversion metrics.

## Preconditions
Define acceptable absolute/relative error, stability requirements, overflow/underflow behavior, and whether reproducibility is required.

## Context to inspect
Inspect value ranges, conditioning, reduction length, normalization, accumulation type, conversion points, denormal handling, saturation, scaling, and error propagation across downstream stages.

## Core knowledge
Reduced precision changes dynamic range, mantissa precision, rounding, and sometimes instruction semantics. Accumulating in a wider type often preserves accuracy at modest cost. Performance gains disappear when conversions, rescaling, or fallback paths dominate.

## Procedure
1. Establish a high-precision reference and representative test corpus.
2. Measure value ranges and identify numerically sensitive operations.
3. Select candidate storage and compute precisions per operation.
4. Keep accumulators wider where long reductions amplify rounding error.
5. Add scaling only when required to avoid overflow or underflow.
6. Minimize redundant type conversions in hot loops.
7. Validate error distributions, not only a few examples.
8. Benchmark end-to-end runtime and memory traffic.
9. Stress adversarial magnitudes and edge cases.
10. Document the numerical contract and fallback conditions.

## Decision points
Prefer BF16 over FP16 when range matters more than mantissa precision and hardware supports it. Use FP8 or integer modes only with validated scaling/quantization strategy. Retain full precision for unstable transforms or control-sensitive calculations.

## Common failure patterns
Comparing outputs with exact equality; validating only random normal inputs; reducing precision in accumulators blindly; inserting conversions around every operation; ignoring overflow on rare production values; claiming speedup from theoretical throughput alone.

## Verification
Confirm numerical acceptance criteria across representative and adversarial datasets, intended low-precision instructions are emitted, end-to-end runtime improves, and no new NaN/Inf instability appears.

## Expected output
A per-operation precision strategy with quantified error, performance evidence, and explicit safety boundaries.

## Stop conditions
Escalate when numerical requirements are unspecified, reduced precision violates stability or regulatory constraints, or hardware behavior cannot be reproduced consistently.