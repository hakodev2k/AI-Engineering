# Observability Rules

## Purpose
Make AI infrastructure behavior diagnosable from evidence rather than assumption.

## Scope
Applies to metrics, logs, traces, events, hardware telemetry, workload metadata, and dashboards.

## MUST
- Critical infrastructure MUST expose health, saturation, error, latency, and capacity signals.
- Telemetry MUST correlate workload identity, model or job identity, node, and failure domain where practical.
- Alerts MUST map to actionable conditions with documented ownership.
- Production conclusions MUST use available operational evidence.

## MUST NOT
- MUST NOT log secrets, credentials, or unnecessarily sensitive model or user data.
- MUST NOT alert only on host uptime while ignoring accelerator and workload health.
- MUST NOT declare an incident resolved without verifying relevant service signals.

## SHOULD
- High-cardinality telemetry SHOULD be controlled intentionally.
- Dashboards SHOULD expose both infrastructure and workload perspectives.

## Exceptions
Exceptions require observability gap documentation, compensating evidence, risk, and owner approval.

## Verification
Review dashboards, alert rules, telemetry schemas, sampling, redaction, retention, incident evidence, and ownership metadata.