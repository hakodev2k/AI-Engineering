# Monitoring and Alerting Rules

## Purpose
Detect host degradation before it becomes service failure and make alerts actionable.

## Scope
Applies to Linux host metrics, health checks, saturation, hardware/platform signals, alert thresholds, and notification routing.

## MUST
- Monitoring MUST cover resource exhaustion, service health, storage capacity/errors, memory pressure, CPU saturation, network health, clock health, and relevant platform faults.
- Alerts MUST identify an actionable condition, affected scope, severity, and an owner or response route.
- Thresholds MUST account for sustained impact and workload characteristics rather than arbitrary universal percentages.
- Monitoring dependencies and agents MUST themselves be observable.
- Known blind spots for critical hosts MUST be documented and risk-owned.

## MUST NOT
- Alerting MUST NOT rely on a single host metric when service impact requires correlated evidence.
- Repeated noisy alerts MUST NOT simply be muted indefinitely without correcting the detector or underlying condition.
- Missing telemetry MUST NOT be interpreted as healthy state.

## SHOULD
- Prefer symptom and saturation signals over low-value activity metrics.
- Link alerts to diagnostic context or runbooks.
- Review alert usefulness after incidents.

## Exceptions
Temporary suppression requires reason, bounded duration, affected systems, alternate detection method, and owner.

## Verification
Trigger safe synthetic conditions where possible, inspect telemetry continuity, review alert history and false-positive rates, validate routing, and confirm dashboards expose capacity trends and failure signals.