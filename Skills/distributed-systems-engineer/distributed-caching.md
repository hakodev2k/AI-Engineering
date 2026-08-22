# Distributed Caching

## Purpose
Use shared caches to reduce latency and backend load without violating correctness or creating uncontrolled stale-state behavior.

## When to use
Use for expensive reads, shared session-like state where appropriate, reference data, computed results, and load smoothing.

## Inputs
Read/write patterns, freshness tolerance, source-of-truth behavior, object size, cardinality, traffic, and failure requirements.

## Context to inspect
Inspect existing caches, invalidation paths, TTLs, key design, serialization, backend capacity, and consistency expectations.

## Core knowledge
Caches trade freshness and complexity for latency/capacity. They are normally derived state, not authoritative state. Cache stampedes, hot keys, eviction, and invalidation races are production concerns.

## Procedure
1. Prove the workload is cache-beneficial with measurements.
2. Define source of truth and freshness tolerance.
3. Design namespaced/versioned keys.
4. Select cache-aside, write-through, or another pattern based on ownership.
5. Define TTL and invalidation semantics.
6. Protect hot misses with request coalescing or bounded locking.
7. Add jitter to large populations of expirations.
8. Define behavior when cache is unavailable.
9. Instrument hit ratio, latency, evictions, hot keys, and backend amplification.
10. Load-test cold-cache and outage scenarios.

## Decision points
Do not cache when data is cheap, highly volatile, security-sensitive without safe scoping, or correctness requires immediate authoritative reads.

## Common failure patterns
Cache as database, unbounded values, missing tenant/user key dimensions, synchronized expiration, and retries against an overloaded cache.

## Verification
Measure hit ratio and backend reduction; validate invalidation, isolation, cold start, and cache-outage behavior.

## Expected output
A cache strategy with correctness boundaries, key design, TTL/invalidation, resilience, and telemetry.

## Stop conditions
Escalate when freshness requirements are undefined or caching could expose data across authorization boundaries.