# N+1 Query Prevention Rules

## Purpose
Prevent resolver execution from multiplying downstream reads with response cardinality.

## Scope
Applies to database, cache, service, and API access initiated by nested GraphQL field resolution.

## MUST
- Resolver implementations MUST be reviewed for access patterns that scale with parent-item count.
- Repeated equivalent lookups within one operation MUST use batching, prefetching, join strategies, or equivalent bounded access.
- Batch keys and results MUST preserve authorization and tenant boundaries.
- Batching behavior MUST be covered by tests that assert downstream call counts for representative cardinalities.

## MUST NOT
- MUST NOT introduce per-item network or database calls in list resolvers without evidence that cardinality is strictly bounded.
- MUST NOT share request-scoped loader caches across requests or security principals.
- MUST NOT treat caching as a substitute for fixing structurally unbounded access.

## SHOULD
- SHOULD prefer request-scoped batching primitives with deterministic cache lifetime.
- SHOULD monitor downstream calls per GraphQL operation.

## Exceptions
Exceptions require documented cardinality bounds, measured impact, alternatives considered, and reviewer approval.

## Verification
Use integration tests, query-count assertions, traces, profiler output, and production dependency-call metrics.