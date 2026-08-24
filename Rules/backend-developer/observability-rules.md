# Observability Rules

## Purpose
Make backend behavior diagnosable from production evidence without exposing sensitive information.

## Scope
Logs, metrics, traces, correlation, dashboards, alerts, and runtime diagnostics.

## MUST
- Critical request and background paths MUST emit sufficient telemetry to determine success, failure, latency, and dependency impact.
- Correlation identifiers MUST propagate across service and asynchronous boundaries where supported.
- Logs MUST avoid secrets, credentials, and unnecessary sensitive data.
- Alerts MUST correspond to actionable service risks rather than raw noise.

## MUST NOT
- MUST NOT rely on ad hoc production debugging as the primary observability strategy.
- MUST NOT log entire request or response bodies by default when they may contain sensitive data.
- MUST NOT declare incidents resolved without evidence from relevant telemetry.

## SHOULD
- Telemetry SHOULD use stable dimensions with controlled cardinality.
- Dashboards SHOULD reflect user-facing and dependency health.

## Exceptions
High-cardinality or sensitive telemetry requires documented diagnostic value, retention controls, and approval where required.

## Verification
Inspect logs, metrics, traces, cardinality, correlation flow, dashboards, alert rules, and incident evidence.