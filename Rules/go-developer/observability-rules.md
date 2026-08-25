# Observability Rules

## Purpose
Make production behavior diagnosable through useful telemetry.

## Scope
Logs, metrics, traces, correlation, instrumentation, and telemetry cost.

## MUST
- Critical request and background paths MUST expose enough telemetry to distinguish success, failure, latency, and saturation.
- Structured logs MUST carry stable contextual fields where useful.
- Metrics MUST have bounded cardinality.
- Trace/context propagation MUST cross supported service boundaries.
- Sensitive data MUST be excluded or safely redacted.

## MUST NOT
- MUST NOT use unbounded identifiers as metric labels.
- MUST NOT log secrets or full sensitive payloads.
- MUST NOT rely on logs alone when metrics or traces are required to establish system state.

## SHOULD
- Instrument user-visible latency and dependency latency separately.
- Correlate errors with request/trace identifiers without exposing credentials.

## Exceptions
Reduced telemetry requires documented cost/privacy rationale and an alternate diagnostic path.

## Verification
Inspect dashboards, sample logs/traces, cardinality, redaction tests, and failure-path telemetry in staging or equivalent environments.