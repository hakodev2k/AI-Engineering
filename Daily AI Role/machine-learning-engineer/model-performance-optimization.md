# Model Performance Optimization

## Purpose
Reduce inference latency, memory or cost while preserving required predictive quality.

## When to use
Use after profiling shows model execution or representation is a material bottleneck.

## Inputs
Latency profiles, hardware metrics, model graph/artifact, quality metrics, traffic and cost targets.

## Context to inspect
Pre/postprocessing, batch sizes, precision, runtime, operators, memory transfers and concurrency.

## Core knowledge
Optimize measured bottlenecks. Quantization, pruning, distillation, compilation and batching trade quality, portability, latency and throughput differently.

## Procedure
1. Establish representative quality and performance baselines.
2. Profile end-to-end and isolate model execution.
3. Identify CPU/GPU, memory, I/O or launch overhead.
4. Apply low-risk runtime/configuration improvements first.
5. Evaluate reduced precision or quantization on representative hardware.
6. Consider compilation/operator fusion.
7. Use pruning/distillation only when simpler methods are insufficient.
8. Re-evaluate critical slices after each transformation.
9. Benchmark p50/p95/p99 and throughput under load.
10. Record artifact/runtime compatibility.

## Decision points
Prefer optimization that simplifies operations. Use batching for throughput when latency budget permits; distill when model complexity itself is the constraint.

## Common failure patterns
Microbenchmarks divorced from production, optimizing averages, quality checks only globally, unsupported operators and GPU acceleration with transfer overhead dominating.

## Verification
Compare end-to-end benchmarks, resource use, cost and quality against fixed acceptance thresholds.

## Expected output
Optimized artifact/configuration with measured before/after evidence.

## Stop conditions
Stop when quality guardrails fail, bottleneck moves outside the model, or operational complexity outweighs savings.