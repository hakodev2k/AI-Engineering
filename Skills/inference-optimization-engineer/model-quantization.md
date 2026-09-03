# Model Quantization

## Purpose
Reduce inference memory, bandwidth, latency, and cost by selecting and validating lower-precision weight, activation, and cache representations.

## When to use
Use when model memory limits deployment density, bandwidth dominates execution, or supported hardware offers faster low-precision kernels.

## Inputs
Baseline model, calibration data, evaluation suite, target hardware, runtime support, latency/cost targets, and quality tolerances.

## Context to inspect
Inspect supported dtypes, kernel coverage, sensitive layers, activation outliers, calibration requirements, tensor-parallel compatibility, and downstream numerical assumptions.

## Core knowledge
Quantization is a quality-performance trade-off. Weight-only, weight-activation, static, dynamic, post-training, and quantization-aware methods have different calibration and runtime implications. Nominal bit width does not guarantee speedup if kernels or shapes are unsupported.

## Procedure
1. Record FP baseline quality, latency, throughput, and memory.
2. Select candidate quantization methods supported by target hardware/runtime.
3. Prepare representative calibration data when required.
4. Quantize and verify model loadability.
5. Run task-level and adversarial quality evaluations.
6. Measure memory residency and bandwidth effects.
7. Benchmark latency and throughput on production shapes.
8. Inspect fallback operations that remain high precision.
9. Compare quality loss against cost/performance gain.
10. Document precision policy and rollback artifact.

## Decision points
Prefer weight-only quantization when memory/bandwidth is the main constraint and activation precision is sensitive. Use more aggressive activation quantization only when representative evaluation proves acceptable quality and kernel coverage is strong.

## Common failure patterns
Using non-representative calibration data, reporting model-size reduction as latency gain, ignoring fallback kernels, validating only aggregate accuracy, and changing several optimizations simultaneously.

## Verification
Verified means quality remains within explicit thresholds and production-hardware benchmarks demonstrate measured memory or performance improvement.

## Expected output
Quantized artifact, calibration/evaluation record, benchmark comparison, supported deployment constraints, and rollback plan.

## Stop conditions
Escalate when quality regressions exceed tolerance, hardware kernels are unsupported, or calibration data cannot represent real traffic.