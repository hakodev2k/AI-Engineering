# Observability Rules

## Purpose
Make end-to-end production behavior diagnosable.
## Scope
Logs, metrics, traces, correlation, dashboards, and alerts.
## MUST
- Correlate critical user requests across frontend, API, background, and dependency boundaries where practical.
- Emit structured operational signals for critical failures and service objectives.
- Redact secrets, tokens, and sensitive personal data from telemetry.
## MUST NOT
- Treat logs alone as sufficient observability for distributed critical paths.
- Create alerts with no actionable owner or response expectation.
## SHOULD
- Instrument business-critical journeys as well as infrastructure health.
## Exceptions
High-cardinality or sensitive dimensions require safer aggregation.
## Verification
Trace representative requests end to end and inspect dashboards, alerts, and redaction tests.