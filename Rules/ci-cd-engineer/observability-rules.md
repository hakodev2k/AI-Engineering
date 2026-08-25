# Pipeline Observability Rules

## Purpose
Make delivery behavior diagnosable and measurable without leaking sensitive data.

## Scope
Pipeline logs, metrics, traces, events, dashboards, and deployment markers.

## MUST
- Pipeline runs MUST record revision, artifact identity, stage outcomes, duration, and failure location.
- Production deployments MUST emit an observable deployment event correlated with service telemetry.
- Logs MUST preserve actionable diagnostics while redacting secrets and sensitive tokens.
- Delivery reliability metrics MUST distinguish infrastructure, test, and deployment failures where practical.
- Monitoring gaps affecting release safety MUST be visible before production execution.

## MUST NOT
- MUST NOT log secret values for debugging.
- MUST NOT report success when required deployment or verification failed.
- MUST NOT claim root cause without supporting evidence.

## SHOULD
- Track lead time, deployment frequency, failure rate, recovery time, queue time, and flaky-job trends where useful.

## Exceptions
Reduced telemetry requires documented constraint, alternative evidence, and owner.

## Verification
Inspect structured logs, dashboards, deployment markers, redaction tests, metric definitions, and incident traces from representative failed runs.