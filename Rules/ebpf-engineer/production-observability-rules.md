# Production Observability

## Purpose
Make the health and impact of deployed eBPF components visible in production.

## Scope
Program/load health, attachment coverage, verifier/load failures, event loss, map pressure, overhead, and alerts.

## MUST
- Production systems MUST expose whether required programs are loaded and attached.
- Critical maps MUST expose capacity/eviction or equivalent pressure signals when exhaustion affects behavior.
- Event pipelines MUST expose loss and consumer health when data completeness matters.
- eBPF overhead MUST be monitorable through representative host/application signals.
- Alerts MUST distinguish component failure from observed workload behavior.

## MUST NOT
- MUST NOT report healthy solely because the userspace loader process is running.
- MUST NOT suppress repeated attach/load failures without an actionable signal.
- MUST NOT use unbounded diagnostic cardinality.

## SHOULD
- Include deployed artifact/version identity in health telemetry.
- Alert on loss of expected attachment coverage for enforcement and critical monitoring.

## Exceptions
Reduced telemetry requires documented compensating evidence, owner, duration, and risk acceptance.

## Verification
Kill/restart components, force attach failures and map pressure in tests, and verify dashboards/alerts reflect actual kernel state.