# Quantization Strategy

## Purpose
Reduce model memory, bandwidth, latency, and cost with controlled numerical precision changes.

## When to use
When inference is memory- or bandwidth-constrained, accelerator low-precision paths are available, or deployment size must shrink.

## Inputs
Model, calibration/evaluation data, hardware, runtime, baseline quality and performance, precision requirements.

## Preconditions
Establish quality gates and a reproducible baseline before quantizing.

## Context to inspect
Inspect operator support, activation distributions, outliers, sensitive layers, KV cache precision, calibration pipeline, and target accelerator capabilities.

## Core knowledge
Weight-only, weight-and-activation, static, dynamic, post-training, and quantization-aware approaches trade implementation effort against quality and speed. Nominal lower precision provides no speedup when kernels or hardware do not support it efficiently.

## Procedure
1. Define target precision and success thresholds.
2. Verify runtime/hardware kernel support.
3. Choose representative calibration data.
4. Start with the least invasive quantization method.
5. Measure layer/operator sensitivity when quality drops.
6. Apply mixed precision or exclusions where justified.
7. Benchmark quality, latency, throughput, memory, and cost.
8. Test long-tail inputs and sequence lengths.
9. Validate serialization and deployment compatibility.
10. Record fallback criteria.

## Decision points
Prefer PTQ when quality remains acceptable; use QAT when calibration cannot recover required accuracy and training resources justify it. Preserve higher precision for sensitive components when mixed precision wins overall.

## Common failure patterns
Tiny calibration sets, unsupported kernels, measuring file size instead of runtime memory, ignoring outliers, accepting aggregate quality while critical slices regress.

## Verification
Compare against baseline on global and critical-slice quality plus production-relevant performance metrics.

## Expected output
Quantized artifact, precision map, benchmark evidence, quality deltas, deployment requirements, and rollback plan.

## Stop conditions
Stop when quality gates fail after justified mitigation, target hardware lacks efficient support, or calibration data is not representative.