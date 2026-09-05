# Quantized Inference Deployment

## Purpose
Deploy quantized models safely to reduce memory, latency, and cost while protecting task quality and numerical stability.

## When to use
Use when full-precision serving is too expensive, memory-bound, or unable to meet throughput targets.

## Inputs
Baseline model, candidate quantization method, calibration data, target hardware/runtime, quality metrics, latency and cost targets.

## Preconditions
A trusted full-precision baseline and representative evaluation set exist.

## Context to inspect
Supported numeric formats, kernel availability, calibration method, per-channel/group settings, KV-cache precision, model export path, and fallback strategy.

## Core knowledge
Quantization gains depend on hardware kernels and workload. Lower bit width can reduce memory bandwidth pressure but may degrade sensitive layers, long-context behavior, tool calling, or structured outputs.

## Procedure
1. Establish baseline quality and performance.
2. Choose supported quantization candidates.
3. Calibrate with representative data when required.
4. Validate model load and operator coverage.
5. Run task, safety, and long-context evaluations.
6. Benchmark latency, throughput, memory, and power/cost.
7. Compare degradation against agreed tolerances.
8. Canary the quantized model with rollback ready.
9. Monitor segment-level quality after release.

## Decision points
Prefer the lowest precision that meets quality requirements; use mixed precision when a small subset of layers drives degradation.

## Common failure patterns
Testing only perplexity, using unrepresentative calibration data, assuming theoretical memory savings become latency gains, and ignoring unsupported kernels.

## Verification
Verify quality parity within tolerance and measured serving improvements on target hardware.

## Expected output
A deployment decision with quality deltas, performance gains, configuration, and rollback criteria.

## Stop conditions
Do not release when degradation affects critical behavior, safety, or contractual quality requirements.