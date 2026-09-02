# Data Placement and Rebalancing

## Purpose
Design safe data-placement and rebalancing mechanisms that maintain availability and durability while clusters grow, shrink, or recover.

## When to use
Use when adding or removing nodes, balancing uneven capacity, changing failure-domain topology, or redesigning placement algorithms.

## Inputs
Partition map, replica policy, node capacities, failure domains, workload heat, network bandwidth, storage utilization, and maintenance constraints.

## Preconditions
Replication and minimum-availability constraints must be explicit before moving data.

## Context to inspect
Placement algorithm, ownership metadata, node weights, movement scheduler, throttles, bootstrap/decommission logic, replica health, and capacity alerts.

## Core knowledge
Placement must balance capacity, load, and failure-domain diversity. Rebalancing creates read, write, network, and disk amplification precisely when a cluster may already be stressed. Movement must preserve ownership epochs and prevent temporary under-replication.

## Procedure
1. Measure current imbalance by bytes, IOPS, throughput, and latency.
2. Identify capacity and failure-domain constraints.
3. Compute desired placement using stable ownership rules.
4. Prioritize moves that reduce risk or overload.
5. Ensure destination replicas become healthy before source removal.
6. Throttle movement based on foreground latency and recovery reserve.
7. Serialize or coordinate conflicting moves.
8. Preserve ownership epochs through retries and controller failover.
9. Handle partially completed copies idempotently.
10. Monitor under-replication, movement backlog, and hotspot migration.
11. Pause automatically on unsafe health thresholds.
12. Validate final balance and clean stale replicas safely.

## Decision points
Use deterministic placement for predictable recovery and decentralized routing; use centrally optimized placement when heterogeneous hardware or complex constraints justify the controller dependency.

## Common failure patterns
Moving too much data at once, deleting the old replica before destination validation, oscillating placements, ignoring workload heat, stale ownership metadata, and rebalancing into a nearly full failure domain.

## Verification
Exercise scale-out, scale-in, node replacement, and interrupted movement. Confirm availability and replica count remain within policy during every transition.

## Expected output
A placement policy and rebalance procedure with constraints, throttles, health gates, rollback behavior, and observability.

## Stop conditions
Stop when the cluster lacks enough healthy capacity or failure-domain diversity to complete movement without violating durability policy.