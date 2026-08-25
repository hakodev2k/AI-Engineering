# Observability and Diagnostics Rules
## Purpose
Ensure database performance conclusions are grounded in correlated operational evidence.
## Scope
Metrics, logs, traces, waits, query telemetry, and diagnostic captures.
## MUST
- Correlate database signals with application latency, workload rate, host resources, and relevant dependency behavior.
- Preserve timestamps and identifiers needed to align evidence across layers.
- Define monitoring for critical query latency, resource saturation, errors, and queueing.
## MUST NOT
- Diagnose production performance from a single dashboard signal in isolation.
- Enable high-overhead diagnostics in production without assessing impact and authorization.
## SHOULD
- Maintain low-overhead continuous telemetry sufficient for retrospective investigation.
## Exceptions
High-detail captures may be temporarily enabled under an approved diagnostic window.
## Verification
Inspect dashboards, metric definitions, trace correlation, diagnostic settings, retention, and incident evidence.