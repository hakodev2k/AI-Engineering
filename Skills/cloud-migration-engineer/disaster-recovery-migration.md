# Disaster Recovery Migration

## Purpose
Re-establish and prove disaster-recovery capability when workloads move to new regions, services, failure domains, or backup systems.

## When to use
Use whenever migration changes RTO/RPO implementation, replication, backups, failover routing, or recovery ownership.

## Inputs
Business continuity requirements, RTO/RPO, current DR design, data replication, backup policies, target regions/zones, dependency map, DNS/routing, and recovery runbooks.

## Preconditions
Business-approved recovery objectives and critical dependency ordering must be known.

## Context to inspect
Inspect backup immutability, replication lag, regional dependencies, identity, DNS, secrets, infrastructure code, data restore, queues, third parties, and control-plane dependencies.

## Core knowledge
High availability is not disaster recovery. DR requires recoverable state, independent failure domains, executable reconstruction, and tested dependency sequencing. Replication can copy corruption.

## Procedure
1. Map each critical workload to RTO/RPO and failure scenarios.
2. Identify target-region/service dependencies and correlated failure risks.
3. Choose backup/restore, pilot-light, warm-standby, or active-active patterns based on objectives and cost.
4. Automate infrastructure reconstruction where practical.
5. Configure data protection and replication with monitored lag.
6. Ensure secrets, certificates, IAM, DNS, and configuration are recoverable.
7. Define dependency recovery order.
8. Build failover and failback runbooks.
9. Test recovery using isolated or controlled exercises.
10. Measure actual RTO and data loss against objectives.
11. Validate security and observability in recovery mode.
12. Correct gaps before source DR capability is retired.

## Decision points
Use backup/restore for tolerant RTO/RPO and lower cost; warm standby for faster recovery; active-active only when application/data semantics justify complexity. Prefer independent recovery paths for critical control-plane dependencies.

## Common failure patterns
Assuming multi-zone equals DR; backups in same failure boundary; no restore test; missing DNS/IAM recovery; replication lag unmonitored; failover tested but failback ignored.

## Verification
Execute a recovery exercise and capture timings, data reconciliation, dependency recovery, traffic restoration, and failback evidence.

## Expected output
A tested target DR design, runbooks, measured RTO/RPO, gap register, and retirement criteria for legacy DR.

## Stop conditions
Stop decommissioning source DR when target recovery has not been demonstrated, critical dependencies lack recovery paths, or measured objectives exceed business tolerance.