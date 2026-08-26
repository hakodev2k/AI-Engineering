# Edge Caching

## Purpose
Use gateway caching without serving stale, private, or cross-tenant data incorrectly.

## Scope
Response caches, cache keys, TTLs, invalidation, revalidation, and cache-control behavior.

## MUST
- Cache eligibility MUST be defined from API semantics and data sensitivity.
- Cache keys MUST include every request dimension that materially changes the response, including authorization or tenant context when applicable.
- Private or user-specific responses MUST NOT enter shared caches unless isolation is proven.
- TTL and invalidation behavior MUST reflect acceptable staleness.

## MUST NOT
- MUST NOT cache mutation responses merely for performance convenience.
- MUST NOT ignore upstream cache-control semantics without an explicit contract decision.
- MUST NOT claim a cache improvement without before/after latency and origin-load evidence.

## SHOULD
- Cache stampede protection SHOULD be used for expensive hot keys.
- Cache observability SHOULD expose hit ratio, origin load, errors, and eviction behavior.

## Exceptions
Exceptions require data exposure analysis, staleness tolerance, evidence, and approval for sensitive data.

## Verification
Test cache-key isolation, TTL/invalidation, authorization variants, stale behavior, hit ratio, origin load, and failure modes.