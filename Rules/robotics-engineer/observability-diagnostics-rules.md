# Observability and Diagnostics Rules
## Purpose
Make robot failures reconstructable without compromising control performance or sensitive data.
## Scope
Logs, metrics, traces, event records, health state, and diagnostic tooling.
## MUST
- Record timestamps, software/config versions, mode transitions, faults, safety events, and critical subsystem health needed for investigation.
- Use synchronized time or document clock relationships across distributed components.
- Bound telemetry resource usage so diagnostics cannot destabilize control.
- Protect credentials, personal data, and sensitive sensor content in telemetry.
## MUST NOT
- Silently discard critical fault evidence.
- Log secrets, authentication tokens, or unrestricted sensitive payloads.
## SHOULD
- Provide correlation identifiers for mission and command flows.
## Exceptions
Reduced telemetry requires documented operational impact and alternative evidence source.
## Verification
Reconstruct representative failures from captured data; inspect retention, redaction, timing, resource limits, dashboards, and alert behavior.