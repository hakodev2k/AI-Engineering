# RAG Performance and Cost Optimization

## Purpose
Reduce latency and cost while preserving measured retrieval and answer quality.

## When to use
Use when RAG violates SLOs, throughput targets, or budget constraints.

## Inputs
Stage traces, QPS, latency percentiles, token usage, model/index pricing, cache metrics, evaluation baseline.

## Context to inspect
Inspect ingestion versus serving costs, embedding calls, candidate depths, reranker latency, context tokens, generation tokens, network hops, and concurrency limits.

## Core knowledge
Optimize the critical path using measurements. Tail latency matters for interactive systems. Cutting context or model strength without evaluation can create hidden quality regressions.

## Procedure
1. Establish quality, latency, throughput, and cost baselines.
2. Break latency and spend down by stage.
3. Identify dominant bottleneck or cost driver.
4. Remove unnecessary work and duplicate retrieval first.
5. Tune candidate and rerank depths empirically.
6. Reduce context tokens through deduplication and selection.
7. Batch embeddings or offline work where appropriate.
8. Add caches only for stable, safely keyed results.
9. Tune concurrency and connection reuse.
10. Re-evaluate quality after each material optimization.
11. Load-test p95/p99 under expected peaks.
12. Document capacity limits and rollback thresholds.

## Decision points
Prefer cheaper models only when evaluation demonstrates acceptable quality. Cache retrieval when corpus and authorization semantics permit; cache generated answers only with stricter freshness and security analysis.

## Common failure patterns
Optimizing averages; unbounded parallelism; global cache across tenants; excessive reranking; reducing k without recall analysis; premature infrastructure scaling.

## Verification
Compare before/after quality, p50/p95/p99, throughput, error rate, and cost per successful answer.

## Expected output
Measured optimizations with no unacknowledged quality or security regression.

## Stop conditions
Stop optimization when changes threaten correctness, authorization, or SLO evidence cannot be reproduced.