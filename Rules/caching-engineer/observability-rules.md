# Cache Observability

## Purpose
Make cache correctness, efficiency, and failure behavior diagnosable in production.

## Scope
Metrics, logs, traces, dashboards, alerts, and diagnostic metadata.

## MUST
- Production caches MUST expose hit, miss, latency, error, timeout, eviction, memory or capacity, and connection-health signals appropriate to the technology.
- Observability MUST distinguish cache latency from origin latency and client-side queueing where possible.
- Alerts MUST correspond to actionable user or system risk rather than raw metric movement alone.
- Diagnostic data MUST preserve tenant and sensitive-data protections.

## MUST NOT
- High-cardinality raw keys MUST NOT be emitted as unrestricted metric labels.
- Secrets or sensitive values MUST NOT be logged for cache debugging.
- Aggregate hit rate MUST NOT be the sole health indicator.

## SHOULD
- Correlate cache events with request traces and dependency telemetry.
- Track freshness and invalidation lag where consistency matters.

## Exceptions
Document unavailable signals, compensating evidence, and operational impact.

## Verification
Inspect dashboards, alert tests, telemetry schemas, trace samples, cardinality controls, and incident evidence.