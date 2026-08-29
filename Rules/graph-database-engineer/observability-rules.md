# Observability Rules

## Purpose
Make graph database behavior diagnosable from production evidence.

## Scope
Metrics, logs, traces, query telemetry, dashboards, alerts, and diagnostic data.

## MUST
- Monitor availability, latency, throughput, errors, resource saturation, storage growth, replication, and transaction health.
- Capture slow or expensive query evidence with sufficient context to reproduce the workload without leaking sensitive values.
- Correlate application requests with database operations where the platform permits.
- Define actionable alerts tied to user or service impact.

## MUST NOT
- Log credentials, tokens, or unrestricted sensitive query parameters.
- Alert solely on noisy low-level metrics without an operational response.
- Diagnose production performance from a single metric in isolation.

## SHOULD
- Track query fingerprints separately from parameter values.
- Preserve historical baselines for capacity and regression analysis.

## Exceptions
Reduced telemetry for privacy or cost reasons requires documented diagnostic impact and alternative evidence sources.

## Verification
Inspect dashboards, alert tests, log redaction, trace samples, query telemetry, retention, and incident records. Confirm operators can identify a slow query, saturation condition, replication problem, and failed transaction path from available evidence.