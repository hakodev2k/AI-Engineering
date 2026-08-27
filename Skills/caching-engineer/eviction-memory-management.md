# Eviction and Memory Management

## Purpose
Control cache memory so valuable working sets remain resident without OOM events, pathological churn, or hidden fragmentation.

## When to use
Use when sizing caches, choosing eviction policies, investigating evictions, or handling memory pressure.

## Inputs
Working-set distribution, object sizes, access frequency/recency, memory limits, backend allocator metrics.

## Context to inspect
Inspect max memory, eviction policy, fragmentation, expiration volume, key/value overhead, and node headroom.

## Core knowledge
LRU, LFU, FIFO, random, and TTL-aware policies optimize different workloads. Logical payload size differs from resident memory due to metadata and allocator fragmentation. High eviction rate can turn cache into expensive pass-through infrastructure.

## Procedure
1. Measure resident memory and logical payload separately.
2. Characterize object-size and reuse distributions.
3. Estimate active working set.
4. Reserve headroom for fragmentation, replication, failover, and maintenance.
5. Select eviction policy matching access behavior.
6. Separate critical namespaces if noisy neighbors can evict valuable data.
7. Set object and cardinality limits.
8. Load-test beyond steady-state capacity.
9. Monitor evictions, hit rate, fragmentation, OOM, and latency.
10. Re-size from observed reuse and cost.

## Decision points
LFU can suit stable popularity; LRU suits recency-driven reuse. Explicit TTL-only behavior may be appropriate where eviction of non-expiring keys is unsafe, though caches should not hold irreplaceable state.

## Common failure patterns
Sizing by payload only; zero failover headroom; unbounded objects; mixing unrelated namespaces; interpreting evictions as harmless.

## Verification
Run memory-pressure tests and verify graceful eviction without OOM or unacceptable hit-rate collapse.

## Expected output
A capacity and eviction policy with evidence-based headroom.

## Stop conditions
Stop if entries are irreplaceable or eviction would cause correctness loss.