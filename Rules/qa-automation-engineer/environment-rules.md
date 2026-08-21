# Test Environment Rules

## Purpose
Control environmental assumptions so automation results remain interpretable.

## Scope
Applies to test deployments, configuration, dependencies, browsers, devices, databases, queues, and shared services.

## MUST
- Required environment version and configuration MUST be identifiable for every run.
- Tests MUST distinguish product failure from unavailable or invalid test environment when evidence permits.
- Environment health prerequisites MUST be checked before expensive suites when failure would invalidate results.
- Configuration differences relevant to production risk MUST be documented.

## MUST NOT
- MUST NOT silently change environment configuration during tests unless the test owns and restores it.
- MUST NOT interpret failures from known broken prerequisites as product regressions without evidence.
- MUST NOT place production secrets into test environment configuration.

## SHOULD
- Prefer reproducible infrastructure and versioned configuration.
- Prefer dedicated resources for destructive or concurrency-sensitive suites.

## Exceptions
Shared mutable environments require scheduling, ownership, contamination controls, and explicit limitations on result interpretation.

## Verification
Capture versions/configuration, run health checks, inspect environment drift, and correlate failures with infrastructure telemetry.