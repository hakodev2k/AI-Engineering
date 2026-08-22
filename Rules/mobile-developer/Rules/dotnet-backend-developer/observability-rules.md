# Observability Rules

## Purpose
Make production behavior diagnosable through logs, metrics, traces, and health signals.

## Scope
Applies to APIs, background workers, databases, queues, caches, and external dependencies.

## MUST
- Critical user and business flows MUST expose enough telemetry to distinguish success, latency, saturation, and failure.
- Service-level metrics MUST include meaningful latency, error, throughput, and resource signals where relevant.
- Distributed calls SHOULD propagate trace/correlation context across supported boundaries.
- Health checks MUST distinguish process liveness from dependency readiness when both matter operationally.
- Alerts MUST correspond to actionable service symptoms rather than arbitrary metric movement.
- Production conclusions MUST use available evidence rather than intuition alone.

## MUST NOT
- MUST NOT mark a dependency healthy solely because configuration exists.
- MUST NOT create alerts with no owner or response expectation.
- MUST NOT emit high-cardinality telemetry fields without considering cost and backend limits.

## SHOULD
- Prefer OpenTelemetry-compatible instrumentation where it fits the platform.
- Track SLI/SLO-style indicators for important services when operational maturity requires them.

## Exceptions
Reduced telemetry for low-risk components requires documented rationale and an alternative diagnostic path.

## Verification
Use trace inspection, metric dashboards, alert tests, synthetic checks, incident drills, and failure injection.