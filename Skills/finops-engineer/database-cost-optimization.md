# Database Cost Optimization

## Purpose
Optimize managed and self-hosted database spend while protecting latency, throughput, durability, recovery, and data integrity.

## When to use
Use when database cost is material, provisioned capacity is underused, replicas are excessive, storage grows rapidly, or premium features are poorly utilized.

## Inputs
Billing, database topology, CPU/memory/IO metrics, query load, storage growth, replica usage, backup retention, HA/DR requirements, licensing.

## Context to inspect
Inspect instance/serverless sizing, provisioned IOPS/throughput, read replicas, multi-zone HA, backups, retention, storage tier, licenses, idle environments, and query inefficiency.

## Core knowledge
Database cost often reflects workload inefficiency as much as resource size. Rightsizing without query/index analysis can create performance regressions. HA and DR capacity is not waste when required.

## Procedure
1. Decompose cost by compute, storage, IO, backup, licensing, and replication.
2. Confirm SLO, RPO, and RTO requirements.
3. Analyze utilization and saturation across business cycles.
4. Identify idle replicas/environments and overprovisioned capacity.
5. Correlate expensive capacity with query workload and indexing behavior.
6. Evaluate shape changes, autoscaling/serverless, scheduling, storage tuning, and retention changes.
7. Model failure-mode capacity before downsizing.
8. Test representative workloads.
9. Deploy gradually and monitor database health.
10. Confirm realized savings.

## Decision points
Optimize workload/query behavior before shrinking saturated databases. Preserve replicas required for HA, DR, or read scaling. Serverless is useful when idle periods outweigh scaling premiums and latency constraints allow it.

## Common failure patterns
Treating standby replicas as waste, reducing storage performance without IO evidence, ignoring licensing, and downsizing based on average CPU alone.

## Verification
Load tests and production metrics satisfy SLOs; failover requirements remain achievable; billing confirms savings; no increase in errors or saturation.

## Expected output
A database cost decomposition, optimization plan, risk assessment, and verified savings.

## Stop conditions
Escalate when changes affect RPO/RTO, destructive retention, or unsupported production capacity assumptions.