# Observability Rules

## Purpose
Ensure architecture exposes enough evidence to understand runtime behavior and failures.

## Scope
Applies to logs, metrics, traces, correlation, health signals, and diagnostic boundaries.

## MUST
- Critical flows MUST emit sufficient telemetry to diagnose latency, failures, and dependency behavior.
- Correlation across distributed boundaries MUST be preserved where supported.
- Observability data MUST avoid secrets and unnecessary sensitive payloads.
- Architecture changes affecting runtime behavior MUST define how success and failure will be observed.

## MUST NOT
- MUST NOT rely on ad hoc production debugging as the primary diagnostic strategy.
- MUST NOT emit high-cardinality or sensitive telemetry without explicit design consideration.
- MUST NOT declare production health from a single signal when multiple failure modes exist.

## SHOULD
- Prefer structured logs, service-level metrics, distributed tracing, and actionable dashboards.
- Prefer telemetry aligned with SLOs and critical user journeys.

## Exceptions
Low-risk components may use lighter telemetry when failure impact and support requirements are limited.

## Verification
Inspect telemetry schemas, dashboards, traces, alert definitions, log redaction, and production incident evidence.