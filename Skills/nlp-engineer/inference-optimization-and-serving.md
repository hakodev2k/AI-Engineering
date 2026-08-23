# Inference Optimization and Serving

## Purpose
Deploy NLP models with predictable latency, throughput, memory use, cost, and rollback behavior without silently degrading task quality.

## When to use
Use when moving a model into production, scaling traffic, changing hardware, quantizing, batching, caching, or investigating serving bottlenecks.

## Inputs
Model artifact, tokenizer, serving stack, traffic profile, latency SLO, concurrency, hardware, quality benchmark, cost budget.

## Preconditions
A reproducible reference model and evaluation suite exist.

## Context to inspect
Sequence lengths, batch sizes, warmup behavior, CPU/GPU utilization, memory, queueing, serialization, network overhead, autoscaling, model versioning.

## Core knowledge
NLP serving latency is shaped by tokenization, sequence length, batching, model compute, memory bandwidth, queueing, and generation length. Optimization is valid only when output quality remains within gates.

## Procedure
1. Measure end-to-end baseline including preprocessing and network time.
2. Profile p50, p95, and p99 by input/output length.
3. Identify compute, memory, queue, or I/O bottlenecks.
4. Test batching and concurrency under realistic arrival patterns.
5. Evaluate quantization, compilation, distillation, or smaller models where useful.
6. Bound generation tokens and timeout behavior.
7. Add load shedding, backpressure, and autoscaling thresholds.
8. Version tokenizer and preprocessing with the model.
9. Compare optimized outputs against reference quality suite.
10. Define canary, rollback, and capacity margins.

## Decision points
Batch when throughput gains outweigh queue delay. Quantize when memory/latency savings preserve critical metrics. Cache only deterministic or safely reusable outputs with correct privacy boundaries.

## Common failure patterns
Benchmarking only warm steady state, ignoring tokenization, maxing batch size at p99 expense, serving mismatched tokenizer versions, and accepting optimization without quality regression tests.

## Verification
Load tests meet SLOs at expected headroom, quality gates pass, resource metrics are stable, and rollback is exercised.

## Expected output
Serving configuration, capacity model, benchmark report, quality comparison, scaling thresholds, and rollback plan.

## Stop conditions
Stop when optimizations violate quality or safety gates, resource saturation remains unexplained, or rollback cannot be guaranteed.