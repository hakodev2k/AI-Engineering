# Cloud Storage and Data Services

## Purpose
Select and configure managed storage and database services based on access patterns, durability, consistency, scale, and operations.

## When to use
Use when introducing or reviewing object, block, file, relational, NoSQL, cache, or managed database services.

## Inputs
Data model, access patterns, volume, throughput, latency, retention, consistency, RPO/RTO, compliance.

## Context to inspect
Current schemas, storage tiers, encryption, replication, backups, lifecycle rules, indexes, network exposure, quotas.

## Core knowledge
Choose data services from workload requirements rather than familiarity. Durability is not backup; replication is not necessarily disaster recovery.

## Procedure
1. Classify data and access patterns.
2. Quantify capacity, throughput, latency, and growth.
3. Define consistency and transaction requirements.
4. Set durability, backup, retention, and recovery objectives.
5. Compare managed service capabilities and constraints.
6. Design partitioning, indexing, and lifecycle policies.
7. Restrict network and identity access.
8. Enable encryption and auditability.
9. Benchmark representative workloads.
10. Test restore and failover.

## Decision points
Use relational stores for strong relational/transactional needs; choose specialized stores only when their access model provides clear value.

## Common failure patterns
Service selection by trend, hot partitions, untested backups, public endpoints, excessive retention, and treating cache as durable state.

## Verification
Measure real query patterns and perform recovery tests against stated RPO/RTO.

## Expected output
A justified data-service design with operational controls.

## Stop conditions
Escalate unclear data ownership, residency constraints, or recovery requirements.