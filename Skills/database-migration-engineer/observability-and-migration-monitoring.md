# Migration Observability and Monitoring

## Purpose
Make migration progress, correctness, capacity, and failure states visible enough for safe operational decisions.

## When to use
Use throughout rehearsals, bulk transfer, synchronization, cutover, and post-cutover stabilization.

## Inputs
Migration stages, SLOs, replication metrics, database telemetry, pipeline logs, reconciliation results, and alerting infrastructure.

## Core knowledge
Migration monitoring must cover both pipeline health and database health. Progress without correctness is insufficient; database health without pipeline visibility can hide stalled work.

## Procedure
1. Define stage-specific health indicators.
2. Instrument rows/bytes processed, throughput, errors, retries, checkpoints, and ETA.
3. Monitor replication lag and positions.
4. Monitor source/target CPU, memory, I/O, storage, locks, connections, and log growth.
5. Surface reconciliation status separately from transfer success.
6. Correlate events with migration runbook steps.
7. Define actionable alerts and escalation thresholds.
8. Build cutover dashboards before rehearsal.
9. Retain logs for forensic analysis.
10. Validate dashboards by injecting safe failure conditions.

## Decision points
Alert on symptoms tied to action, not every metric deviation. Increase telemetry detail around high-risk stages rather than permanently maximizing cardinality.

## Common failure patterns
No checkpoint visibility, log-only monitoring, missing source impact metrics, and alerts without owners.

## Verification
Operators can detect, locate, and classify simulated migration failures from telemetry alone.

## Expected output
Operational dashboards, alerts, correlated logs, and measurable readiness gates.

## Stop conditions
Stop high-risk migration stages when critical health or correctness signals are unavailable.