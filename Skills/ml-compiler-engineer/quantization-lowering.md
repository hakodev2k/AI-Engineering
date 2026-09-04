# Quantization Lowering

## Purpose
Lower quantized ML graphs into backend-supported integer or low-precision operations while preserving quantization semantics, numerical quality, and hardware efficiency.

## When to use
Use when adding PTQ/QAT compiler support, enabling INT8/FP8 paths, legalizing quantized operators, or debugging accuracy regressions after compilation.

## Inputs
Quantized model, scale/zero-point metadata, calibration assumptions, dtype rules, backend quantization capabilities, accuracy thresholds.

## Context to inspect
Inspect per-tensor/per-channel parameters, symmetric/asymmetric schemes, accumulation width, rounding, saturation, requantization, fusion patterns, and unsupported fallbacks.

## Core knowledge
Quantization is a numerical contract. Compiler transformations must preserve scales, zero points, accumulator ranges, rounding, saturation, and calibration assumptions. Backend-native fused quantized kernels may require strict layout and granularity.

## Procedure
1. Identify the quantization scheme and metadata for each tensor.
2. Verify scale/zero-point propagation and axis semantics.
3. Determine legal backend quantized operations.
4. Insert or fold quantize/dequantize/requantize boundaries deliberately.
5. Check accumulator overflow risk and supported widths.
6. Preserve rounding and saturation semantics.
7. Fuse quantized patterns only when parameters are compatible.
8. Provide explicit fallback for unsupported combinations.
9. Compare compiled outputs with quantized reference execution.
10. Measure model-level quality and latency/throughput.
11. Add regression coverage for boundary values and channel-wise cases.

## Decision points
Prefer backend-native integer kernels when accuracy and layout constraints are satisfied. Keep higher precision where sensitive operators or unsupported calibration granularity would cause unacceptable error.

## Common failure patterns
Wrong quantization axis, scale loss during rewrites, accumulator overflow, inconsistent rounding, hidden dequantization destroying performance, and quality checks limited to tensor-level error.

## Verification
Run numerical differential tests, task-level accuracy evaluation, overflow/boundary cases, IR inspection for unnecessary conversions, and backend benchmarks.

## Expected output
A semantically correct quantized lowering path with explicit parameter handling, fallback rules, quality evidence, and performance results.

## Stop conditions
Stop if quantization metadata is incomplete, accepted quality thresholds are undefined, or target arithmetic cannot safely represent required ranges.