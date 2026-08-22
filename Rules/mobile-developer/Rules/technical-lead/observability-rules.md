# Observability Rules
## Purpose
Make production behavior diagnosable with evidence.
## Scope
Logs, metrics, traces, dashboards, alerts, and correlation.
## MUST
- Critical workflows MUST expose signals sufficient to detect failure and investigate cause.
- Logs MUST preserve useful context while excluding secrets and unnecessarily sensitive data.
- Alerts MUST map to actionable conditions with an owner or response path.
## MUST NOT
- Use high-cardinality telemetry without understanding cost and operational impact.
- Treat absence of errors in logs as proof of system health.
## SHOULD
- Correlate requests and asynchronous operations across relevant boundaries.
## Exceptions
Reduced telemetry requires documented constraints and an alternative diagnostic method.
## Verification
Inspect telemetry schemas, dashboards, alert rules, trace correlation, incident investigations, and sensitive-data handling.