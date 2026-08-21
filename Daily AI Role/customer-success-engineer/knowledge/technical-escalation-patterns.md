# Technical Escalation Patterns

## Minimum escalation evidence
- Customer/account and affected workflow.
- Business/user impact and severity rationale.
- Expected vs actual behavior.
- Environment, version, region/tenant where relevant.
- First/last known occurrence and timestamps/time zone.
- Reproduction steps and reproduction result.
- Sanitized logs, request/trace/correlation IDs.
- Recent changes and dependency state.
- Workaround attempted and result.
- Facts, hypotheses, unknowns, and explicit action requested.

## Common failure patterns
### Configuration mismatch
Signal: behavior differs by environment/account. Verify effective configuration and inheritance before blaming product code.

### External dependency failure
Signal: downstream timeout/error/status change. Capture dependency evidence and distinguish pass-through symptoms from owned failure.

### Product defect candidate
Signal: reproducible behavior violates documented/expected contract with valid configuration. Escalate as candidate until Engineering verifies root cause.

### Data-quality issue
Signal: inconsistent or incomplete data causes workflow failure. Identify source, transformation, freshness, ownership, and safe reconciliation method.

### Permission/security boundary
Signal: access denied or policy mismatch. Never request broader privileges by default; identify least-privilege requirement and approval owner.

### Intermittent failure
Use timestamps, correlation IDs, rate/segment, dependency telemetry, and recent change windows. Do not declare root cause from one coincidental metric spike.

## Severity guidance
Consider security/privacy, production impact, affected users, business criticality, workaround, deadline, and data integrity. Severity is about impact, not customer frustration alone.

## Closure
A ticket being closed is not proof of customer recovery. Re-run the original workflow or obtain equivalent customer evidence and record residual risk.