# Observability Rules
## Purpose
Provide enough production evidence to diagnose frontend failures and user-impact regressions.
## Scope
Client errors, performance telemetry, traces, correlation, analytics, and diagnostic context.
## MUST
- Unexpected production errors on critical flows MUST be observable with release/version and useful correlation context.
- Telemetry MUST exclude secrets and unnecessary sensitive data.
- Frontend requests SHOULD propagate supported correlation context to backend systems.
- Performance telemetry MUST distinguish representative user conditions when conclusions depend on device or network.
- New critical workflows MUST define the minimum signals needed to distinguish success, failure, and abandonment when product policy permits.
## MUST NOT
- High-cardinality or sensitive payloads MUST NOT be logged indiscriminately.
- Absence of telemetry MUST NOT be interpreted as proof of correctness.
## SHOULD
- Prefer actionable signals tied to user impact over high-volume diagnostic noise.
## Exceptions
Privacy constraints may limit telemetry; define alternate evidence where possible.
## Verification
Inspect telemetry schema, redaction, release tags, correlation, dashboards, and synthetic failure events.