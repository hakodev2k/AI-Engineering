# Policy Observability Rules

## Purpose
Make policy evaluation health, decision behavior, and control regressions observable in production.

## Scope
Applies to metrics, logs, traces, dashboards, alerts, decision telemetry, evaluator health, and policy distribution status.

## MUST
- Production policy systems MUST expose evaluation latency, error rate, availability, and policy-version distribution for critical enforcement paths.
- Telemetry MUST distinguish deny decisions from evaluator failures and enforcement failures.
- Changes in allow/deny/indeterminate rates for material controls MUST be observable at a useful aggregation level.
- Policy distribution failures and version skew beyond defined tolerance MUST be detectable.
- Alerts MUST map to an actionable condition and an accountable response path.
- Sensitive policy inputs and secrets MUST be redacted or excluded from telemetry.

## MUST NOT
- A healthy policy engine process MUST NOT be treated as proof that enforcement points are applying current policy successfully.
- High-cardinality or sensitive input values MUST NOT be logged indiscriminately.
- Alert thresholds MUST NOT be changed merely to hide unresolved control failures.

## SHOULD
- Traces SHOULD correlate policy evaluation with the calling request or deployment when privacy permits.
- Dashboards SHOULD expose decision trends by policy domain and version rather than only infrastructure health.

## Exceptions
Observability reductions require documented platform or privacy constraints, alternative evidence, risk, and approval for critical control paths.

## Verification
Inspect dashboards, metrics, traces, redaction behavior, alert tests, version-skew detection, and incident evidence. Inject representative evaluation and distribution failures to confirm they are distinguishable and actionable.