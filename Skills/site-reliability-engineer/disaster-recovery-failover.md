# Disaster Recovery and Failover

## Purpose
Design and prove that critical services can recover from site, region, storage, or platform failures within agreed recovery objectives.

## When to use
Use for critical services, regional architecture, backup design, business continuity planning, and after major infrastructure changes.

## Inputs
RTO/RPO requirements, architecture, replication model, backups, failover procedures, dependency map, capacity, DNS/routing, and data-consistency constraints.

## Preconditions
Business-approved recovery objectives and ownership must exist or be explicitly identified as missing.

## Context to inspect
Data replication lag, backup retention, restore process, regional quotas, secrets/configuration, infrastructure-as-code, traffic routing, dependency geography, and cold-start time.

## Core knowledge
High availability and disaster recovery are related but distinct. Backups are useful only when restore is proven. Failover can introduce stale data, overload the secondary region, or expose hidden single-region dependencies.

## Procedure
1. Map critical services and stateful dependencies.
2. Confirm RTO and RPO for each critical workflow.
3. Identify single points of regional or platform failure.
4. Validate backup, replication, and restore mechanisms.
5. Confirm secondary capacity and required quotas.
6. Define failover sequence and ownership.
7. Test routing, configuration, credentials, and dependency access.
8. Execute a controlled recovery exercise.
9. Measure actual RTO/RPO and data integrity.
10. Test failback as well as failover.
11. Record gaps and repeat after remediation.

## Decision points
Use active-active only when consistency, operational complexity, and cost are justified. Use active-passive when simpler recovery meets objectives. Prefer tested automation where deterministic, but retain explicit approval for high-impact traffic or data transitions.

## Common failure patterns
Untested backups, secondary regions without enough quota, global dependencies located in one region, stale secrets, failover without failback, and assuming replication equals backup.

## Verification
Perform restore/failover exercises and prove measured recovery time, acceptable data loss, correct routing, healthy SLOs, and successful failback.

## Expected output
DR architecture, tested recovery procedure, measured RTO/RPO, dependency gaps, and remediation ownership.

## Stop conditions
Escalate when recovery objectives are infeasible, failover risks data corruption, or business approval is required for cost or consistency trade-offs.