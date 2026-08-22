# Partitioning and Sharding

## Purpose
Distribute data and workload across partitions while controlling hotspots, cross-partition operations, rebalancing, and operational complexity.

## When to use
Use when one storage or processing unit cannot meet capacity, throughput, locality, or isolation requirements.

## Inputs
Data model, access patterns, cardinality, growth rate, traffic distribution, locality needs, and platform partition limits.

## Context to inspect
Inspect current keys, query patterns, tenant distribution, hot entities, transaction requirements, indexing, and rebalancing support.

## Core knowledge
A partition key determines locality, parallelism, and failure concentration. Good keys have high cardinality and distribute load while keeping common operations local. Distribution can change over time.

## Procedure
1. Quantify current and projected scale.
2. Identify dominant read/write access patterns.
3. Identify operations requiring co-location or atomicity.
4. Generate candidate partition keys.
5. Model cardinality and traffic skew.
6. Evaluate cross-partition query and fan-out cost.
7. Plan routing, metadata, and key evolution.
8. Define split/rebalance/migration procedure.
9. Add per-partition telemetry and hotspot alerts.
10. Load-test skewed workloads.

## Decision points
Prefer simple natural keys when distribution remains healthy. Introduce composite, hashed, or bucketed keys when hotspots dominate, while accounting for lookup complexity.

## Common failure patterns
Partitioning by low-cardinality status/date alone, assuming uniform tenants, no migration plan, and requiring global transactions after sharding.

## Verification
Test realistic skew, growth, rebalancing, node/partition failure, and cross-partition workloads. Confirm no single partition violates capacity targets.

## Expected output
A partition strategy with routing, scaling limits, hotspot controls, and migration plan.

## Stop conditions
Stop when access patterns are unknown or required atomic operations cannot tolerate the proposed partition boundary.