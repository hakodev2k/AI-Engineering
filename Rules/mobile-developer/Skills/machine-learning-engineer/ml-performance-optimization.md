# ML Performance Optimization

## Purpose
Reduce training or inference latency, memory, throughput bottlenecks, and infrastructure cost using measurement-driven changes.

## When to use
When SLOs or budgets are missed or scale materially increases.

## Inputs
Profiles, traces, hardware metrics, workload shapes, model graph, data pipeline metrics, cost data.

## Context to inspect
CPU/GPU utilization, I/O wait, batching, serialization, feature computation, model size, precision, concurrency, memory transfers.

## Core knowledge
Optimize the measured bottleneck, not presumed model complexity. End-to-end throughput may be limited by input pipelines or dependencies rather than compute.

## Procedure
1. Define target workload and performance budget.
2. Benchmark reproducibly before changes.
3. Profile end-to-end stages.
4. Rank bottlenecks by contribution.
5. Apply one targeted technique: batching, vectorization, caching, compilation, quantization, pruning, distillation, parallelism, or I/O improvements.
6. Rebenchmark quality and performance.
7. Check tail latency, memory, and cost.
8. Preserve rollback and compatibility.

## Decision points
Use hardware acceleration only when utilization and economics justify it. Accept compression only within agreed quality loss. Scale out after fixing obvious per-instance inefficiency.

## Common failure patterns
Microbenchmark-only optimization, larger batches causing tail latency/OOM, quality regression from quantization, and GPU use with CPU-bound preprocessing.

## Verification
Representative benchmark demonstrates statistically stable improvement without violating quality or reliability guardrails.

## Expected output
Profile evidence, optimized configuration, before/after benchmark, and trade-off record.

## Stop conditions
Stop when gains are below noise/cost threshold or optimization requires unacceptable quality loss.