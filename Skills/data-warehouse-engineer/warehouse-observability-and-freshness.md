# Warehouse Observability and Freshness

## Purpose
Make warehouse pipelines diagnosable by exposing freshness, volume, runtime, lineage, quality, and cost signals tied to business impact.

## When to use
Use when operating production analytical pipelines, reducing mean time to detect or recover, or establishing dataset SLAs/SLOs.

## Inputs
Pipeline metadata, scheduler events, query logs, quality results, lineage, consumer criticality, freshness requirements.

## Context to inspect
Current dashboards, alert rules, incident history, ownership metadata, upstream dependencies, and publication schedules.

## Core knowledge
Pipeline success is insufficient evidence that data is healthy. Useful observability connects technical signals to datasets and consumers. Alerts need ownership, severity, context, and actionable thresholds.

## Procedure
1. Identify critical datasets and consumers.
2. Define expected freshness and completion windows.
3. Track ingestion lag, model runtime, row/byte volume, quality results, and query failures.
4. Capture lineage and run identifiers for correlation.
5. Establish baseline distributions and service objectives.
6. Alert on actionable deviations with severity based on consumer impact.
7. Include upstream/downstream context in alerts.
8. Create dashboards for pipeline and dataset health.
9. Record incident outcomes and tune signals.
10. Periodically test alert routing and ownership.

## Decision points
Use hard thresholds for contractual deadlines and invariants; use anomaly detection for variable workloads. Page only for urgent user-impacting failures and route lower-severity issues asynchronously.

## Common failure patterns
Alerting on every failed retry, missing data freshness signals, dashboards without owners, alerts lacking dataset context, and monitoring only infrastructure rather than data outcomes.

## Verification
Simulate stale, failed, and anomalous runs; confirm detection, routing, lineage context, and recovery visibility.

## Expected output
An actionable observability system covering dataset health, pipeline performance, and business-facing freshness.

## Stop conditions
Stop declaring production readiness when critical datasets have no ownership or detectable freshness failure.