# PostgreSQL Observability

## Purpose
Build actionable database telemetry that reveals saturation, contention, workload changes, and reliability risks before users report them.

## When to use
Use when defining monitoring, SLO support, dashboards, alerts, or incident diagnostics.

## Inputs
Service objectives, topology, workload profile, available metrics/logging/tracing stack.

## Context to inspect
pg_stat views, pg_stat_statements, logs, host/storage metrics, replication, vacuum, connections and backup telemetry.

## Core knowledge
Observe workload, latency, errors and saturation together. High-value signals include query latency/calls, buffer/IO behavior, locks, connection pressure, WAL/replication lag, checkpoints, dead tuples and transaction age.

## Procedure
1. Map database behavior to service SLOs.
2. Enable safe query-level statistics where approved.
3. Collect host and PostgreSQL metrics with stable labels.
4. Configure useful slow-query/error/lock logging.
5. Build dashboards for workload, resources, replication and maintenance.
6. Alert on symptoms and imminent hazards, not every fluctuation.
7. Preserve baselines for comparison.
8. Validate telemetry during load tests/incidents.
9. Control sensitive SQL/parameter exposure.
10. Maintain runbook links from alerts.

## Decision points
Sample or normalize high-cardinality query data when observability cost/privacy outweigh full fidelity.

## Common failure patterns
CPU-only monitoring, noisy threshold alerts, missing query fingerprints, storing sensitive bind values, dashboards without action paths.

## Verification
Inject known load/failure conditions and confirm telemetry identifies the cause with bounded alert noise.

## Expected output
Metric/log specification, dashboards, alerts, runbook references.

## Stop conditions
Escalate if required telemetry would expose sensitive data or impose unacceptable production overhead.