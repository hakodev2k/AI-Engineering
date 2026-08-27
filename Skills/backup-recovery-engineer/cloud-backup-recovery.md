# Cloud Backup and Recovery

## Purpose
Engineer recoverable cloud workloads while accounting for managed-service semantics, account boundaries, regions, APIs, quotas, and infrastructure reconstruction.

## When to use
Use for cloud-native systems, migrations, multi-account estates, or regional recovery planning.

## Inputs
Cloud architecture, accounts/subscriptions/projects, regions, managed services, IaC, RTO/RPO, data residency, quotas, and backup services.

## Context to inspect
Inspect provider-native backup capabilities, cross-account copy, region dependencies, service quotas, IAM, KMS, network bootstrap, DNS, and IaC state.

## Core knowledge
Cloud durability is not backup. Managed services have different restore semantics and regional constraints. Recovery often requires rebuilding control-plane resources before restoring data.

## Procedure
1. Inventory stateful and reconstructable cloud resources.
2. Map provider failure domains and account boundaries.
3. Configure service-native backups where they provide consistent recovery.
4. Copy critical backups across required account/region boundaries.
5. Protect IaC, state, secrets, and keys.
6. Pre-plan quotas and network bootstrap for recovery regions.
7. Define clean-account recovery where threat model requires it.
8. Automate infrastructure recreation.
9. Restore and validate representative workloads.
10. Measure regional recovery timing and costs.

## Decision points
Use provider-native services for integration and consistency; third-party tooling may improve portability or centralized governance. Cross-region copies are justified by regional-loss requirements, not convention.

## Common failure patterns
Backups in same compromised account; missing IaC state; unavailable regional KMS keys; quota exhaustion; assuming managed database replication equals backup.

## Verification
Recover into a separate environment using documented identities and validate application behavior, data point, and measured timing.

## Expected output
A cloud recovery design proven beyond a single production account or region where required.

## Stop conditions
Escalate unresolved residency, quota, key, or account-access constraints that make the approved recovery scenario infeasible.