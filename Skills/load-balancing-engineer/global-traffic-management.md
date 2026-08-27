# Global Traffic Management

## Purpose
Distribute traffic across regions while balancing latency, sovereignty, capacity, and disaster resilience.

## When to use
Use for multi-region systems, global expansion, disaster recovery, or regional overload management.

## Inputs
User geography, regional capacity, SLOs, residency constraints, health signals, DNS/anycast capabilities, and failover objectives.

## Context to inspect
Inspect regional dependencies, data replication, DNS TTLs, anycast routes, health sources, regional quotas, and disaster runbooks.

## Core knowledge
Global routing can be DNS-based, anycast-based, or application-aware. Failover is constrained by surviving capacity and data availability. Geographic proximity does not guarantee lowest latency. Control-plane failures must be considered separately from data-plane failures.

## Procedure
1. Map users, regions, data, and dependencies.
2. Define steady-state traffic allocation.
3. Measure real client-to-region latency.
4. Establish regional capacity including failover headroom.
5. Define health criteria for regional withdrawal.
6. Select DNS, anycast, or layered steering.
7. Define failover and failback sequencing.
8. Test partial and full regional failures.
9. Validate residency and data consistency constraints.
10. Monitor allocation, latency, and regional saturation.

## Decision points
Use latency steering when user experience dominates; weighted steering for controlled capacity; geo rules for residency. Prefer explicit isolation when correlated failures are a major risk.

## Common failure patterns
Failing over into insufficient capacity; DNS TTL assumptions; data layer unavailable in target region; automatic failback causing oscillation; health based on a single signal.

## Verification
Run game days and confirm traffic moves within RTO, surviving regions stay within capacity, and application correctness remains intact.

## Expected output
A regional steering policy, failover matrix, capacity model, and tested runbook.

## Stop conditions
Escalate when data residency, replication, or regional capacity makes advertised failover impossible.