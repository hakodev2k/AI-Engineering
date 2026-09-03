# Caching and CDN Rules

## Purpose
Use caching safely to reduce latency, origin load, and repeated transfer without serving stale or unauthorized content.

## Scope
Applies to browser caches, service workers, HTTP caching, CDN behavior, invalidation, variants, and edge delivery.

## MUST
- Define cacheability, freshness, validation, and invalidation behavior explicitly for performance-critical resources.
- Separate public cacheable content from personalized or authorization-sensitive responses.
- Include all material response variants in cache keys or equivalent partitioning.
- Test purge and rollback behavior before relying on long-lived production caching.

## MUST NOT
- Cache secrets, private user data, or authorization-dependent responses in shared caches without proven isolation.
- Use long TTLs without a reliable versioning or invalidation mechanism.
- Claim a cache improvement without measuring hit ratio and user-visible latency.

## SHOULD
- Use immutable versioned assets where practical.
- Place cacheable content near users when field evidence shows network latency is material.

## Exceptions
Exceptions require security and correctness assessment, measured benefit, rollback strategy, and approval for high-risk cache behavior.

## Verification
Inspect cache headers, cache keys, CDN configuration, hit/miss telemetry, invalidation tests, and representative user waterfalls.