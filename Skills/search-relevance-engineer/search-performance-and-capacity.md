# Search Performance and Capacity

## Purpose
Diagnose and improve search latency, throughput, resource efficiency, and capacity without trading away relevance blindly.

## When to use
Use for latency regressions, scaling reviews, expensive queries, high CPU/memory pressure, shard imbalance, or new ranking stages.

## Inputs
Latency percentiles, QPS, query profiles, CPU/memory/IO metrics, shard topology, cache metrics, candidate counts, index size, workload distribution.

## Context to inspect
Query DSL, aggregations, filters, rerank stages, shard routing, refresh/merge activity, caches, timeouts, concurrency limits, and slow-query logs.

## Core knowledge
Search latency is often dominated by fan-out, candidate volume, expensive scoring, aggregations, cache misses, storage pressure, or tail shards. Average latency hides operational risk; p95/p99 and saturation matter.

## Procedure
1. Reproduce representative slow queries with production-like data.
2. Separate client, network, coordinator, shard, retrieval, ranking, and aggregation time.
3. Profile query execution and candidate counts.
4. Identify saturation and tail-shard behavior.
5. Remove unnecessary fields, clauses, aggregations, or rerank work.
6. Bound candidate and facet depths.
7. Evaluate cacheability and routing improvements.
8. Revisit shard sizing only after query inefficiencies are understood.
9. Load-test expected and burst traffic.
10. Record performance budgets for future relevance changes.

## Decision points
Optimize query shape before adding hardware when waste is evident. Scale horizontally when legitimate parallel workload exceeds node capacity; scale vertically when single-shard working sets or CPU-bound stages demand it.

## Common failure patterns
Optimizing averages, adding replicas to fix CPU-heavy scoring without measurement, oversharding, unbounded aggregations, excessive semantic reranking, and performance tests on tiny indexes.

## Verification
Compare p50/p95/p99 latency, throughput, error/timeout rate, resource saturation, relevance metrics, and cost under representative load.

## Expected output
Bottleneck evidence, optimized query/stage design, capacity model, benchmark results, and remaining limits.

## Stop conditions
Stop when production-like workload cannot be reproduced, bottleneck evidence is contradictory, or a relevance-impacting optimization lacks evaluation.