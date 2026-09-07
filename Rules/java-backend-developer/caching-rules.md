# Caching Rules

## Purpose
Use caching without violating correctness, isolation, or operational predictability.

## Scope
Applies to local caches, distributed caches, HTTP caching, and cached derived data.

## MUST
- Cached data MUST have explicit ownership, key semantics, freshness requirements, and invalidation behavior.
- Cache keys MUST include all dimensions that affect the value, including tenant/security context where relevant.
- Cache failure behavior MUST be defined so outages do not create uncontrolled backend load or incorrect authorization.
- TTL and size limits MUST be justified by freshness and capacity requirements.
- Sensitive cached data MUST receive protection equivalent to its source classification.

## MUST NOT
- MUST NOT treat cache as authoritative storage unless explicitly designed as such.
- MUST NOT cache authorization decisions across contexts that can change their validity without a safe invalidation strategy.
- MUST NOT introduce unbounded in-process caches.

## SHOULD
- Measure hit ratio, latency, eviction, memory, and origin load.
- Prefer simple invalidation semantics over complex coherence when business requirements permit.

## Exceptions
Long-lived or non-expiring cache entries require immutable/source-versioned data or explicit invalidation guarantees and review.

## Verification
Use correctness tests across invalidation, expiry, failover, and concurrent updates; inspect cache metrics, key construction, capacity limits, and origin-load behavior.