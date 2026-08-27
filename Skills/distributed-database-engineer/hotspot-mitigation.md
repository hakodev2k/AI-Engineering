# Hotspot Mitigation

## Purpose
Detect and remove disproportionate load on partitions, leaders, tenants, or keys without hiding the underlying distribution problem.

## When to use
Use for uneven CPU, throttling, high tail latency, overloaded leaders, or hot-key incidents.

## Inputs
Per-partition metrics, key-frequency distributions, traffic traces, shard layout, workload semantics.

## Context to inspect
Routing keys, partition sizes, leader placement, caches, rate limits, tenant patterns, and recent workload changes.

## Core knowledge
Hotspots arise from skew, temporal locality, monotonically increasing keys, leader concentration, or large tenants. Global averages conceal them. Mitigation may use salting, adaptive partitioning, caching, isolation, or schema changes.

## Procedure
1. Identify the saturated resource and exact partitions.
2. Rank keys or tenants by contribution.
3. Determine whether skew is persistent or bursty.
4. Check leader and replica placement.
5. Apply short-term protection such as rate limiting or safe caching.
6. Select a structural mitigation appropriate to query semantics.
7. Plan data movement with bounded impact.
8. Load-test worst-case skew.
9. Alert on per-partition imbalance.

## Decision points
Use salting when writes can spread and reads tolerate controlled fan-out. Prefer tenant isolation for predictably dominant tenants. Cache only when staleness semantics permit it.

## Common failure patterns
Adding nodes without redistributing hot keys, random salting that destroys queryability, caching correctness-critical mutable state, and monitoring only cluster averages.

## Verification
Show improved maximum-to-median partition load, lower tail latency, and preserved correctness under skewed load.

## Expected output
A hotspot root cause, immediate protection, durable distribution fix, and imbalance monitoring.

## Stop conditions
Stop before repartitioning or throttling if customer-impact policy, movement capacity, or correctness implications are unknown.