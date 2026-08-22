# Database Observability and Monitoring

## Purpose
Build actionable visibility into database health, workload behavior, saturation, failures, and user-impacting latency.

## When to use
Use when establishing production monitoring, defining SLO support, investigating blind spots, or onboarding a new database service.

## Inputs
Database topology, workload objectives, engine metrics, query telemetry, logs, traces, alerting platform, and incident history.

## Context to inspect
Inspect current dashboards, metric retention, query capture, wait statistics, connection pools, replication, storage, backups, and alert quality.

## Core knowledge
Useful monitoring connects database signals to service impact. Golden signals include latency, traffic, errors, and saturation, augmented by engine-specific waits, locks, replication, storage, and maintenance health.

## Procedure
1. Define service-impacting database indicators.
2. Capture query latency and throughput distributions.
3. Monitor CPU, memory, IO, storage, connections, and queueing.
4. Capture blocking, deadlocks, transaction duration, and waits.
5. Monitor replication, backups, jobs, and maintenance.
6. Correlate database telemetry with application traces where possible.
7. Create dashboards for normal operation and incident diagnosis.
8. Set alerts on symptoms and actionable thresholds.
9. Tune noisy alerts using incident evidence.
10. Periodically review telemetry gaps.

## Decision points
Alert on user-impacting symptoms when possible; use low-level metrics as diagnostic signals or capacity warnings rather than paging for every anomaly.

## Common failure patterns
Average-only latency, dashboards without ownership, alerting on every high CPU sample, missing query context, and short telemetry retention.

## Verification
Run controlled load or failure tests and confirm expected metrics, traces, dashboards, and alerts appear with usable context.

## Expected output
A production monitoring baseline with actionable alerts and diagnostic dashboards.

## Stop conditions
Escalate when required telemetry cannot be collected without unacceptable overhead or security exposure.