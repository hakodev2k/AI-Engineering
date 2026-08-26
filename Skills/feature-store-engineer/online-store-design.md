# Online Store Design

## Purpose
Design low-latency feature serving storage with predictable availability, consistency and cost.

## When to use
Use for real-time inference features or online-store migrations.

## Inputs
Keys, payload sizes, QPS, p95/p99 latency, freshness, availability, TTL and regional requirements.

## Context to inspect
Serving topology, model request patterns, current database limits, replication, network path and failure history.

## Core knowledge
Online stores optimize keyed reads and controlled writes. Capacity must consider hot keys, replication, payload amplification, TTL churn and failover behavior.

## Procedure
1. Define serving SLOs and consistency requirements.
2. Model key cardinality and payload size.
3. Estimate read/write QPS including bursts.
4. Choose key schema and feature grouping.
5. Define TTL and eviction semantics.
6. Size partitions/shards with headroom.
7. Configure replication and failure-domain strategy.
8. Implement bounded timeouts and client pooling.
9. Test hot-key and partial-outage behavior.
10. Monitor latency, errors, saturation, evictions and replication lag.

## Decision points
Group features to reduce round trips when update cadence aligns; separate them when write amplification or ownership differs. Strong consistency is justified only when model correctness requires it.

## Common failure patterns
Oversized values, hot partitions, no TTL strategy, cross-region synchronous dependencies and treating average latency as sufficient.

## Verification
Load-test p99 latency, failover, stale reads, capacity headroom and cost at forecast traffic.

## Expected output
An online-store design with measurable serving guarantees and failure behavior.

## Stop conditions
Stop if SLOs, traffic envelope or data residency requirements are unresolved.