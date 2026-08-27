# Replication Topology

## Purpose
Design replication layouts that meet durability, locality, recovery, and throughput objectives.

## When to use
Use when deploying or resizing clusters, adding regions, changing replica placement, or investigating replication bottlenecks.

## Inputs
Failure domains, traffic geography, RPO/RTO, latency SLOs, capacity forecasts, database replication capabilities.

## Context to inspect
Cluster topology, node roles, zones/regions, replication factors, write leaders, network characteristics, lag metrics, and failover procedures.

## Core knowledge
Replication improves durability and read locality but adds coordination, bandwidth, storage, and operational cost. Placement must account for correlated failures. Synchronous replicas affect commit latency; asynchronous replicas create measurable data-loss windows.

## Procedure
1. Define tolerated node, zone, and region failures.
2. Map write and read traffic geographically.
3. Establish durability and recovery requirements.
4. Select replication factor and placement constraints.
5. Decide which replicas participate in commit acknowledgement.
6. Estimate cross-domain bandwidth and latency.
7. Validate quorum survivability for planned failures.
8. Define replica replacement and rebalancing behavior.
9. Load-test replication under peak writes.
10. Document degraded-mode behavior.

## Decision points
Use synchronous replication when acknowledged-write durability dominates latency. Use asynchronous remote replicas when regional distance makes synchronous commits unacceptable and the business accepts bounded RPO.

## Common failure patterns
Putting replicas in one failure domain, underestimating rebuild traffic, allowing unbounded lag, asymmetric capacity, and designing quorum counts without considering maintenance.

## Verification
Exercise node and zone failures, measure commit latency and lag, validate replica reconstruction, and prove quorum remains available under stated failure assumptions.

## Expected output
A topology diagram, placement policy, capacity assumptions, failure matrix, and validated recovery behavior.

## Stop conditions
Stop when failure-domain information, RPO/RTO, or network constraints are unknown, or when topology changes risk losing quorum.