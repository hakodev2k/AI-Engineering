# High Availability Architecture

## Purpose
Design database availability so expected component failures do not become unacceptable service outages.

## When to use
Use for critical databases, topology redesign, cloud migration, or recurring availability incidents.

## Inputs
Availability targets, workload patterns, failure domains, consistency requirements, recovery objectives, and budget.

## Context to inspect
Primary/replica topology, quorum rules, zones, regions, network paths, client failover behavior, and maintenance processes.

## Core knowledge
HA is an end-to-end property. Replication alone does not guarantee availability; election behavior, client routing, dependencies, and operational procedures matter.

## Procedure
1. Define tolerated failure scenarios.
2. Map single points of failure.
3. Select replication and quorum topology.
4. Distribute nodes across appropriate failure domains.
5. Configure health detection and failover.
6. Validate client reconnection and retry behavior.
7. Define maintenance and patching sequence.
8. Test node, zone, and dependency failures.
9. Measure recovery and data consistency.

## Decision points
Use synchronous replication when data-loss tolerance demands it and latency permits. Use asynchronous replication across distant regions when latency matters more than zero-RPO failover.

## Common failure patterns
Replicas in one failure domain, untested failover, split-brain risk, stale DNS, retry storms, and capacity insufficient after losing a node.

## Verification
Run controlled failure tests and confirm recovery time, write safety, read behavior, connection recovery, and remaining capacity.

## Expected output
A validated HA topology, failure matrix, failover procedure, and evidence against availability objectives.

## Stop conditions
Escalate when quorum safety is uncertain, failover risks data loss beyond policy, or required capacity is unavailable.