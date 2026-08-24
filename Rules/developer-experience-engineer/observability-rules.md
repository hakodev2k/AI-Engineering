# Developer Tool Observability Rules
## Purpose
Make developer-platform behavior diagnosable without exposing sensitive information.
## Scope
Logs, metrics, traces, events, dashboards, alerts, and correlation identifiers.
## MUST
- Critical workflows MUST expose enough signals to distinguish user error, tool defect, and dependency failure.
- Telemetry MUST use stable semantics and bounded cardinality where applicable.
- Logs and traces MUST redact secrets and sensitive content.
- Alerts MUST map to actionable developer or service impact with an owner.
## MUST NOT
- MUST NOT log full credentials, authorization headers, private keys, or sensitive source content.
- MUST NOT rely on logs alone when metrics or traces are necessary to diagnose distributed latency or failure.
- MUST NOT create noisy alerts without an actionable response.
## SHOULD
- Correlation identifiers SHOULD connect local, CI, and service-side evidence where privacy permits.
- Dashboards SHOULD emphasize user journeys and service objectives.
## Exceptions
Additional sensitive diagnostics require bounded scope, explicit approval, secure access, retention limits, and cleanup.
## Verification
Inspect telemetry schemas and samples, redaction tests, cardinality, dashboards, alerts, trace continuity, and incident diagnostic effectiveness.