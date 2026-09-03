# Memory Performance Engineering

## Purpose
Diagnose and optimize latency, throughput, resource usage, and cost across memory extraction, storage, retrieval, ranking, and context assembly.

## When to use
Use when memory increases response latency, storage cost, index size, or service saturation.

## Inputs
Latency traces, query plans, index metrics, model-call timings, cache metrics, workload profiles, cost data, SLOs.

## Preconditions
Have a reproducible workload and stage-level measurements before optimizing.

## Context to inspect
Database queries, vector searches, embedding calls, network hops, serialization, caches, batch jobs, context token usage, and concurrency limits.

## Core knowledge
Memory latency is often cumulative across multiple services. Optimization should target measured critical paths while preserving retrieval quality, isolation, and freshness.

## Procedure
1. Establish p50, p95, and p99 baselines.
2. Decompose latency by pipeline stage.
3. Identify CPU, I/O, network, index, or model bottlenecks.
4. Inspect query and vector-index behavior.
5. Evaluate batching, caching, compression, and parallelism.
6. Reduce unnecessary candidate retrieval and context size.
7. Load-test changes under realistic concurrency.
8. Compare quality before and after optimization.
9. Track cost per memory operation and per user task.
10. Document capacity limits and scaling triggers.

## Decision points
Scale vertically for short-term resource saturation; scale horizontally when partitionable workloads justify it. Do not trade authorization or temporal correctness for speed.

## Common failure patterns
Optimizing averages only; increasing vector recall at large latency cost; caching unsafe results; benchmarking synthetic queries unlike production.

## Verification
Verify latency and cost improvements under representative load while memory-quality and correctness metrics remain within approved thresholds.

## Expected output
A measured optimization plan, benchmark evidence, and capacity guidance.

## Stop conditions
Stop when bottlenecks cannot be reproduced or optimization would weaken required correctness/security guarantees.