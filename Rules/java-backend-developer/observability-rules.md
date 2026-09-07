# Observability Rules

## Purpose
Make production behavior diagnosable without exposing sensitive information or creating uncontrolled telemetry cost.

## Scope
Applies to logs, metrics, traces, correlation, dashboards, and alerts.

## MUST
- Production-critical requests and background work MUST expose enough telemetry to identify failures, latency, saturation, and dependency impact.
- Logs MUST be structured where machine analysis is expected and MUST carry stable correlation identifiers when available.
- Metrics MUST use bounded-cardinality dimensions.
- Telemetry MUST exclude secrets, credentials, and unnecessarily sensitive payloads.
- Alerts MUST correspond to actionable service or user impact, not raw noise alone.

## MUST NOT
- MUST NOT use unbounded identifiers such as user IDs or request IDs as metric labels.
- MUST NOT log entire request/response bodies by default.
- MUST NOT declare an incident cause solely from one signal when corroborating evidence is available.

## SHOULD
- Prefer SLI-oriented dashboards and traces that cross dependency boundaries.
- Record deployment/version context to correlate changes with regressions.

## Exceptions
Temporary high-detail diagnostics require bounded duration, access control, overhead assessment, and sensitive-data review.

## Verification
Inspect dashboards, alert behavior, log samples, trace propagation, cardinality, telemetry costs, redaction tests, and incident diagnostic exercises.