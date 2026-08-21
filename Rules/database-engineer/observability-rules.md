# Observability Rules
## Purpose
Make database health, workload behavior, and failures diagnosable.
## Scope
Metrics, logs, waits, traces, query telemetry, dashboards, and alerts.
## MUST
- Monitor availability, latency, errors, saturation, storage, connections, waits, replication, and backup health as relevant.
- Preserve enough query and operational evidence to investigate material regressions without exposing sensitive values.
- Tie alerts to actionable conditions and ownership.
## MUST NOT
- Enable verbose diagnostics in production indefinitely without assessing cost and sensitive-data exposure.
- Treat a single aggregate metric as sufficient evidence for root cause.
## SHOULD
- Correlate database telemetry with application and infrastructure signals.
## Exceptions
Telemetry gaps require documented limitation and alternative evidence.
## Verification
Inspect dashboards, alert routes, retention, sampling, redaction, traces, and incident investigations.