# Database Observability

## Purpose
Make database behavior, degradation, and risk diagnosable from production evidence.

## Scope
Metrics, logs, traces, query telemetry, replication health, saturation, and alerting.

## MUST
- Critical databases MUST expose availability, latency, error, saturation, capacity, replication, and backup health signals.
- Alerts MUST map to actionable failure conditions and documented ownership.
- Query telemetry MUST support identification of expensive or regressing workloads without exposing sensitive values.
- Operational conclusions MUST use available evidence rather than agent confidence or assumptions.

## MUST NOT
- MUST NOT log secrets, credentials, authentication tokens, or unnecessary sensitive query parameters.
- MUST NOT alert solely on noisy low-level metrics without user or system impact context.
- MUST NOT disable critical telemetry during incidents to reduce noise without explicit operational approval.

## SHOULD
- Dashboards SHOULD separate symptoms from likely causes.
- Baselines SHOULD distinguish normal periodic load from anomalies.

## Exceptions
Exceptions require rationale, visibility impact, duration, compensating monitoring, and approval.

## Verification
Review dashboards, alert rules, telemetry coverage, redaction settings, incident evidence, and alert effectiveness.