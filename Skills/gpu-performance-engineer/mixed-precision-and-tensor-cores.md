# Mixed Precision and Tensor Cores

## Purpose
Use reduced precision and specialized matrix hardware to improve throughput while preserving numerical quality and application correctness.

## When to use
Use when matrix-heavy or AI workloads are compute-bound, target GPUs provide Tensor Cores or equivalent acceleration, and numerical tolerances permit lower precision.

## Inputs
- Workload operator mix and shapes
- Baseline precision and accuracy metrics
- Hardware architecture
- Numerical range and stability requirements
- Framework/library configuration

## Context to inspect
Inspect FP32/TF32/FP16/BF16/FP8 or relevant formats, accumulation precision, alignment and shape constraints, loss scaling, casting overhead, fallback kernels, and sensitive operations.

## Core knowledge
Reduced precision can increase math throughput and lower memory traffic, but benefits depend on hardware paths and operator eligibility. Accumulation precision and numerically sensitive reductions often determine whether an optimization is safe.

## Procedure
1. Define acceptable numerical error or model-quality thresholds.
2. Profile operator mix and identify compute-heavy candidates.
3. Verify Tensor Core eligibility and actual generated kernels.
4. Introduce lower precision selectively rather than globally.
5. Preserve higher precision for sensitive accumulations or normalization when needed.
6. Measure casting and format-conversion overhead.
7. Validate shape/alignment constraints and batching effects.
8. Compare latency, throughput, memory use, and output quality.
9. Stress extreme-value and long-sequence/input cases.
10. Document precision policy and supported hardware paths.

## Decision points
Prefer BF16 over FP16 when dynamic range is important and hardware supports it. Use FP8 only with explicit calibration/scaling and strong quality validation. Retain FP32 for numerically sensitive regions when performance impact is minor.

## Common failure patterns
- Assuming a lower dtype guarantees Tensor Core use
- Silent fallback to slower kernels
- Global precision changes that destabilize sensitive operations
- Ignoring cast overhead
- Validating only average model quality

## Verification
Verify specialized hardware utilization, measured end-to-end speedup, memory improvement where expected, and output quality across representative and edge-case data.

## Expected output
A precision policy with eligible operations, numerical safeguards, before/after performance, quality evidence, and hardware constraints.

## Stop conditions
Stop when quality thresholds cannot be met, hardware does not provide the expected accelerated path, or numerical risk lacks domain approval.