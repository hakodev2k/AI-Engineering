# Search Caching

## Purpose
Use caches without serving stale, unauthorized, or semantically incorrect search results.

## Scope
Query caches, result caches, feature caches, embedding caches, and application-layer caches.

## MUST
- Include all semantics-affecting dimensions in cache keys, including authorization scope where results differ by access.
- Define freshness and invalidation behavior for cached search data.
- Bound cache memory and protect against untrusted high-cardinality key explosions.
- Measure hit rate and end-to-end latency benefit before relying on a cache optimization.

## MUST NOT
- Share user- or tenant-specific cached results across incompatible security scopes.
- Treat cache invalidation failure as harmless when freshness is contractually important.
- Cache sensitive query data without applicable privacy controls.

## SHOULD
- Prefer bounded TTLs and explicit versioning for derived artifacts.
- Design safe bypass behavior for cache outages.

## Exceptions
Exceptions require freshness/security analysis, evidence, and rollback criteria.

## Verification
Inspect key construction, invalidation tests, cross-tenant tests, cache metrics, memory pressure, and outage behavior.