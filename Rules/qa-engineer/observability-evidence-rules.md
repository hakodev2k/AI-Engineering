# Observability Evidence Rules
## Purpose
Use operational signals as verifiable evidence for quality and diagnosability.
## Scope
Logs, metrics, traces, correlation, alerts, and diagnostic instrumentation.
## MUST
- Verify critical failures produce sufficient diagnostic signals without exposing sensitive data.
- Correlate evidence across relevant components when investigating distributed failures.
- Validate monitoring assumptions for release-critical behavior when QA owns that verification.
## MUST NOT
- Treat absence of an alert as proof of correctness when coverage is unknown.
- Request logging of secrets or sensitive payloads merely to simplify testing.
## SHOULD
- Include correlation identifiers and measurable business/technical signals in diagnosability tests.
## Exceptions
Restricted telemetry access may be handled through approved evidence supplied by operators.
## Verification
Inspect logs, traces, metric dashboards, alert tests, redaction, and diagnostic reproduction evidence.