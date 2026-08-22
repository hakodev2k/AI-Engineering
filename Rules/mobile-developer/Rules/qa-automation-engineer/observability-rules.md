# Automation Observability Rules

## Purpose
Make test-system health and failure patterns observable at suite and pipeline scale.

## Scope
Applies to automation metrics, logs, trends, dashboards, and operational ownership.

## MUST
- Required suites MUST expose pass/fail/skip counts, duration, retries, and execution identity.
- Flakiness and infrastructure-failure trends MUST be measurable separately from confirmed product defects where possible.
- Automation logs MUST support correlation across test, pipeline, environment, and application telemetry.
- Alerts on test health MUST be actionable and have ownership.

## MUST NOT
- MUST NOT report aggregate pass rate in a way that hides retries, skips, or missing execution.
- MUST NOT log secrets or unnecessary sensitive payloads.
- MUST NOT create noisy alerts without response criteria.

## SHOULD
- Track first-attempt reliability, slowest tests, quarantine age, and failure cause trends.
- Use historical trends to prioritize reliability work.

## Exceptions
Small suites may use simpler reporting if required evidence remains available and reviewable.

## Verification
Inspect dashboards, raw results, skip/retry accounting, correlation fields, alert ownership, and redaction.