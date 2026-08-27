# Observability
## Purpose
Make pipeline health, correctness, and degradation diagnosable.
## Scope
Metrics, logs, traces, dashboards, and alerts.
## MUST
- Production pipelines MUST expose input/output rates, lag, failures, restarts, checkpoint health, and resource saturation where applicable.
- Alerts MUST map to actionable user or system impact and include ownership.
- Logs and traces MUST support correlation across source, processing, and sink boundaries without exposing secrets.
## MUST NOT
- High-cardinality dimensions MUST NOT be introduced without cost and stability review.
## SHOULD
- Correctness indicators such as dropped, late, duplicate, or quarantined events SHOULD be observable.
## Exceptions
Unavailable telemetry requires documented compensating evidence.
## Verification
Exercise failure and overload scenarios and confirm dashboards, alerts, logs, and traces identify the cause and affected scope.