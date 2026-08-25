# Storage Architecture

## Purpose
Design storage systems that meet durability, latency, throughput, availability, scale, and cost objectives without coupling applications to accidental implementation details.

## When to use
Use for new storage platforms, major capacity growth, workload migrations, or architecture reviews. Do not redesign solely to adopt a fashionable technology.

## Inputs
Workload profile, data volume/growth, SLOs, durability and recovery requirements, access patterns, compliance constraints, budget, and existing topology.

## Preconditions
Obtain representative workload evidence and identify data criticality. Separate hard requirements from preferences.

## Context to inspect
Current storage tiers, protocols, failure domains, replication, network paths, host limits, backup dependencies, operational ownership, and historical incidents.

## Core knowledge
Storage design is a trade-off among latency, throughput, IOPS, durability, availability, consistency, capacity efficiency, operability, and cost. Failure domains and recovery behavior matter more than nominal device specifications.

## Procedure
1. Classify workloads by access pattern and criticality.
2. Quantify capacity, IOPS, throughput, latency percentiles, and growth.
3. Define RPO, RTO, durability, and availability targets.
4. Map data and service dependencies.
5. Choose block, file, object, or specialized storage based on semantics.
6. Define redundancy and failure domains.
7. Model network and host bottlenecks.
8. Define scaling, lifecycle, backup, and restore paths.
9. Model normal and degraded performance.
10. Document operational boundaries and ownership.
11. Validate with representative tests and failure scenarios.

## Decision points
Prefer simpler architectures when requirements allow. Scale up when operational simplicity dominates; scale out when capacity, throughput, or failure-domain requirements justify distributed complexity. Replication improves availability but does not replace backup.

## Common failure patterns
Sizing from averages, ignoring tail latency, correlated replicas, hidden network bottlenecks, no restore design, unbounded metadata growth, and assuming vendor availability claims equal application availability.

## Verification
Confirm measured workload tests satisfy SLOs in normal and degraded states; execute restore/failover tests; verify capacity headroom and failure-domain isolation.

## Expected output
An evidence-backed storage architecture with topology, sizing assumptions, SLO mapping, failure behavior, operational plan, and recorded trade-offs.

## Stop conditions
Escalate when requirements conflict, representative workload evidence is unavailable, compliance constraints are unresolved, or a design requires destructive migration without an approved recovery plan.
