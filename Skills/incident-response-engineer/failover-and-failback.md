# Failover and Failback

## Purpose
Move workloads to alternate capacity during incidents and return them safely without introducing data loss, split-brain behavior, or renewed outage.

## When to use
Use when a region, cluster, dependency, data store, or infrastructure domain cannot meet recovery objectives and an alternate is available.

## Inputs
Failover topology, health state, replication status, RTO/RPO, traffic controls, capacity, data consistency model, and runbooks.

## Context to inspect
Inspect replication lag, DNS/traffic-manager TTLs, session state, write ownership, queues, credentials, certificates, quotas, and alternate-site capacity.

## Core knowledge
Failover changes system topology and often data authority. Failback is a separate risky operation and should not be treated as automatic cleanup.

## Procedure
1. Confirm failure meets failover criteria.
2. Verify alternate capacity and dependencies are healthy.
3. Assess replication lag and potential data loss.
4. Establish authoritative write location and prevent split brain.
5. Drain, fence, or isolate the unhealthy side where required.
6. Shift traffic in controlled stages when possible.
7. Verify critical transactions and telemetry.
8. Monitor backlog, consistency, and saturation.
9. Keep failover state stable until the original environment is repaired.
10. Plan failback with synchronization, compatibility, rollback, and observation steps.
11. Execute failback separately and verify again.

## Decision points
Fail over when expected outage harm exceeds consistency and transition risk. Delay failback until the original site is demonstrably healthy and synchronization is understood.

## Common failure patterns
Failing over to insufficient capacity, split-brain writes, ignoring DNS caches, immediate failback, and assuming replication equals application consistency.

## Verification
Confirm traffic, writes, dependencies, and data consistency are correct in the active environment before declaring success.

## Expected output
A failover/failback record with criteria, state transitions, data-risk assessment, verification, and remaining actions.

## Stop conditions
Escalate when write authority is ambiguous, replication state is unknown, or failover may exceed approved data-loss objectives.