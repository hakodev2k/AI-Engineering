# Data Caching Rules

## Purpose
Prevent stale, cross-user, or inconsistent frontend data while using caching deliberately for performance and resilience.

## Scope
HTTP caches, in-memory caches, replayed streams, browser storage, service workers, and client-side server-state caches.

## MUST
- Define cache key, owner, lifetime, invalidation, and user/session isolation for cached data.
- Invalidate or reconcile cached data after mutations according to backend consistency semantics.
- Clear user-sensitive caches on identity/session changes when reuse could expose another user's data.
- Distinguish stale-while-revalidate UX from authoritative freshness requirements.

## MUST NOT
- Cache sensitive responses in shared or persistent locations without explicit security review.
- Use indefinite replay/cache behavior for mutable server data without invalidation semantics.
- Hide stale-data risk behind a generic caching abstraction.

## SHOULD
- Measure whether caching materially improves critical latency before adding complex cache layers.

## Exceptions
Offline-first workflows may retain stale data when freshness state, reconciliation, and conflict behavior are visible and tested.

## Verification
Test cache hits/misses, expiry, mutation invalidation, identity changes, offline behavior, and network traces.