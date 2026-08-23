# Observability Rules

## Purpose
Provide evidence for understanding distributed behavior across service boundaries.

## Scope
Logs, metrics, traces, correlation identifiers, and dependency telemetry.

## MUST
- Critical requests MUST be traceable across service and queue boundaries where technically feasible.
- Telemetry MUST expose latency, errors, saturation, retries, queue lag, and dependency health for critical paths.
- Correlation identifiers MUST propagate without carrying secrets.

## MUST NOT
- MUST NOT log credentials, tokens, or unnecessary sensitive payloads.
- MUST NOT claim root cause from a single telemetry signal when distributed evidence is available.

## SHOULD
- Dashboards SHOULD align with service objectives and known failure modes.

## Exceptions
Missing telemetry on a critical path requires documented limitations and compensating evidence.

## Verification
Inspect traces, metrics, logs, alert tests, cardinality controls, and incident investigation evidence.