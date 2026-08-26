# Eviction and Capacity

## Purpose
Keep cache memory bounded while preserving useful working sets.

## Scope
Memory limits, eviction policies, admission, quotas, and capacity planning.

## MUST
- Cache capacity MUST be sized from measured working-set, object-size, traffic, growth, and failover evidence.
- Eviction policy MUST match workload characteristics and business priority.
- Shared caches MUST define tenant or workload protections where one producer can evict another's critical data.
- Capacity thresholds MUST leave operational headroom for failover and bursts.

## MUST NOT
- Memory exhaustion MUST NOT be treated as a normal eviction mechanism.
- Production capacity increases MUST NOT replace investigation of unbounded cardinality or object growth.
- Critical workloads MUST NOT depend on unspecified default eviction behavior.

## SHOULD
- Track bytes, entry count, object-size distribution, eviction rate, hit rate, and working-set churn.
- Use admission control where low-value one-hit entries pollute the cache.

## Exceptions
Require evidence, bounded impact, rollback, and ownership.

## Verification
Inspect configuration, memory telemetry, eviction metrics, cardinality trends, load tests, and failover capacity models.