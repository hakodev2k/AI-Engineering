# Logging and Observability Rules
## Purpose
Make production behavior diagnosable without leaking sensitive data.
## Scope
Logs, metrics, traces, correlation, and operational events.
## MUST
- Critical requests and background operations MUST expose enough context to correlate failures.
- Operational signals MUST distinguish expected business outcomes from system failures.
- Logs MUST use stable structured fields where machine analysis is expected.
## MUST NOT
- MUST NOT log secrets, tokens, or unnecessary sensitive payloads.
- MUST NOT use high-cardinality dimensions without assessing cost and utility.
## SHOULD
- Instrument latency, error, throughput, and saturation for critical paths.
## Exceptions
Sensitive contexts may reduce detail while retaining safe correlation identifiers.
## Verification
Telemetry inspection, incident drills, dashboards, and log-scrubbing tests.