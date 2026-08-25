# Observability Rules
## Purpose
Make PostgreSQL health, workload, and failure modes diagnosable.
## Scope
Metrics, logs, wait events, query statistics, replication, storage, and alerts.
## MUST
- Monitor availability, latency, errors, saturation, connections, locks, replication, storage, and transaction age for production-critical databases.
- Correlate database signals with application and infrastructure evidence during incidents.
- Protect sensitive values in query/log telemetry.
## MUST NOT
- Base production conclusions on a single metric or instantaneous snapshot when historical evidence exists.
## SHOULD
- Alert on actionable symptoms tied to service impact or imminent database risk.
## Exceptions
Reduced telemetry requires documented privacy/cost rationale and compensating diagnostics.
## Verification
Review dashboards, alert tests, log configuration, metric coverage, retention, and incident evidence.