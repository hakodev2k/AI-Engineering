# Observability Rules
## Purpose
Provide evidence to understand health, failures, and operational behavior.
## Scope
CloudWatch metrics, logs, traces, dashboards, alarms, CloudTrail, and service telemetry.
## MUST
- Define telemetry for critical availability, latency, errors, saturation, and business-relevant failure signals.
- Preserve correlation identifiers across distributed request paths where practical.
- Configure retention and access according to operational and data-sensitivity requirements.
- Validate alarms against actionable failure conditions and ownership.
## MUST NOT
- Log secrets, tokens, credentials, or unnecessary sensitive payloads.
- Claim production health from a single metric when other critical signals are unavailable.
## SHOULD
- Prefer structured logs and service-level dashboards over ad hoc log searching.
## Exceptions
Reduced telemetry requires documented risk, alternative evidence, and owner acceptance.
## Verification
Inspect dashboards, alarms, log schemas, trace samples, retention, access controls, CloudTrail, and incident evidence.