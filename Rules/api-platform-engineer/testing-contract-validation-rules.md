# Testing and Contract Validation

## Purpose
Detect platform and API regressions before consumers encounter them.

## Scope
Specification tests, compatibility tests, integration tests, negative tests, and end-to-end verification.

## MUST
- Contract changes MUST pass syntax, semantic, and compatibility validation before release.
- Critical platform policies MUST have positive and negative tests.
- Tests MUST cover authentication failure, authorization denial, malformed input, timeout, and dependency failure where applicable.
- Test fixtures MUST not contain production secrets.

## MUST NOT
- MUST NOT rely solely on happy-path endpoint tests.
- MUST NOT suppress flaky contract tests without root-cause ownership and tracked remediation.

## SHOULD
- Consumer-driven tests SHOULD supplement provider tests for high-impact integrations.

## Exceptions
Skipped coverage requires documented risk, owner, and compensating verification.

## Verification
Review CI gates, test reports, contract diffs, failure-path coverage, and flaky-test history.