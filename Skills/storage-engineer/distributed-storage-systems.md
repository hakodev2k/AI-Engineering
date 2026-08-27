# Distributed Storage Systems

## Purpose
Design and operate distributed storage with explicit consistency, placement, quorum, repair, and failure-domain behavior.

## When to use
Use for scale-out block/file/object systems, cluster expansion, quorum incidents, rebalancing, or architecture evaluation.

## Inputs
Node topology, data placement policy, consistency requirements, replication/EC scheme, network capacity, workload, and SLOs.

## Context to inspect
Control plane, metadata services, quorum members, placement maps, rebalance settings, repair queues, and cluster health history.

## Core knowledge
Distributed storage trades coordination, availability, consistency, and partition behavior. Quorum protects decisions but does not remove correlated failures. Repair and rebalance consume the same resources as foreground traffic.

## Procedure
1. Identify control-plane and data-plane components.
2. Map quorum and placement across failure domains.
3. Define consistency semantics visible to clients.
4. Quantify replication/EC overhead and repair bandwidth.
5. Establish safe utilization thresholds.
6. Test node, rack/zone, and network-partition scenarios.
7. Tune recovery priority against foreground SLOs.
8. Monitor under-replication, misplaced data, quorum health, and rebalance backlog.
9. Validate scale-out and scale-in procedures.
10. Maintain failure and recovery runbooks.

## Decision points
Use stronger consistency when correctness demands it; accept weaker semantics only with application awareness. Spread replicas across independent domains; throttle recovery when foreground impact is unacceptable, but never so far that durability exposure becomes excessive.

## Common failure patterns
Quorum members in one domain, near-full clusters that cannot rebalance, recovery storms, hidden metadata bottlenecks, and adding nodes without network capacity.

## Verification
Demonstrate supported failure tolerance, data integrity, repair completion, bounded recovery impact, and correct client semantics.

## Expected output
Placement/quorum design, operating thresholds, failure tests, scaling plan, and incident runbook.

## Stop conditions
Escalate on quorum ambiguity, suspected split brain, unexplained data inconsistency, or insufficient free space for safe recovery.