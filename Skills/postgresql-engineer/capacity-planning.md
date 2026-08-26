# Capacity Planning

## Purpose
Forecast PostgreSQL compute, memory, storage, WAL, connection, and maintenance capacity before growth becomes an incident.

## When to use
Use for growth planning, launches, infrastructure sizing, retention changes, or recurring saturation.

## Inputs
Historical metrics, growth forecasts, workload mix, SLOs, topology, storage/compute constraints.

## Context to inspect
Database/table/index growth, WAL rate, backup size/time, CPU, memory, IOPS/latency, connections, replication lag and vacuum duration.

## Core knowledge
Capacity includes headroom for bursts, maintenance, failover and recovery—not average utilization alone. Storage exhaustion can cascade through WAL, vacuum, replication and backups.

## Procedure
1. Establish current utilization and peak envelopes.
2. Segment growth by data, indexes, WAL and backups.
3. Model transaction/query growth separately from storage growth.
4. Identify hard platform limits.
5. Reserve failover and maintenance headroom.
6. Forecast multiple growth scenarios.
7. Load-test the next meaningful scale point.
8. Define scale-up/out triggers.
9. Track forecast error over time.
10. Revisit after major workload changes.

## Decision points
Scale vertically while it remains operationally simple and cost-effective; introduce partitioning/read scaling/topology changes only when bottlenecks justify them.

## Common failure patterns
Planning from averages, ignoring indexes/WAL, no failover headroom, assuming linear query cost, buying capacity instead of fixing pathological SQL.

## Verification
Back-test forecasts against historical growth and validate target scale with representative load.

## Expected output
Capacity model, thresholds, risk horizon and scaling actions.

## Stop conditions
Escalate when forecasted demand exceeds platform limits or business growth assumptions are unavailable.