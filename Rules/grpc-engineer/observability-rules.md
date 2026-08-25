# Observability Rules

## Purpose
Make RPC latency, failures, dependencies, and saturation diagnosable from production evidence.

## Scope
Metrics, logs, distributed traces, correlation, dashboards, and telemetry cardinality.

## MUST
- Services MUST expose request rate, status distribution, latency, and saturation signals appropriate to their workload.
- Distributed context MUST propagate across RPC boundaries where tracing is enabled.
- Logs MUST include stable correlation context without sensitive payloads.
- Telemetry MUST distinguish client-side from server-side failures when operationally relevant.
- Cardinality MUST be bounded.

## MUST NOT
- MUST NOT place user IDs, request payloads, tokens, or unbounded values into metric labels.
- MUST NOT claim a production root cause without supporting evidence.
- MUST NOT sample away all evidence for critical failures.

## SHOULD
- Dashboards SHOULD align with service-level objectives and dependency boundaries.
- Traces SHOULD capture retries and downstream timing.

## Exceptions
Sensitive diagnostic capture requires explicit authorization, minimization, retention controls, and secure access.

## Verification
Inspect metric dimensions, sample traces/logs, correlation continuity, redaction, dashboards, and telemetry behavior under load.