# Observability and Audit Rules

## Purpose
Make flag behavior, configuration changes, and rollout impact diagnosable in production.

## Scope
Applies to evaluation metrics, change events, audit trails, dashboards, traces, and incident evidence.

## MUST
- Production flag changes MUST record actor, timestamp, environment, previous state, new state, and change context where supported.
- Critical flag evaluations MUST expose aggregate success, failure, and fallback signals without leaking sensitive context.
- Rollout dashboards MUST correlate feature exposure with relevant health indicators.
- Audit records MUST be protected from unauthorized modification.
- Incident investigation MUST distinguish configuration change time from application deployment time.

## MUST NOT
- MUST NOT log secrets or full sensitive evaluation contexts.
- MUST NOT rely solely on application logs when platform audit history is available.
- MUST NOT delete audit evidence needed for active incidents or required retention.

## SHOULD
- Significant production flag changes SHOULD emit structured events suitable for change correlation.

## Exceptions
Reduced telemetry in privacy-sensitive environments requires documented compensating evidence.

## Verification
Review audit records, metrics, dashboards, traces, structured events, and incident timelines.