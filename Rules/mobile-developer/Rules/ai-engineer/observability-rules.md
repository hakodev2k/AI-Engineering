# AI Observability Rules
## Purpose
Make production AI behavior diagnosable without leaking sensitive data.
## Scope
Logs, metrics, traces, model metadata, prompts, outputs, retrieval, tools, and evaluation signals.
## MUST
- Record model/provider/version, latency, token usage, error class, and workflow correlation for material calls where permitted.
- Capture retrieval and tool stages sufficiently to diagnose failures.
- Redact secrets and sensitive prompt/output data according to data policy.
- Define alerts for material availability, quality, cost, or safety regressions.
## MUST NOT
- Log full sensitive prompts or outputs by default merely for debugging convenience.
- Treat infrastructure uptime alone as proof of AI feature health.
## SHOULD
- Track sampled quality or user-feedback signals alongside system metrics.
## Exceptions
Diagnostic logging exceptions require bounded duration, access control, purpose, and approval where sensitive data is involved.
## Verification
Inspect telemetry schemas, dashboards, traces, redaction tests, alerts, and retention settings.