# Caching Rules

## Purpose
Use caching without violating correctness, privacy, or consistency expectations.
## Scope
Browser, CDN, application, distributed, and database-adjacent caches.
## MUST
- Define cache key, owner, TTL, invalidation, stale behavior, and failure fallback.
- Include authorization or tenant dimensions in keys when cached data differs by access context.
- Treat caches as disposable unless explicitly designed as durable storage.
## MUST NOT
- Cache sensitive responses publicly.
- Add caching before identifying the bottleneck and correctness model.
## SHOULD
- Prefer bounded staleness and observable hit/miss behavior.
## Exceptions
Long-lived immutable caching requires versioned content identity.
## Verification
Test invalidation, tenant isolation, stale paths, failure fallback, and cache metrics.