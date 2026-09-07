# Cache and Buffering Rules

## Purpose
Prevent caches and buffers from hiding durability or consistency failures.

## Scope
Applies to page cache, controller cache, write-back buffers, read caches, and application-adjacent storage caches.

## MUST
- Document whether acknowledged writes are durable across host, controller, and power failure.
- Validate cache invalidation and persistence semantics under restart and failover.
- Monitor cache effectiveness and write-back pressure.

## MUST NOT
- Equate cache acknowledgment with durable persistence unless guarantees are proven.
- Disable flush or barrier semantics for performance without explicit risk approval.
- Rely on cache hit rate alone as evidence of healthy storage behavior.

## SHOULD
- Use power-loss-safe write caching where required.
- Test cold-cache and cache-eviction scenarios.

## Exceptions
Performance-driven deviations require evidence, bounded blast radius, and approval.

## Verification
Inspect configuration, durability tests, cache metrics, restart tests, and power-loss or equivalent fault simulation.