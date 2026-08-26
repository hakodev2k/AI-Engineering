# Performance and Cost Optimization

## Purpose
Improve feature computation and serving efficiency using measured bottlenecks without weakening correctness or SLOs.

## When to use
Use when costs rise, training retrieval is slow, materialization misses windows or online latency approaches limits.

## Inputs
Profiles, query plans, resource metrics, cost allocation, workload shape and SLOs.

## Context to inspect
Scans, shuffles, partitions, file sizes, cache hit rates, payloads, network hops, online QPS and compute utilization.

## Core knowledge
Optimize the dominant resource after measurement. Feature platforms trade compute, storage, freshness and operational complexity; caching and precomputation can shift rather than remove cost.

## Procedure
1. Establish baseline latency, throughput and cost per workload.
2. Profile the critical path.
3. Identify dominant scan, shuffle, CPU, memory, network or database cost.
4. Form a measurable hypothesis.
5. Optimize one major factor: pruning, aggregation, compaction, vectorization, batching, caching or key layout.
6. Re-run identical benchmark.
7. Check correctness and freshness regressions.
8. Evaluate peak-load behavior and cost transfer.
9. Roll out gradually and monitor.
10. Record before/after evidence.

## Decision points
Precompute when repeated read savings exceed storage/update cost. Cache only with explicit invalidation/freshness semantics. Scale hardware after algorithmic/layout bottlenecks are understood.

## Common failure patterns
Premature optimization, average-only benchmarks, cache-induced staleness, over-partitioning and moving cost to another team/system.

## Verification
Show statistically credible improvement under representative load with unchanged correctness and SLO compliance.

## Expected output
A measured optimization with documented trade-offs and cost impact.

## Stop conditions
Stop when optimization requires semantic compromise not approved by model/data owners.