# CDN and Cache Rules

## Purpose
Ensure scalable media delivery with predictable cache behavior, origin protection, and controlled invalidation.

## Scope
CDNs, edge caches, cache keys, TTLs, shielding, purge, signed delivery, and multi-CDN routing.

## MUST
- Cache keys MUST include every request attribute that materially changes returned media or authorization semantics.
- TTL and invalidation behavior MUST match object mutability and publication guarantees.
- Origin shielding and request collapse MUST be considered for high-fanout cache misses.
- CDN changes MUST assess hit ratio, origin load, latency, error rate, and geographic impact.

## MUST NOT
- MUST NOT cache personalized or authorization-sensitive responses under a shared key unless explicitly designed and verified safe.
- MUST NOT purge broad production namespaces without human approval and impact assessment.
- MUST NOT rely on a CDN feature without validating behavior on the configured product and path.

## SHOULD
- Multi-CDN steering SHOULD use measured health and QoE where justified.
- Immutable media SHOULD receive long-lived caching where operationally appropriate.

## Exceptions
Lower cacheability requires documented correctness/security reason and origin-capacity evidence.

## Verification
Inspect cache headers and keys, run edge/origin traces, measure hit ratios, execute purge tests in safe environments, and validate regional failover.