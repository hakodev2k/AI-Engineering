# Failover and Recovery

## Purpose
Engineer predictable database failover that preserves committed data and restores service without creating competing authorities.

## When to use
Use for HA design, failover drills, leader-loss incidents, and recovery automation.

## Inputs
Topology, replication mode, failure detector behavior, RPO/RTO, fencing mechanisms, client routing.

## Context to inspect
Promotion logic, leases/epochs, replica lag, load balancers, connection pools, automation, and historical incidents.

## Core knowledge
Failover requires both promotion and fencing of the old authority. Fast detection increases false positives; slow detection increases outage time. Client retries and stale routing can extend incidents after the database has recovered.

## Procedure
1. Enumerate failover-triggering failures.
2. Define authoritative promotion criteria.
3. Verify fencing or epoch mechanisms.
4. Bound acceptable replica lag before promotion.
5. Update client routing safely.
6. Define behavior for in-flight transactions.
7. Test old-primary reappearance.
8. Rebuild redundancy after promotion.
9. Measure recovery against RTO/RPO.
10. Automate only decisions with safe evidence.

## Decision points
Use automatic failover for well-observed, safely fenceable failures; require operator approval when evidence is ambiguous or promotion can lose acknowledged writes.

## Common failure patterns
Split brain, promoting stale replicas, retry storms, automatic failback, hidden DNS/connection-cache delays, and leaving the cluster under-replicated.

## Verification
Run controlled primary, node, zone, and network failures; verify one authority, data durability, routing convergence, and restored redundancy.

## Expected output
A failover policy, tested automation/runbook, recovery measurements, and fencing proof.

## Stop conditions
Stop automatic recovery when authority cannot be established, fencing fails, or all candidate replicas exceed accepted data-loss bounds.