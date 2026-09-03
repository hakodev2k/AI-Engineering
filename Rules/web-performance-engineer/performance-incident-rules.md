# Performance Incident Rules

## Purpose
Provide disciplined diagnosis and mitigation of production web-performance incidents using evidence rather than intuition.

## Scope
Applies to sudden or sustained regressions in loading, responsiveness, rendering, network latency, resource use, and critical user journeys.

## MUST
- Establish incident scope, affected cohorts, onset time, severity, and user impact from available telemetry.
- Correlate the regression with releases, configuration, third parties, backend changes, traffic shifts, and infrastructure events before assigning cause.
- Prefer reversible mitigation when root cause is uncertain and user harm is material.
- Preserve traces, metrics, logs, release metadata, and reproduction evidence needed for post-incident analysis.
- Require human approval before risky production configuration changes, security-control changes, or irreversible mitigation actions.

## MUST NOT
- Declare root cause from temporal correlation alone.
- Delete or overwrite diagnostic evidence needed to validate hypotheses.
- Claim recovery until production metrics demonstrate the affected cohorts have returned to an acceptable range.

## SHOULD
- Maintain explicit competing hypotheses during investigation.
- Add regression protection after root cause is confirmed or sufficiently bounded.

## Exceptions
Emergency deviations require recorded reason, authority, user risk, rollback strategy, and post-incident review.

## Verification
Review incident timeline, telemetry, traces, deployment history, reproduction steps, mitigation results, and resulting regression tests or monitors.