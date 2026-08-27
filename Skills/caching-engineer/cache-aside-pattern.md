# Cache-Aside Pattern

## Purpose
Implement cache-aside reads safely with explicit miss, fill, freshness, and failure behavior.

## When to use
Use when applications can own cache population and tolerate misses to an authoritative source.

## Inputs
Read path, source API, key scheme, TTL, serialization format, concurrency profile.

## Context to inspect
Inspect existing read abstractions, timeouts, retry policies, cache client behavior, and source capacity.

## Core knowledge
Cache-aside keeps cache concerns near reads but exposes race conditions and miss amplification. Cache failures should usually degrade to the source only when the source can safely absorb that load.

## Procedure
1. Validate cache suitability and source-of-truth ownership.
2. Build deterministic keys.
3. Attempt cache read with a tight timeout.
4. On hit, validate decoding/version and return.
5. On miss, use request coalescing when contention warrants it.
6. Read the authoritative source.
7. Cache only valid cacheable results with bounded TTL.
8. Consider negative caching for legitimate not-found results.
9. Do not cache transient source failures as valid data.
10. Instrument hit/miss/fill/error latency separately.
11. Test cache outage and cold-cache load.

## Decision points
Use cache-aside when source reads are safe and application ownership is acceptable. Prefer read-through infrastructure when centralized policy materially reduces duplication.

## Common failure patterns
Long cache timeouts; caching exceptions; duplicate fills; source collapse during outage; non-versioned serialization; treating cache write failure as request failure unnecessarily.

## Verification
Load-test warm, cold, and unavailable-cache states and verify correctness against source data.

## Expected output
A resilient cache-aside implementation with tests and metrics.

## Stop conditions
Stop if fallback load exceeds source capacity or stale behavior violates correctness.