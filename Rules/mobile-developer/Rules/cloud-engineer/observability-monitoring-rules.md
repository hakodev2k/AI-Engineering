# Observability and Monitoring Rules
## Purpose
Provide evidence about cloud workload health and behavior.
## Scope
Metrics, logs, traces, dashboards, alerts, audit signals, and telemetry pipelines.
## MUST
- Critical services MUST expose telemetry sufficient to diagnose availability, latency, errors, saturation, and dependency failures.
- Alerts MUST map to actionable conditions with ownership and response guidance.
- Security-sensitive telemetry MUST preserve auditability while protecting secrets and sensitive data.
## MUST NOT
- MUST NOT rely on dashboards without alerting for conditions requiring timely action.
- MUST NOT log credentials, tokens, private keys, or unnecessary sensitive payloads.
## SHOULD
- Correlate application, infrastructure, and dependency telemetry using stable identifiers.
## Exceptions
Exceptions require documented observability gap, risk, alternative evidence, and remediation plan.
## Verification
Inspect telemetry coverage, alert tests, dashboards, log samples, trace propagation, retention, and incident evidence.