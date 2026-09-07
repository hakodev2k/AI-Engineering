# Observability Rules

## Purpose
Make correctness, performance, saturation, and failure states diagnosable.

## Scope
Metrics, logs, traces, dashboards, alerts, and database-specific telemetry.

## MUST
- Systems MUST expose replication lag, error rates, latency percentiles, capacity, storage growth, connection pressure, and partition health where applicable.
- Alerts MUST correspond to actionable user or system risk and include diagnostic context.
- Correlation identifiers or equivalent context MUST allow tracing critical operations across distributed components.
- Telemetry retention MUST support incident investigation needs.

## MUST NOT
- MUST NOT rely on node-up status as evidence of database health.
- MUST NOT log sensitive values unnecessarily.
- MUST NOT create alerts with no defined response owner or action.

## SHOULD
- Dashboards SHOULD emphasize service-level symptoms before low-level causes.

## Exceptions
Missing telemetry requires documented risk, alternative evidence, and remediation plan.

## Verification
Inspect dashboards, alert tests, incident traces, log redaction, and telemetry coverage against failure scenarios.