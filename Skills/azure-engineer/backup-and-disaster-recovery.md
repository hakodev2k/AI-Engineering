# Backup and Disaster Recovery

## Purpose
Design Azure recovery capabilities that meet explicit recovery-time and recovery-point objectives and are proven through exercises.

## When to use
Use for production workloads, regional resilience planning, backup design, business-continuity reviews, and recovery failures.

## Inputs
Criticality, RTO, RPO, data stores, regions, dependencies, corruption scenarios, legal retention, and business recovery priorities.

## Context to inspect
Inspect Azure Backup, Recovery Services vaults, resource-native backups, replication, geo-redundancy, Site Recovery, soft delete, immutable options, restore procedures, and dependency topology.

## Core knowledge
High availability, replication, and backup solve different failures. Replication can copy corruption; backup can meet data recovery but not service RTO. Recovery must include identity, networking, DNS, secrets, configuration, and dependent services.

## Procedure
1. Define workload-specific RTO and RPO with business owners.
2. Enumerate failure scenarios: deletion, corruption, zone loss, region loss, credential compromise, and dependency outage.
3. Map each stateful component to backup/replication capabilities.
4. Design retention and immutability based on risk and regulation.
5. Define regional failover architecture where required.
6. Automate infrastructure recreation and configuration recovery.
7. Write ordered recovery procedures with decision authority.
8. Restore data into isolated test targets.
9. Conduct partial and full recovery exercises.
10. Measure actual RTO/RPO and close gaps.

## Decision points
Use active-active only when business value justifies complexity and consistency trade-offs. Choose geo replication for availability where appropriate, but retain independent backups for corruption/deletion recovery.

## Common failure patterns
Backup without restore tests, replication mistaken for backup, undocumented DNS failover, missing secrets/identity recovery, impossible RTO assumptions, and backups accessible by the same compromised identities.

## Verification
Perform real restores and failover exercises, measure recovery time and recovered data point, verify application integrity, and document discrepancies from targets.

## Expected output
A tested Azure recovery design with RTO/RPO evidence, protected backups, failover procedures, dependencies, and owners.

## Stop conditions
Stop when business recovery objectives are undefined, destructive failover lacks authorization, or recovery testing cannot be isolated safely.