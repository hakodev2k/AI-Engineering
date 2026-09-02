# Storage Architecture

## Purpose
Design and review distributed storage architectures that satisfy durability, availability, consistency, latency, throughput, scalability, and operational requirements.

## When to use
Use when designing a distributed storage platform, evolving an existing storage layer, or reviewing architectural trade-offs. Avoid unnecessary distribution when a simpler managed or single-node system meets the requirements.

## Inputs
Workload profile, data model, read/write ratios, growth projections, consistency needs, durability goals, availability goals, latency targets, geographic constraints, recovery goals, and infrastructure limits.

## Preconditions
Clarify the business impact of data loss, stale reads, downtime, and slow recovery.

## Context to inspect
Existing storage topology, regions and zones, replication design, data placement, metadata services, client behavior, backup design, capacity signals, and incident history.

## Core knowledge
Distributed storage design is shaped by failure domains and trade-offs. Replication improves durability and availability but adds coordination and recovery cost. Sharding improves scale but complicates placement and rebalancing. Metadata can become a hidden bottleneck. Capacity planning must include replication overhead, repair traffic, compaction, and free-space headroom.

## Procedure
1. Define durability, availability, RPO, RTO, latency, and throughput goals.
2. Characterize access patterns and expected growth.
3. Identify process, host, rack, zone, region, and dependency failure domains.
4. Select replication or erasure coding based on recovery, latency, and cost requirements.
5. Define partitioning and data placement.
6. Define read/write consistency semantics.
7. Design metadata ownership and redundancy.
8. Define rebalancing, repair, compaction, and decommission workflows.
9. Model overload behavior and recovery bandwidth.
10. Define backup and disaster recovery separately from replication.
11. Define observability and capacity thresholds.
12. Validate behavior under representative component and zone outages.
13. Document accepted trade-offs and rejected alternatives.

## Decision points
Use replication when recovery simplicity and low read latency dominate. Use erasure coding when storage efficiency justifies reconstruction complexity. Prefer strong consistency only where the data semantics require it.

## Common failure patterns
Treating replication as backup, ignoring correlated failures, hot partitions, metadata bottlenecks, unsafe rebalancing, insufficient recovery headroom, and assuming network partitions never happen.

## Verification
Validate the design with capacity models, outage simulations, recovery exercises, consistency tests, and measured load tests. Confirm that durability and availability claims map to explicit failure coverage.

## Expected output
A documented architecture covering topology, placement, replication, consistency, recovery, capacity, observability, and operational trade-offs.

## Stop conditions
Stop when critical consistency semantics, data-loss tolerance, failure domains, or regulatory constraints are unresolved.