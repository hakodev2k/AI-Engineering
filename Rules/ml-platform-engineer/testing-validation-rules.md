# Testing and Validation

## Purpose
Prevent regressions across infrastructure, ML workflows, and platform contracts.

## Scope
Unit, integration, contract, end-to-end, failure, upgrade, and infrastructure tests.

## MUST
- Critical user journeys MUST have automated integration or end-to-end validation at the appropriate boundary.
- Tests MUST cover failure and recovery behavior for retries, partial execution, and dependency outages where material.
- Platform upgrades MUST validate compatibility with supported workload classes.
- Test data MUST be controlled and must not expose production-sensitive information without authorization.

## MUST NOT
- Flaky tests MUST NOT be normalized as reliable release evidence.
- Mocks MUST NOT substitute for all testing of critical external contracts.

## SHOULD
- Tests SHOULD be deterministic, isolated, parallel-safe, and diagnostically useful.

## Exceptions
Skipped critical tests require documented risk, approval, and bounded restoration plan.

## Verification
Inspect CI history, flake rates, coverage of critical journeys, failure-injection tests, upgrade matrices, and test-data controls.