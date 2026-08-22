# GraphQL Caching

## Purpose
Apply caching at the correct layer while preserving authorization, freshness, and invalidation semantics in GraphQL systems.

## When to use
Use when repeated work is measured and cacheable under explicit consistency requirements.

## Inputs
Traffic patterns, data volatility, authorization model, cache infrastructure, resolver/data-source behavior, and latency goals.

## Context to inspect
Inspect request-scoped loader caches, application caches, downstream caches, persisted operations, HTTP/CDN feasibility, cache keys, and invalidation events.

## Core knowledge
GraphQL's single endpoint and variable queries make naive HTTP caching difficult. Caching can occur per request, entity/data source, operation result, or edge layer. Cache keys must include every dimension affecting authorized output.

## Procedure
1. Measure repeated expensive work and expected hit rate.
2. Define acceptable staleness and consistency.
3. Choose the lowest-risk cache layer.
4. Construct keys including tenant, identity/permission dimensions where required.
5. Set bounded TTL and size policies.
6. Define invalidation or event-driven refresh when necessary.
7. Prevent request-scoped DataLoader caches from becoming global accidentally.
8. Instrument hits, misses, evictions, and stale-result incidents.
9. Test authorization changes and mutation-after-read behavior.
10. Benchmark with and without cache.

## Decision points
Prefer request-scoped caching for duplicate loads within one operation. Use shared caches for reusable data only when invalidation and access semantics are understood. Cache whole operations mainly for stable persisted queries with safe variation keys.

## Common failure patterns
Cross-user cache leakage, missing variable dimensions, caching errors indefinitely, stale authorization, unbounded caches, and using cache to mask inefficient data access.

## Verification
Verify correctness after updates, permission changes, expiry, cache loss, and concurrent requests; demonstrate measured latency/load benefit.

## Expected output
A bounded caching design with explicit keys, freshness, invalidation, and security semantics.

## Stop conditions
Stop if authorized output cannot be represented safely in a cache key or required freshness cannot tolerate caching.