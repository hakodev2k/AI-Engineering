# Inference Optimization and Quantization

## Purpose
Reduce vision inference latency, memory, bandwidth, and cost while preserving task quality and numerical behavior required in production.

## When to use
Use when a trained model misses latency, throughput, memory, power, or serving-cost targets, or when moving to a new runtime/hardware target.

## Inputs
Validated model, representative calibration/evaluation data, target hardware/runtime, latency and memory SLOs, concurrency profile, and accuracy guardrails.

## Preconditions
A correct unoptimized reference implementation and target-hardware benchmark exist.

## Context to inspect
Inspect preprocessing, tensor shapes, dynamic dimensions, unsupported operators, CPU-GPU transfers, post-processing, batch patterns, precision support, memory allocation, and runtime kernels.

## Core knowledge
Optimization options include graph simplification, operator fusion, compilation, mixed precision, FP16/BF16, INT8 quantization, pruning, distillation, input resizing, batching, and pipeline concurrency. End-to-end latency matters more than isolated model timing.

## Procedure
1. Benchmark preprocessing, model execution, transfers, and post-processing separately.
2. Confirm representative batch/concurrency and warmup conditions.
3. Export the model and verify numerical parity before optimization.
4. Profile the target runtime to identify actual bottlenecks.
5. Apply low-risk graph/runtime optimizations first.
6. Test reduced precision supported natively by target hardware.
7. For INT8, build representative calibration data and compare PTQ before considering QAT.
8. Measure overall and critical-slice quality after each change.
9. Benchmark p50/p95/p99 latency, throughput, peak memory, and power where relevant.
10. Test cold start, dynamic shapes, and concurrency limits.
11. Preserve the unoptimized artifact and rollback path.
12. Document model/runtime/hardware compatibility as one release unit.

## Decision points
Use FP16/BF16 when hardware supports it and quality is stable. Use INT8 when further gains justify calibration and possible QAT complexity. Distill when architecture size itself is the constraint rather than runtime overhead.

## Common failure patterns
Benchmarking only warm single requests, calibrating on unrepresentative images, measuring model latency while preprocessing dominates, silent operator fallback to CPU, and accepting aggregate quality while rare classes regress.

## Verification
Verify reference-versus-optimized output tolerance, held-out and slice metrics, target-hardware tail latency, memory, concurrency, and exported-runtime stability.

## Expected output
An optimized artifact with benchmark evidence, quality deltas, runtime requirements, and rollback baseline.

## Stop conditions
Stop if optimization violates quality guardrails, target runtime silently changes semantics, representative calibration data is unavailable, or required hardware features are unsupported.