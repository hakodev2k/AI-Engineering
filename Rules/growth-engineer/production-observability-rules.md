# Production Observability Rules

## Purpose
Make growth behavior diagnosable in production using operational and business evidence.

## Scope
Logs, metrics, traces, dashboards, alerts, experiment exposure, and business events.

## MUST
- Instrument critical growth flows with enough context to distinguish expected variation from technical failure.
- Define alerts for failures requiring timely action and link them to ownership and response guidance.
- Correlate business anomalies with technical telemetry before drawing production conclusions.

## MUST NOT
- Log secrets, authentication tokens, or unnecessary sensitive customer data.
- Create noisy alerts without an actionable owner or response.

## SHOULD
- Provide dashboards that connect system health, funnel health, and experiment exposure for major launches.

## Exceptions
Temporary high-detail diagnostics require bounded retention and explicit removal.

## Verification
Inspect telemetry schemas, dashboards, alert routing, redaction, sample incidents, and traceability from anomaly to underlying requests/events.