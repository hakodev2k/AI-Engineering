# Telemetry Testing Rules

## Purpose
Prevent instrumentation and pipeline regressions from reaching production unnoticed.

## Scope
Instrumentation code, exporters, schemas, collectors, routing, sampling, redaction, and downstream expectations.

## MUST
- Critical telemetry contracts MUST have automated tests for required fields and semantics.
- Redaction and sensitive-data exclusions MUST have regression tests.
- Pipeline changes MUST include failure-path tests for drops, retries, malformed records, and backend unavailability where relevant.
- Tests MUST verify the exact telemetry shape consumed by critical dashboards, alerts, or automation when feasible.

## MUST NOT
- MUST NOT rely only on manual dashboard inspection for critical contract validation.
- MUST NOT accept nondeterministic telemetry tests without investigating timing or environment assumptions.
- MUST NOT remove failing telemetry tests solely to unblock a release.

## SHOULD
- Use known-answer fixtures and isolated integration environments.

## Exceptions
Require documented limitation, alternative evidence, risk, and remediation owner.

## Verification
Review CI results, contract fixtures, redaction tests, failure tests, and emitted sample comparisons.