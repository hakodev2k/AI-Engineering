# Cache Performance Engineering

## Purpose
Evaluate whether caching reduces critical-path work efficiently without creating unacceptable staleness, memory pressure, stampedes, or operational complexity.

## When to use
Use when repeated expensive reads dominate latency or dependency load, or when existing caches have poor hit rates or instability.

## Inputs
Access patterns, latency profiles, cache metrics, data freshness requirements, invalidation rules, memory limits, and dependency costs.

## Context to inspect
Inspect hit/miss ratio, miss penalty, key cardinality, object size, TTL distribution, eviction, hot keys, invalidation, serialization, network cost, and failure behavior.

## Core knowledge
Hit rate alone is insufficient; weighted hit value and miss penalty matter. Caches shift consistency and capacity problems. TTL jitter, request coalescing, and bounded memory can prevent stampedes and synchronized expiry.

## Procedure
1. Identify expensive repeatable work suitable for caching.
2. Quantify frequency, cost, freshness tolerance, and object size.
3. Choose cache scope and key semantics.
4. Define TTL/invalidation and ownership.
5. Estimate memory and cardinality growth.
6. Add protections for hot keys and concurrent misses.
7. Measure hit rate, latency saved, miss latency, evictions, and cache overhead.
8. Test cold-start and cache-failure behavior.
9. Verify consistency requirements under updates.
10. Reassess whether cache complexity remains justified.

## Decision points
Prefer local caches for very low latency and tolerable per-instance inconsistency; distributed caches for shared state and higher cardinality. Avoid caching cheap or highly volatile operations without evidence.

## Common failure patterns
Unbounded keys, identical TTLs, caching errors indefinitely, weak invalidation, cache-as-database design, measuring only hit rate, and making the application unavailable when the cache fails.

## Verification
Demonstrate end-to-end latency or dependency-load improvement, bounded resource use, acceptable freshness, and safe degraded behavior.

## Expected output
A measured cache design or tuning recommendation with consistency and failure trade-offs.

## Stop conditions
Stop when freshness semantics are undefined or caching would violate correctness/security boundaries.