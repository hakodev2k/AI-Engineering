# Replication Strategy

## Purpose
Design replication policies that meet durability and availability goals without creating unsafe consistency assumptions or unbounded operational cost.

## When to use
Use when defining replica count, placement, synchronous versus asynchronous replication, multi-region behavior, or recovery policy.

## Inputs
Durability target, availability target, latency SLOs, failure domains, network latency, write rate, data volume, cost constraints, and consistency requirements.

## Preconditions
Identify which failures must be tolerated and how much acknowledged data loss is acceptable.

## Context to inspect
Replica placement, leader or quorum logic, acknowledgement rules, lag metrics, failover process, repair mechanisms, backup design, and region topology.

## Core knowledge
Replication is not equivalent to backup. Synchronous replication reduces acknowledged-data-loss risk but adds latency and coordination dependency. Asynchronous replication improves write latency and geographic reach but introduces lag and recovery-point exposure. Replica placement must avoid correlated failure domains.

## Procedure
1. Define durability and availability objectives in measurable terms.
2. Enumerate failure domains and correlated-failure scenarios.
3. Select replica count and placement constraints.
4. Define synchronous and asynchronous acknowledgement boundaries.
5. Define leader, multi-leader, or leaderless semantics.
6. Specify lag thresholds and degraded-mode behavior.
7. Define failover eligibility and fencing requirements.
8. Design replica repair and replacement.
9. Separate replication from backup and archival requirements.
10. Model network and storage overhead during normal and recovery states.
11. Validate regional and zone-loss behavior.
12. Document client-visible consistency consequences.

## Decision points
Prefer synchronous replicas within low-latency failure domains when acknowledged durability matters. Use asynchronous remote replicas when latency makes synchronous geographic coordination unacceptable. Increase replica count only when the reliability benefit justifies write and storage overhead.

## Common failure patterns
Replicas in the same correlated failure domain, automatic failover without fencing, accepting writes from stale primaries, hidden replication lag, insufficient repair bandwidth, and treating replication as protection from operator or application corruption.

## Verification
Measure replication lag, exercise leader loss and replica replacement, validate quorum behavior, and confirm acknowledged writes survive the intended failures.

## Expected output
A replication design defining replica topology, acknowledgement rules, failover behavior, lag policy, repair process, and documented consistency trade-offs.

## Stop conditions
Stop when failure tolerance, data-loss tolerance, or network assumptions are not sufficiently defined.