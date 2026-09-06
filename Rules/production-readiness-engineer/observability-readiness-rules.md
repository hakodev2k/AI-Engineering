# Observability Readiness Rules
## Purpose
Ensure production behavior can be detected, diagnosed, and explained.
## Scope
Logs, metrics, traces, health signals, dashboards, correlation data, and operational telemetry.
## MUST
- Critical production flows MUST emit sufficient telemetry to detect failures and investigate root cause.
- Telemetry MUST support correlation across important service and dependency boundaries.
- Health indicators MUST reflect user-impacting capability rather than only process liveness.
- Readiness review MUST confirm telemetry exists for primary failure modes identified in risk analysis.
- Sensitive data MUST be excluded or protected according to security and privacy requirements.
## MUST NOT
- A system MUST NOT depend on ad hoc debug logging as its primary production diagnostic strategy.
- Secrets, credentials, authentication tokens, or unnecessary sensitive payloads MUST NOT be logged.
- Missing observability MUST NOT be dismissed because the system is expected not to fail.
## SHOULD
- Prefer structured telemetry with stable dimensions.
- Validate telemetry during negative testing or controlled failure injection.
## Exceptions
Telemetry gaps require explicit risk acceptance, compensating detection, and a remediation plan.
## Verification
Inspect emitted telemetry, dashboards, traces, failure scenarios, data controls, and runbooks.