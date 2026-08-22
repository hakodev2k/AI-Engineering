# Client Caching Rules
## Purpose
Use caching without serving silently incorrect or dangerously stale information.
## Scope
Query caches, browser storage, service-worker caches, invalidation, and optimistic updates.
## MUST
- Cached data MUST have an ownership, freshness, and invalidation strategy.
- Mutations MUST reconcile or invalidate affected cached views.
- Optimistic updates MUST define rollback or authoritative reconciliation on failure.
- Sensitive cached data MUST follow the product's data classification and retention requirements.
## MUST NOT
- Cache lifetime MUST NOT be chosen only for performance without correctness analysis.
- Authorization decisions MUST NOT rely solely on stale client-cached permissions.
## SHOULD
- Prefer declarative cache keys that include all inputs affecting the result.
## Exceptions
Immutable versioned resources may use effectively permanent caching when identity changes with content.
## Verification
Inspect cache keys, headers/storage, invalidation paths, mutation tests, and stale-data scenarios.