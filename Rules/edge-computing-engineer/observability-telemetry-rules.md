# Observability and Telemetry
## Purpose
Make remote, distributed edge failures diagnosable without overwhelming constrained links.
## Scope
Logs, metrics, traces, events, and fleet health.
## MUST
- Critical services MUST expose health, resource, error, update, connectivity, and version signals.
- Telemetry MUST support correlation across node and cloud boundaries.
- Sensitive values MUST be redacted before collection or export.
## MUST NOT
- MUST NOT depend on continuous telemetry delivery for local correctness.
- MUST NOT generate unbounded telemetry during failure storms.
## SHOULD
- Telemetry SHOULD be buffered, sampled, prioritized, and compressed according to operational value.
## Exceptions
Reduced telemetry requires alternative evidence sufficient to diagnose critical failures.
## Verification
Inspect dashboards, schemas, redaction tests, disconnect buffering, cardinality, rate limits, and incident drills.