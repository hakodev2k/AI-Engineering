# Caching and Consistency

## Purpose
Use caching without violating correctness, privacy, or contract semantics.

## Scope
Gateway caches, CDN caches, response caching, invalidation, and freshness.

## MUST
- Cacheability MUST be explicit for responses containing user-specific or sensitive data.
- Cache keys MUST include all request dimensions that affect the representation.
- Freshness and invalidation behavior MUST match business consistency requirements.
- Shared caches MUST prevent cross-tenant data exposure.

## MUST NOT
- MUST NOT cache authenticated responses by default without a reviewed key and privacy design.
- MUST NOT use caching to hide an unresolved capacity problem without measuring staleness risk.

## SHOULD
- Cache policies SHOULD expose hit ratio, age, eviction, and origin-load telemetry.

## Exceptions
Consistency trade-offs require documented acceptable staleness and consumer impact.

## Verification
Test cache-key isolation, invalidation, stale behavior, headers, and production cache metrics.