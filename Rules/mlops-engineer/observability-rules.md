# MLOps Observability Rules

## Purpose
Provide evidence to diagnose pipeline, serving, data, and model behavior across the ML lifecycle.

## Scope
Covers logs, metrics, traces, events, dashboards, and correlation metadata for ML platforms.

## MUST
- Telemetry MUST identify environment, service/pipeline, execution or request correlation, and model/artifact version where relevant.
- Critical paths MUST expose latency, throughput, errors, resource saturation, and dependency health.
- Pipeline telemetry MUST distinguish queued, running, retrying, failed, canceled, and completed states.
- Logs MUST preserve diagnostic context without leaking secrets or sensitive data.
- Alerting MUST map to actionable symptoms with an owner and runbook or response guidance.

## MUST NOT
- High-cardinality labels MUST NOT be introduced without cost and reliability assessment.
- Successful HTTP/process status MUST NOT be used as the sole model-health signal.

## SHOULD
- Distributed traces SHOULD connect gateway, feature, model-serving, and dependency spans where operationally valuable.
- SLO dashboards SHOULD separate service reliability from model-quality indicators.

## Exceptions
Telemetry reductions require documented cost/privacy rationale and compensating diagnostic evidence.

## Verification
Inspect dashboards, metric dimensions, traces, sample logs, alert routes, retention, redaction, and incident investigations. Confirm a deployed model version can be correlated through relevant telemetry.