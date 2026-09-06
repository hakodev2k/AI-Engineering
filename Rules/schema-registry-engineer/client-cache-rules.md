# Client Cache Rules

## Purpose
Use client-side schema caching without creating stale-policy, memory, or correctness failures.

## Scope
Schema ID caches, subject/version caches, TTLs, eviction, negative caching, and client fallback behavior.

## MUST
- Cache keys MUST uniquely identify the schema artifact or lookup semantics they represent.
- Cache invalidation assumptions MUST reflect whether registered versions are immutable.
- Cache size and retention MUST be bounded for long-running production clients.
- Negative caching MUST use bounded lifetimes so transient registry failures do not become prolonged outages.
- Client behavior on cache miss and registry unavailability MUST be explicitly defined.

## MUST NOT
- MUST NOT cache mutable policy decisions indefinitely.
- MUST NOT treat cached schema presence as proof that a new registration would satisfy current compatibility policy.
- MUST NOT allow unbounded subject/version cardinality to exhaust client memory.

## SHOULD
- Prefer immutable schema-ID caching where registry identity guarantees make it safe.
- Expose cache hit, miss, eviction, and lookup-failure metrics for critical clients.

## Exceptions
Long-lived caches require immutability evidence, memory bounds, and operational justification.

## Verification
Review cache-key logic, eviction tests, outage tests, memory profiles, and cache metrics.