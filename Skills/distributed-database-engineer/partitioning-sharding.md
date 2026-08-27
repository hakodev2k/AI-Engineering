# Partitioning and Sharding

## Purpose
Design data distribution that scales workload while controlling hotspots, fan-out, and operational complexity.

## When to use
Use for new distributed schemas, capacity expansion, hotspot incidents, or repartitioning plans.

## Inputs
Access patterns, key cardinality, growth forecast, transaction boundaries, locality requirements, skew measurements.

## Context to inspect
Schema, query patterns, key distributions, per-shard metrics, routing logic, secondary indexes, and rebalancing capabilities.

## Core knowledge
A shard key determines locality and blast radius. Good distribution balances load while co-locating operations that must transact. Hashing improves balance; ranges improve locality; composite schemes can combine both. Cross-shard work is expensive.

## Procedure
1. Rank dominant reads and writes by volume and criticality.
2. Measure candidate key cardinality and skew.
3. Identify data that must be co-located.
4. Evaluate hash, range, directory, and composite partitioning.
5. Model hottest tenants or keys.
6. Estimate fan-out for major queries.
7. Plan shard growth and movement.
8. Define routing and metadata ownership.
9. Load-test skewed workloads.
10. Document repartitioning triggers.

## Decision points
Prefer hash distribution for uniform scale, range distribution for ordered locality, and explicit tenant placement when isolation or residency dominates.

## Common failure patterns
Low-cardinality shard keys, monotonically increasing hotspots, cross-shard joins in critical paths, shard-count assumptions embedded in clients, and no resharding strategy.

## Verification
Validate distribution under realistic skew, measure p95/p99 shard load and fan-out latency, and execute a safe shard movement test.

## Expected output
A shard-key rationale, routing design, capacity model, hotspot mitigations, and resharding plan.

## Stop conditions
Stop if access patterns are unknown, proposed keys violate residency requirements, or repartitioning would be destructive without a migration plan.