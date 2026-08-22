# Observability Rules

## Purpose
Provide production evidence for frontend failures, performance, and user-impacting regressions.

## Scope
Client logs, error reporting, metrics, traces, correlation, analytics used operationally, and source maps.

## MUST
- Production error telemetry MUST contain enough context to identify affected release, route/feature, and failure class without collecting unnecessary sensitive data.
- Frontend/backend correlation MUST be supported for critical distributed workflows when investigation otherwise crosses system boundaries.
- Telemetry schemas MUST classify or redact sensitive fields before transmission.
- Operational dashboards/alerts MUST focus on actionable user impact or system health rather than raw event volume.
- Release identifiers MUST allow regressions to be associated with deployed code.

## MUST NOT
- Secrets, authentication tokens, full sensitive payloads, or unnecessary personal data MUST NOT be logged.
- Client analytics MUST NOT be treated as authoritative evidence for security decisions.
- Observability SDK failure MUST NOT break primary application workflows.

## SHOULD
- Capture representative performance signals for critical journeys.
- Sample high-volume events deliberately and document resulting analytical limits.

## Exceptions
Low-risk applications may use minimal telemetry when operational support expectations are explicitly lower.

## Verification
Inspect emitted telemetry in test environments, redaction rules, correlation, dashboards, alert behavior, and release tagging.