# Disaster Recovery Architecture

## Purpose
Define how systems and data recover from severe outages, corruption, region loss, operator mistakes, or destructive incidents.

## When to use
Use for systems with explicit RTO/RPO, critical data, regulatory continuity requirements, or geographically distributed infrastructure.

## Inputs
RTO, RPO, data criticality, topology, backup strategy, dependencies, runbooks, budget.

## Preconditions
Business impact of downtime and data loss is quantified.

## Context to inspect
Backup schedules, restore tests, replication, failover, DNS, secrets, identity, third-party dependencies, infrastructure-as-code, operational access.

## Core knowledge
High availability is not disaster recovery. Replication can copy corruption. Backups are valuable only when restorable within required time.

## Procedure
1. Classify workloads by recovery criticality.
2. Confirm RTO/RPO per workload.
3. Map state and dependency recovery order.
4. Design backup, replication, and immutable recovery sources.
5. Define failover/failback procedures.
6. Ensure infrastructure and configuration can be rebuilt.
7. Include identity, secrets, networking, and external dependencies.
8. Define communication and decision authority.
9. Run restore and disaster exercises.
10. Measure actual recovery time and data loss.

## Decision points
Choose active-active, active-passive, warm standby, or restore-from-backup based on business value, consistency, and cost.

## Common failure patterns
Untested backups, missing dependency order, no failback plan, assuming replication equals backup, inaccessible credentials during incidents.

## Verification
Periodic exercises meet RTO/RPO with evidence.

## Expected output
DR architecture, runbooks, ownership, and tested recovery evidence.

## Stop conditions
Stop when business-required recovery targets are impossible within approved cost or dependency limits.