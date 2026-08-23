# Azure SQL and Managed Databases

## Purpose
Provision and operate Azure managed relational databases with appropriate availability, performance, security, and recovery controls.

## When to use
Use for Azure SQL Database, Managed Instance, managed relational migrations, scaling, connectivity, or database-platform incidents.

## Inputs
Database engine compatibility, workload profile, data size, transaction rate, latency, HA/DR targets, network needs, and maintenance constraints.

## Context to inspect
Inspect service tier, compute model, storage, backups, failover groups, firewall/private endpoints, Entra authentication, auditing, Query Store, metrics, and maintenance configuration.

## Core knowledge
Managed databases remove much infrastructure administration but not schema/query design, capacity planning, access control, or recovery validation. Service tiers and compute models have different latency, scaling, and cost behavior.

## Procedure
1. Characterize workload and compatibility requirements.
2. Select database service and tier from measured requirements.
3. Design authentication using Entra identities where supported.
4. Restrict network access and configure private DNS if needed.
5. Define backup retention and regional recovery strategy.
6. Enable auditing, threat protection where appropriate, and performance telemetry.
7. Baseline CPU, IO, waits, query duration, connections, and storage.
8. Tune schema/index/query issues before scaling blindly.
9. Test failover, restore, connection retry, and application recovery.
10. Review capacity and cost trends periodically.

## Decision points
Scale compute when workload is genuinely resource constrained; optimize queries first when inefficient plans dominate. Choose serverless/elastic models only when workload shape and latency expectations fit their behavior.

## Common failure patterns
Treating managed service as tuning-free, public firewall rules broader than needed, SQL credentials everywhere, no restore testing, scaling around bad queries, and assuming geo replication automatically satisfies RTO/RPO.

## Verification
Restore to a test target, execute failover where applicable, validate application reconnection, review Query Store, and verify unauthorized network/identity access is denied.

## Expected output
A managed database configuration with tested security, performance baseline, backup, and recovery procedures.

## Stop conditions
Stop when migration compatibility is unresolved, data-loss tolerance is unknown, or failover testing could affect production without approval.