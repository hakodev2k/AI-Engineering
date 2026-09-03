# Caching Rules

## Purpose
Use caching without violating GraphQL correctness, authorization, or freshness guarantees.

## Scope
Applies to resolver caches, request-scoped loaders, response caches, CDN behavior, and downstream data caches.

## MUST
- Cache scope MUST match identity, tenant, authorization, and data-visibility boundaries.
- Cache keys MUST include every input that materially affects the returned value.
- Freshness and invalidation behavior MUST be defined for mutable data.
- Shared response caching MUST account for operation, variables, authentication context, and headers that affect semantics.
- Cache effectiveness claims MUST be supported by hit-rate and latency evidence.

## MUST NOT
- MUST NOT reuse privileged cached data for callers with weaker authorization.
- MUST NOT cache sensitive responses in shared storage without an explicit security design.
- MUST NOT introduce stale-data behavior that violates documented consistency requirements.

## SHOULD
- SHOULD prefer request-scoped deduplication before cross-request caching.
- SHOULD monitor hit ratio, eviction, staleness, and backend load.

## Exceptions
Exceptions require documented correctness risk, TTL or invalidation strategy, measurement, and reviewer approval.

## Verification
Inspect cache-key construction, authorization tests, invalidation tests, production cache metrics, and stale-read scenarios.