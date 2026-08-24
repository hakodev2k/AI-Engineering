# Caching Rules

## Purpose
Use caching without violating correctness, security, or freshness requirements.

## Scope
In-memory caches, distributed caches, HTTP caches, memoization, and cache-backed read models.

## MUST
- Every cache MUST have explicit ownership, key design, freshness semantics, and invalidation behavior.
- Sensitive or tenant-scoped data MUST be isolated in cache keys and access paths.
- Cache failures MUST degrade safely according to service requirements.
- Cached data that affects authorization or critical decisions MUST have bounded staleness appropriate to risk.

## MUST NOT
- MUST NOT treat cache contents as the authoritative system of record unless explicitly designed as such.
- MUST NOT share keys across tenants or security principals when values differ by identity.
- MUST NOT add caching as a performance claim without measurement.

## SHOULD
- Cache stampede prevention SHOULD be used for expensive hot keys.
- TTLs SHOULD reflect business freshness needs rather than arbitrary constants.

## Exceptions
Indefinite or manually invalidated caches require documented correctness guarantees and operational ownership.

## Verification
Review key construction, TTLs, invalidation tests, tenant-isolation tests, cache-miss behavior, and before/after performance measurements.