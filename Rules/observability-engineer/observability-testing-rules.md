# Observability Testing Rules
## Purpose
Verify telemetry and operational controls before relying on them in production.
## Scope
Instrumentation, alerts, dashboards, collectors, redaction, and failure scenarios.
## MUST
- Test critical telemetry emission and propagation for representative success and failure paths.
- Test paging routes and critical alert conditions safely.
- Validate redaction and sensitive-data controls.
- Exercise collector/export failure behavior.
## MUST NOT
- Assume an alert works because its configuration parses.
- Use real secrets as test telemetry.
## SHOULD
- Automate telemetry assertions in integration tests for critical paths.
## Exceptions
Unsafe production alert tests may use controlled synthetic or staging validation with documented limitations.
## Verification
Inspect test results, synthetic events, routing evidence, redaction cases, and failure injection outcomes.