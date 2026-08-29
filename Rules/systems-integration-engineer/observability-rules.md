# Observability Rules

## Purpose
Provide sufficient telemetry to prove integration health and investigate failures across system boundaries.

## Scope
Applies to logs, metrics, traces, correlation identifiers, dashboards, and operational diagnostics.

## MUST
- Critical integration flows MUST expose measurable success, failure, latency, volume, and backlog signals where applicable.
- Cross-system transactions MUST have correlation identifiers or equivalent traceability that does not expose sensitive data.
- Logs MUST distinguish business rejection from technical failure.
- Alerts MUST be tied to actionable conditions and an accountable owner.
- Production conclusions MUST use available logs, metrics, traces, or equivalent evidence rather than assumption.

## MUST NOT
- MUST NOT log secrets, credentials, tokens, or unnecessary sensitive payloads.
- MUST NOT rely solely on host or process availability to infer integration success.
- MUST NOT create alerts with no defined response path.

## SHOULD
- Dashboards SHOULD expose dependency health and end-to-end outcome metrics.
- Telemetry SHOULD support reconciliation between producer and consumer counts where useful.

## Exceptions
Document missing telemetry, risk, compensating diagnostics, owner, and remediation plan.

## Verification
Inspect telemetry instrumentation, dashboards, alert rules, sample traces, log redaction, and runbooks; simulate representative failures and confirm evidence is emitted.