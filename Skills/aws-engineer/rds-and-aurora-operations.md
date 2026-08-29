# RDS and Aurora Operations

## Purpose
Design and operate relational databases on AWS for availability, durability, performance, security, and recoverability.

## When to use
Use for RDS/Aurora provisioning, scaling, failover, slow queries, backup design, or production incident response.

## Inputs
Engine/version, workload profile, storage growth, RPO/RTO, connection count, latency, read/write ratio, compliance.

## Context to inspect
Instance classes, parameter groups, Multi-AZ topology, replicas, Performance Insights, Enhanced Monitoring, backups, KMS, security groups, connection pools.

## Core knowledge
Managed databases still require schema/index/query engineering. Multi-AZ improves availability but not all read scaling. Connection storms and poor queries commonly dominate incidents.

## Procedure
1. Establish workload and recovery objectives.
2. Select engine and topology based on compatibility and operational needs.
3. Size compute/storage from measured baselines.
4. Configure backups and retention; test point-in-time restore.
5. Enable performance telemetry.
6. Review indexes, query plans, locking, and connection behavior.
7. Configure failover-aware clients and sane timeouts.
8. Use proxies/pooling where connection churn warrants it.
9. Plan version upgrades and parameter changes with rollback.

## Decision points
Use Aurora for features/scaling that justify engine differences; standard RDS when compatibility and simplicity dominate. Add read replicas only for read workloads that can tolerate replication lag.

## Common failure patterns
Treating replicas as HA without client logic, no restore tests, oversized connection pools, parameter changes without benchmarks, and scaling hardware before fixing queries.

## Verification
Perform restore and failover tests, benchmark critical queries, and confirm client recovery behavior.

## Expected output
Database topology, performance plan, backup/restore evidence, and operational runbook.

## Stop conditions
Escalate before destructive migrations, major-version upgrades without compatibility evidence, or actions that risk unrecoverable data loss.