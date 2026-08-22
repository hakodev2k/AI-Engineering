# Caching Rules

## Purpose
Prevent stale data, cache stampedes, unsafe serialization, and accidental correctness failures.

## Scope
Applies to in-memory cache, distributed cache, HTTP cache, and application-level cache-aside patterns.

## MUST
- Every cache MUST have a defined ownership, key strategy, freshness model, and invalidation/expiry behavior.
- Cached data whose staleness affects correctness MUST have explicit consistency requirements.
- Cache misses and cache outages MUST have defined fallback behavior.
- High-contention cache misses MUST consider stampede protection or request coalescing.
- Cache keys MUST include all dimensions that materially affect the value.

## MUST NOT
- MUST NOT cache secrets, tokens, or sensitive data unless the storage and access model are explicitly approved.
- MUST NOT assume cache availability or freshness as a source of truth unless designed as such.
- MUST NOT use unbounded in-memory caches in long-lived processes.

## SHOULD
- Prefer simple TTL-based policies when stronger invalidation semantics are unnecessary.
- Measure hit rate, miss rate, latency, and fallback cost for important caches.

## Exceptions
Complex invalidation or write-through strategies require documented consistency need, failure behavior, and operational ownership.

## Verification
Use tests for hit/miss/stale/eviction behavior, outage simulation, metrics, and concurrency/load testing.