# Cache Stampede Protection

## Purpose
Prevent synchronized misses or refreshes from overwhelming dependencies.

## Scope
Hot keys, mass expiry, cold starts, refresh, and failure recovery.

## MUST
- High-concurrency miss paths MUST have a documented strategy for bounding duplicate origin work.
- Expiry for large populations MUST avoid synchronized refresh where dependency capacity cannot absorb it.
- Stampede controls MUST have bounded wait times and failure behavior.
- Hot-key scenarios MUST be included in load and recovery testing.

## MUST NOT
- Unbounded locks, queues, or retries MUST NOT replace origin overload with cache-layer exhaustion.
- A single failed refresher MUST NOT indefinitely block stale-but-acceptable serving where policy permits it.
- Recovery assumptions MUST NOT rely only on average request rates.

## SHOULD
- Consider request coalescing, single-flight, jitter, stale-while-revalidate, probabilistic refresh, or prewarming according to workload.
- Monitor concurrent origin requests per key or key class.

## Exceptions
Document peak-load evidence, dependency headroom, fallback behavior, and risk acceptance.

## Verification
Perform burst, mass-expiry, cold-start, and dependency-degradation tests; inspect concurrency, queue, latency, and origin-load metrics.