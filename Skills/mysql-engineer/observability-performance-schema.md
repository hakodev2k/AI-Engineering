# Observability and Performance Schema

## Purpose
Instrument MySQL so operators can explain workload behavior, saturation, waits, and regressions.

## When to use
Use when establishing monitoring, debugging production, or improving database SLOs.

## Inputs
SLOs, topology, workload, metrics platform, Performance Schema/sys availability, log configuration.

## Context to inspect
Connection usage, statement digests, waits, locks, replication, buffer pool, redo, temp tables, errors, disk and host metrics.

## Core knowledge
Useful observability correlates database internals with application symptoms. Performance Schema offers structured wait/statement evidence but consumers/instruments should be enabled deliberately.

## Procedure
1. Define user-visible database indicators and SLOs.
2. Collect core availability, latency, throughput, error, saturation, replication, and resource metrics.
3. Enable required Performance Schema instruments/consumers.
4. Use statement digests to identify workload leaders.
5. Capture slow queries with privacy-aware thresholds.
6. Build dashboards by instance and workload role.
7. Alert on actionable symptoms, not noisy single metrics.
8. Link alerts to runbooks and diagnostic queries.
9. Validate during load tests and incidents.
10. Periodically remove low-value telemetry.

## Decision points
Sample expensive/high-volume telemetry when full capture adds excessive overhead. Alert on lag only when it threatens freshness or recovery objectives.

## Common failure patterns
Monitoring only CPU, high-cardinality labels, logging sensitive parameters, alerting without runbooks, and collecting metrics never used in decisions.

## Verification
Induce known load/failure conditions and prove dashboards and alerts identify the cause within operational targets.

## Expected output
Database observability baseline, dashboards, alerts, and diagnostic runbooks.

## Stop conditions
Stop if telemetry exposes sensitive data, overhead becomes material, or instrumentation changes require production approval.