# Test Gate Rules

## Purpose
Ensure releases satisfy evidence-based quality gates.

## Scope
Unit, integration, contract, end-to-end, security, and regression checks in delivery pipelines.

## MUST
- Required tests MUST complete successfully before promotion unless an approved emergency process applies.
- Gate criteria MUST be explicit, version-controlled, and tied to release risk.
- Test failures MUST preserve enough evidence to diagnose the failing revision and environment.
- Flaky tests affecting release gates MUST be tracked and remediated; quarantine MUST be visible and time-bounded.
- Critical-path changes MUST receive appropriate regression coverage.

## MUST NOT
- MUST NOT convert failing required tests to warnings merely to unblock a release.
- MUST NOT hide skipped tests from release evidence.
- MUST NOT use automatic retries to manufacture a pass without retaining initial-failure evidence.

## SHOULD
- Fast deterministic tests SHOULD run earlier than expensive tests.
- Test suites SHOULD be partitioned for safe parallelism.

## Exceptions
Emergency bypass requires explicit approver, scope, risk, compensating validation, and follow-up action.

## Verification
Inspect gate configuration, test reports, skipped/quarantined test inventory, retry behavior, release records, and CI enforcement on representative failing revisions.