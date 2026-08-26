# Data Quality Observability and Monitoring Rules
## Purpose
Make data health continuously visible and diagnosable.
## Scope
Metrics, dashboards, logs, alerts, trends, and quality SLIs.
## MUST
- Critical quality dimensions MUST expose measurable signals with ownership and alert routing.
- Monitoring MUST distinguish no-data, stale-data, test-failure, and infrastructure-failure states.
- Alerts MUST contain enough context to locate affected dataset, window, rule, and severity.
## MUST NOT
- MUST NOT treat pipeline success as equivalent to data correctness.
- MUST NOT emit sensitive record contents into general-purpose telemetry.
## SHOULD
- Dashboards SHOULD show trends, baselines, breaches, and unresolved incidents.
## Exceptions
Low-risk datasets may use periodic checks when detection latency is acceptable and documented.
## Verification
Inspect telemetry, alert payloads, dashboards, routing, redaction, and simulated failures.