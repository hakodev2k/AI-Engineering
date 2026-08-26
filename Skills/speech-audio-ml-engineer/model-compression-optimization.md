# Speech Model Compression and Optimization

## Purpose
Reduce speech-model latency, memory, and cost while preserving required quality.

## When to use
Use for edge deployment, high-volume serving, mobile inference, or cost reduction.

## Inputs
Trained model, representative calibration/evaluation data, target hardware, quality and latency budgets.

## Context to inspect
Inspect operator support, memory bandwidth, hotspots, precision, sequence lengths, batching, and deployment runtime.

## Core knowledge
Quantization, pruning, distillation, graph optimization, kernel selection, and architecture changes trade accuracy against hardware efficiency. Parameter count is not a latency metric.

## Procedure
1. Benchmark unoptimized model on target hardware.
2. Profile compute and memory hotspots.
3. Set maximum acceptable quality regression.
4. Apply lowest-risk runtime/graph optimizations first.
5. Evaluate mixed precision or quantization.
6. Use distillation/pruning only when needed.
7. Re-profile after each material change.
8. Validate representative and edge cohorts.

## Decision points
Prefer post-training quantization when accuracy holds; use quantization-aware training when calibration is insufficient. Optimize architecture when kernels remain the bottleneck.

## Common failure patterns
Benchmarking on wrong hardware, unsupported operators, calibration mismatch, aggregate quality hiding rare-speech regressions, and smaller models running slower.

## Verification
Measure target-device latency, throughput, memory, energy/cost where relevant, and frozen-set quality.

## Expected output
A deployable optimized model with before/after evidence.

## Stop conditions
Stop when quality regression exceeds budget or runtime changes cannot be validated on target hardware.