# Model Quantization

## Purpose
Reduce inference memory, bandwidth, and compute cost by lowering numerical precision while preserving acceptable model quality.

## When to use
Use when model size, memory bandwidth, latency, or serving cost is a bottleneck and the target runtime supports lower precision.

## Inputs
Reference model, representative calibration/evaluation data, target hardware, runtime support matrix, quality thresholds, and performance baseline.

## Preconditions
A stable reference model and measurable quality criteria must exist.

## Context to inspect
Inspect current precision, layer sensitivity, activation ranges, outliers, operator support, KV-cache precision, kernel availability, and deployment constraints.

## Core knowledge
Quantization can target weights, activations, and cache state. Post-training quantization is simpler; quantization-aware training can recover quality when lower precision is aggressive. Hardware support determines whether theoretical compression becomes real speedup.

## Procedure
1. Define acceptable quality loss and target memory/performance gain.
2. Confirm hardware and runtime support for candidate precisions.
3. Select representative calibration data.
4. Start with the least aggressive precision reduction likely to meet goals.
5. Quantize weights and, when supported, activations or cache state.
6. Benchmark memory, throughput, and latency.
7. Evaluate quality on representative and edge-case sets.
8. Inspect sensitive layers and outlier channels if quality drops.
9. Apply mixed precision or selective exemptions where needed.
10. Re-run production-shaped benchmarks.
11. Document the chosen format, calibration procedure, and quality delta.

## Decision points
Prefer post-training methods when quality holds. Use mixed precision when a small subset of layers dominates degradation. Consider quantization-aware training only when simpler methods fail and retraining cost is justified.

## Common failure patterns
Using unrepresentative calibration data, assuming smaller models are automatically faster, ignoring unsupported kernels, comparing against a different decoding configuration, and accepting aggregate quality while critical task slices regress.

## Verification
Confirm memory reduction, latency/throughput improvement, and quality within thresholds on the same benchmark harness used for the baseline.

## Expected output
A deployable quantized model artifact plus measured quality and performance evidence.

## Stop conditions
Stop when target hardware lacks efficient kernels, quality loss exceeds agreed thresholds, calibration data is inadequate, or the artifact cannot be validated end to end.