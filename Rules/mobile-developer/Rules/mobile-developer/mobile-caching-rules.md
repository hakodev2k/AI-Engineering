# Mobile Caching Rules
## Purpose
Improve responsiveness without serving unsafe stale state or exhausting device resources.
## Scope
Memory cache, disk cache, HTTP cache, image cache, stale data, invalidation, and eviction.
## MUST
- Cached data MUST have defined authority, freshness, invalidation, and eviction semantics.
- Security-sensitive or user-specific caches MUST be partitioned and cleared on identity transitions as required.
- Cache size MUST be bounded.
## MUST NOT
- Cached authorization or entitlement decisions MUST NOT outlive their valid authority window.
- Cache hits MUST NOT hide required synchronization for destructive or financial operations.
## SHOULD
- Stale-while-revalidate behavior SHOULD be used only when users can safely act on stale data.
## Exceptions
Immutable versioned assets may use effectively indefinite caching.
## Verification
Test expiry, logout/login, account switching, low storage, invalidation, stale offline state, and cache corruption.