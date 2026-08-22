# Observability Rules

## Purpose
Ensure operators can understand system health, user impact, dependency behavior, and failure causes.

## Scope
Covers logs, metrics, traces, dashboards, alerts, audit events, and business telemetry.

## MUST
- Critical workflows MUST emit enough telemetry to identify success, failure, latency, and dependency impact.
- Correlation across service boundaries MUST be preserved where distributed tracing or equivalent context is needed.
- Alerts MUST be actionable and tied to user/business impact or meaningful system risk.
- Sensitive data MUST be excluded or protected in telemetry.
- Operational dashboards MUST distinguish availability, performance, saturation, and error behavior for critical components.

## MUST NOT
- MUST NOT rely solely on logs for systems where metrics or traces are required to diagnose distributed behavior.
- MUST NOT log secrets, credentials, authorization tokens, or unnecessary personal data.
- MUST NOT declare a system production-ready when critical failure modes are unobservable.

## SHOULD
- Prefer SLI/SLO-driven alerting over low-value infrastructure noise.
- Define telemetry retention according to diagnostic, audit, privacy, and cost needs.

## Exceptions
Low-risk internal tools may use simpler telemetry if support expectations are correspondingly low.

## Verification
Review dashboards, alert rules, trace propagation, log schemas, redaction, incident examples, and telemetry coverage tests.