# Database Observability

## Purpose
Build telemetry that reveals database health, workload behavior, dependencies, and emerging reliability risks.

## When to use
Use when onboarding databases, improving incident detection, or investigating blind spots.

## Inputs
Database engine, workload classes, SLOs, query telemetry, infrastructure metrics, logs, and tracing capabilities.

## Context to inspect
Existing dashboards, metric cardinality, retention, slow-query data, lock metrics, replication, storage, and application traces.

## Core knowledge
Useful observability combines symptoms and causes: latency, errors, saturation, throughput, waits, locks, query plans, replication, and resource pressure.

## Procedure
1. Start from user-facing SLIs.
2. Instrument latency, errors, throughput, and saturation.
3. Add engine-specific waits, locks, cache, storage, and replication signals.
4. Capture slow and expensive query fingerprints safely.
5. Correlate application traces with database operations.
6. Build workload and topology dashboards.
7. Set actionable alerts tied to runbooks.
8. Validate telemetry during controlled faults.

## Decision points
Collect detailed query data only with privacy and overhead controls. Prefer high-signal alerts over exhaustive thresholding.

## Common failure patterns
Dashboard-only observability, missing query context, excessive cardinality, noisy alerts, sensitive SQL capture, and no retention for incident analysis.

## Verification
Trigger representative failures and confirm detection, diagnosis paths, trace correlation, and alert routing.

## Expected output
Operational dashboards, alerts, query telemetry, trace correlation, and documented signal ownership.

## Stop conditions
Escalate when telemetry collection threatens performance, exposes sensitive data, or cannot access required engine signals.