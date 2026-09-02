# Model Quantization and Compression

## Purpose
Reduce edge-model compute, memory, storage, and bandwidth costs while preserving required quality and runtime compatibility.

## When to use
Use when models exceed device budgets, accelerators favor lower precision, download size matters, or sustained inference cannot meet latency or power targets.

## Inputs
Trained model, calibration/evaluation datasets, target hardware, runtime/toolchain, quality thresholds, and resource budgets.

## Preconditions
A trusted floating-point baseline and repeatable device benchmark must exist.

## Context to inspect
Supported precisions, quantizable operators, activation distributions, calibration pipeline, per-channel/per-tensor options, mixed-precision support, and fallback behavior.

## Core knowledge
Post-training quantization is operationally cheaper but may degrade sensitive models; quantization-aware training can recover quality at higher engineering cost. Compression succeeds only when the exported graph actually executes in the intended precision on target hardware.

## Procedure
1. Measure the baseline model on representative hardware and data.
2. Identify the dominant resource constraint: storage, memory, latency, bandwidth, or energy.
3. Confirm accelerator/runtime precision support.
4. Build a representative calibration set covering difficult operating conditions.
5. Apply the least invasive compression method first.
6. Inspect unsupported operators and precision fallbacks.
7. Compare global and class/subgroup quality, not only aggregate accuracy.
8. Profile latency, peak memory, binary size, and sustained thermals.
9. Use mixed precision for sensitive layers when supported and justified.
10. Escalate to quantization-aware training only when post-training methods miss quality targets.
11. Version calibration data and conversion settings for reproducibility.

## Decision points
Prefer INT8 or hardware-native low precision when accelerator support is mature. Use FP16/BF16 where conversion risk is lower and memory reduction is sufficient. Avoid exotic compression if operational tooling cannot validate it.

## Common failure patterns
Unrepresentative calibration data, silent dequantize/requantize overhead, CPU fallback, checking model size without latency, and accepting average quality while rare safety-relevant cases regress.

## Verification
Compare baseline and compressed artifacts on target devices using identical inputs; verify numerical tolerance, quality thresholds, operator placement, latency percentiles, memory, and power behavior.

## Expected output
A reproducible compressed model artifact with measured quality/resource trade-offs and documented conversion settings.

## Stop conditions
Stop when quality degradation violates requirements, the runtime executes key operators outside the intended accelerator, or calibration coverage is inadequate.