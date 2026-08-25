# Serving Architecture and Latency

## Purpose
Design recommendation serving paths that meet quality, availability, latency, and cost targets under production load.

## When to use
Use when building or scaling retrieval/ranking services or diagnosing tail-latency regressions.

## Inputs
Traffic profile, SLOs, model sizes, feature dependencies, candidate counts, infrastructure limits, and fallback requirements.

## Context to inspect
Critical path, RPC fan-out, caches, model runtime, batching, concurrency, autoscaling, and dependency SLOs.

## Core knowledge
Tail latency compounds across serial and fan-out dependencies. Recommendation serving benefits from staged budgets, bounded candidate counts, precomputation, caching, batching, and graceful degradation.

## Procedure
1. Draw the end-to-end critical path.
2. Allocate latency budgets per stage.
3. Benchmark retrieval, feature fetch, ranking, and re-ranking independently.
4. Remove unnecessary synchronous dependencies.
5. Bound candidate and feature cardinality.
6. Add caching/precomputation where freshness permits.
7. Define timeouts, circuit behavior, and quality-preserving fallbacks.
8. Load-test at peak and failure conditions.

## Decision points
Precompute stable data; compute volatile context online. Batch inference when throughput matters and queue delay stays bounded. Scale out before scale up when horizontal partitioning is reliable.

## Common failure patterns
Average-latency optimization, unbounded fan-out, synchronized cache expiry, oversized candidate sets, missing deadlines, and no fallback.

## Verification
Meet p50/p95/p99 latency, throughput, error-rate, and cost targets in production-like load tests and dependency-failure drills.

## Expected output
A serving architecture with explicit budgets, capacity assumptions, and degradation behavior.

## Stop conditions
Stop when required quality cannot fit the latency/cost envelope without a product or architecture trade-off.