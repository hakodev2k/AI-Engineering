# Observability

## Purpose
Make gateway behavior diagnosable without leaking sensitive information or creating uncontrolled telemetry cost.

## Scope
Logs, metrics, traces, correlation, dashboards, and diagnostic metadata.

## MUST
- Gateway telemetry MUST expose request outcome, route/upstream identity, latency, and failure class at useful aggregation levels.
- Distributed tracing MUST preserve correlation across gateway boundaries where supported.
- Sensitive values MUST be redacted or excluded before telemetry emission.
- Operational conclusions MUST use available telemetry evidence rather than agent confidence.

## MUST NOT
- MUST NOT log credentials, authorization tokens, secrets, or unnecessary sensitive payloads.
- MUST NOT use unbounded high-cardinality labels from arbitrary request values.
- MUST NOT suppress failure telemetry merely to reduce alert volume.

## SHOULD
- Telemetry SHOULD distinguish gateway-generated failures from upstream failures.
- Sampling SHOULD retain enough error and tail-latency evidence for investigation.

## Exceptions
Telemetry exceptions require privacy/security review where applicable and documented diagnostic trade-offs.

## Verification
Inspect schemas and redaction, query representative failures, validate trace continuity, review metric cardinality, and test dashboards against injected faults.