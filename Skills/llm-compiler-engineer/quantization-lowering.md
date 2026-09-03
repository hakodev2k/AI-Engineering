# Quantization Lowering

## Purpose
Lower quantized LLM graphs into target-specific integer or low-precision execution while preserving scale semantics, accuracy, packing, and backend compatibility.

## When to use
Use when supporting INT8, INT4, FP8, mixed precision, weight-only quantization, activation quantization, or new quantized kernels.

## Inputs
- Quantized model graph
- Scale/zero-point metadata
- Calibration assumptions
- Target kernel formats
- Accuracy tolerances

## Preconditions
Identify the exact quantization scheme: per-tensor, per-channel, per-group, symmetric/asymmetric, static/dynamic, weight-only or activation-aware.

## Context to inspect
Inspect quantize/dequantize placement, packed weights, accumulator dtype, rounding, saturation, scale propagation, bias handling, residual paths, and backend kernel constraints.

## Core knowledge
Quantization lowering is not merely dtype conversion. Correctness depends on scale domains, accumulator range, rounding behavior, clipping, zero points, layout/packing, and where dequantization occurs. Fusion can eliminate Q/DQ overhead but must preserve numerical semantics.

## Procedure
1. Record quantization scheme and metadata for every tensor.
2. Verify scale shapes and axis/group semantics.
3. Map quantized operators to backend kernels or legal decompositions.
4. Propagate compatible scale domains through fusible operations.
5. Choose accumulator and output dtypes safely.
6. Handle bias and residual additions in a compatible domain.
7. Pack weights according to backend alignment/layout rules.
8. Preserve exact rounding/saturation semantics.
9. Compare against a trusted quantized reference.
10. Measure model accuracy, latency, bandwidth, and memory.

## Decision points
Use fused quantized kernels when accuracy and shape support are proven. Fall back to higher precision for numerically sensitive or unsupported operations. Prefer weight-only quantization when activation calibration or accuracy risk is unacceptable.

## Common failure patterns
- Losing per-channel/group scale axes.
- Overflowing accumulators.
- Incorrect zero-point arithmetic.
- Reordering packed data incorrectly.
- Measuring kernel speed while ignoring Q/DQ conversions.

## Verification
Implemented means quantized code executes. Verified means tensor-level comparisons meet tolerance, end-task accuracy stays within budget, packed weights decode correctly, and performance gains hold end to end.

## Expected output
A quantization lowering path with explicit scheme support, fallbacks, numerical tests, and performance evidence.

## Stop conditions
Stop when quantization metadata is incomplete, reference semantics are unknown, or the target kernel requires an incompatible packing or scale scheme.