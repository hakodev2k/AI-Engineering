# Caching Strategy

## Purpose
Use caching to reduce latency and load while preserving acceptable freshness and correctness.

## When to use
Measured repeated expensive reads, high downstream load, static assets, or latency-sensitive data reuse.

## Inputs
Access patterns, freshness tolerance, data size, mutation frequency, consistency requirements, cache technology.

## Context to inspect
Current bottleneck, cache layers, keys, TTLs, invalidation paths, multi-tenant boundaries, failure behavior.

## Core knowledge
Caching trades freshness and complexity for speed. Key design, invalidation, stampede control, capacity, and fallback behavior determine correctness.

## Procedure
1. Prove the uncached bottleneck.
2. Identify reusable results and freshness tolerance.
3. Select browser/CDN/application/distributed cache layer.
4. Define canonical keys including security/tenant dimensions.
5. Choose TTL and invalidation strategy.
6. Prevent stampedes for hot misses.
7. Bound item size and total capacity.
8. Define cache outage behavior.
9. Instrument hit rate, miss latency, evictions, and staleness.
10. Benchmark end-to-end impact.

## Decision points
Prefer TTL for naturally expiring data; explicit invalidation when stale values are unacceptable and mutations are observable. Avoid cache when source queries are already cheap.

## Common failure patterns
Caching before optimization, missing tenant in keys, indefinite TTL, caching errors, synchronized expiry, stale authorization data, and treating cache as durable storage.

## Verification
Test hit, miss, expiry, invalidation, outage, concurrent miss, and cross-tenant isolation paths.

## Expected output
Measured cache policy with explicit consistency behavior.

## Stop conditions
Stop if correctness/freshness requirements are unknown or cache would mask a severe underlying defect.