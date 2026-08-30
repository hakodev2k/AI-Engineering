# Cloud SQL and AlloyDB Operations

## Purpose
Choose and operate managed relational databases with correct sizing, HA, connectivity, backup, maintenance, and performance practices.

## When to use
Use for new relational workloads, migrations, scaling reviews, HA design, or production database incidents.

## Inputs
Engine requirements, workload profile, dataset size, connection count, latency target, RPO/RTO, and regional constraints.

## Context to inspect
Instance tier, HA mode, flags, storage, backups, PITR, replicas, connection path, maintenance window, query metrics, and failover history.

## Core knowledge
Managed databases remove host administration but not schema, query, connection, capacity, and failover responsibilities. Connection storms can dominate serverless architectures.

## Procedure
1. Establish workload and durability requirements.
2. Choose Cloud SQL or AlloyDB based on engine and performance needs.
3. Select regional HA when required.
4. Use private connectivity where practical.
5. Configure backups and PITR to business RPO.
6. Size connections and deploy pooling.
7. Monitor CPU, memory, storage, locks, and query latency.
8. Tune queries and indexes before oversized scaling.
9. Rehearse failover and restore.
10. Plan maintenance and major-version upgrades.

## Decision points
Use replicas for read scaling and recovery options, not as a substitute for query optimization. Choose AlloyDB when PostgreSQL-compatible high-throughput requirements justify it.

## Common failure patterns
Too many connections, no restore testing, public exposure, silent storage growth, and scaling hardware around poor queries.

## Verification
Perform restore tests, connection saturation tests, failover rehearsal, and query-plan review.

## Expected output
A resilient managed-database operating model.

## Stop conditions
Stop before destructive upgrades or migrations without rollback and validated backups.