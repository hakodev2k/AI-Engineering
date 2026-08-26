# Mixed Precision and Numerical Stability

## Purpose
Use lower-precision arithmetic to improve GPU performance and capacity while preserving application-level numerical validity.

## When to use
Use for ML/HPC workloads where tensor cores or reduced-precision formats can materially improve throughput or memory footprint.

## Inputs
Numerical tolerances, reference outputs, operation graph, data distributions, GPU capabilities, precision formats, benchmark data.

## Preconditions
Define acceptable error using domain metrics, not bitwise equality unless explicitly required.

## Context to inspect
Inspect reductions, normalization, exponentials, accumulators, condition numbers, dynamic range, loss scaling, casts, library math modes, deterministic requirements, and downstream sensitivity.

## Core knowledge
FP16, BF16, TF32, FP8 and integer formats differ in exponent, mantissa, range, hardware support, and accumulation behavior. Stability depends on algorithm structure as much as datatype. Selective high-precision accumulation often preserves accuracy cheaply.

## Procedure
1. Establish high-precision reference results and domain acceptance metrics.
2. Identify operations eligible for accelerated lower precision.
3. Inspect numerically sensitive reductions and nonlinear operations.
4. Introduce precision changes incrementally.
5. Keep accumulators or critical operations at higher precision where needed.
6. Use scaling/calibration mechanisms appropriate to the workload.
7. Test extreme-value and adversarial numeric cases.
8. Benchmark compute, memory, and end-to-end impact.
9. Check reproducibility requirements.
10. Document precision policy and exceptions.

## Decision points
Choose BF16 over FP16 when range matters more than mantissa precision. Use FP8/int quantization only with calibration and hardware/software support. Preserve FP32 for unstable accumulations when error budgets require it.

## Common failure patterns
Silent overflow/underflow, unstable reductions, comparing only average error, accidental upcasts that erase performance gains, unsupported fast-math assumptions, and accepting benchmark gains without domain validation.

## Verification
Compare domain metrics, worst-case error, NaN/Inf incidence, edge cases, performance, memory footprint, and supported-device behavior.

## Expected output
A documented precision map, validated error envelope, and measured performance/capacity improvement.

## Stop conditions
Stop when no numerical acceptance criterion exists, sensitive outputs exceed tolerance, required hardware paths are unavailable, or lower precision introduces nondeterministic failures that violate requirements.