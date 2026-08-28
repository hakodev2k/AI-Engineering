# Observability and Diagnostics

## Purpose
Build an Oracle observability practice using wait events, sessions, SQL metrics, AWR/ASH/ADDM where licensed, alert logs, and OS/storage evidence.

## When to use
Use for performance baselines, health monitoring, capacity planning, incidents, and post-change validation.

## Inputs
Monitoring access, licensing constraints, performance objectives, database/host metrics, diagnostic logs.

## Context to inspect
DB time, wait classes/events, top SQL, ASH/session state, system statistics, alert log, listener, Data Guard/RAC metrics, storage and host CPU/memory.

## Core knowledge
Oracle diagnostics are most useful when correlated by time and workload. Ratios without demand context can mislead; DB time and wait decomposition provide stronger investigation anchors.

## Procedure
1. Define user-facing SLIs and database SLO-supporting metrics.
2. Capture baseline DB time, load, latency, throughput, and waits.
3. Track top SQL and plan changes.
4. Monitor sessions, blocking, resource limits, FRA/tablespace capacity, and backup health.
5. Integrate alert log and ORA error detection.
6. Correlate DB metrics with OS, storage, and application telemetry.
7. Set alerts on actionable symptoms and capacity thresholds.
8. Preserve incident-window evidence before it ages out.
9. Review diagnostic-feature licensing before enabling/reporting.

## Decision points
Use AWR/ASH when licensed and justified; otherwise rely on supported dynamic views, Statspack, and external telemetry. Alert on service impact rather than every internal fluctuation.

## Common failure patterns
Monitoring only CPU, alert floods, missing plan history, ignoring host/storage context, and unlicensed diagnostic-pack usage.

## Verification
Simulate known faults/thresholds and confirm telemetry identifies the affected workload and time window.

## Expected output
An actionable monitoring and diagnostic baseline with runbook links.

## Stop conditions
Stop when monitoring design would violate licensing or expose sensitive SQL/bind data without controls.