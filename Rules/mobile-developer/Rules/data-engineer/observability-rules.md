# Observability Rules
## Purpose
Make pipeline health, freshness, failures, and data movement diagnosable.
## Scope
Jobs, streams, storage, orchestration, and published datasets.
## MUST
- Critical pipelines MUST expose runtime, failure, freshness, lag, and volume signals where relevant.
- Logs and metrics MUST identify the failing stage and execution context without exposing sensitive data.
- Alerts MUST correspond to actionable conditions and clear ownership.
## MUST NOT
- MUST NOT declare a pipeline healthy solely because the scheduler reports success.
- MUST NOT log raw secrets or unnecessary sensitive records.
## SHOULD
- Prefer end-to-end freshness and reconciliation signals in addition to infrastructure metrics.
## Exceptions
Low-risk pipelines may use lighter telemetry when support expectations are explicit.
## Verification
Inspect dashboards, alerts, logs, traces, freshness checks, and incident evidence.