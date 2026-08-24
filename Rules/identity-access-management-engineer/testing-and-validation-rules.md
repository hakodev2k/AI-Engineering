# Testing and Validation Rules

## Purpose
Prove identity controls work for expected, boundary, failure, and abuse cases before relying on them.

## Scope
Authentication, authorization, provisioning, federation, lifecycle, session, recovery, and policy testing.

## MUST
- Critical IAM controls MUST have deterministic tests for allowed and denied behavior.
- Tests MUST include expired, malformed, wrong-issuer, wrong-audience, missing-attribute, revoked, and insufficient-privilege cases where relevant.
- Lifecycle tests MUST verify deprovisioning and reconciliation, not only provisioning.
- Production-impacting fixes MUST include regression evidence for the failure mode when practical.

## MUST NOT
- MUST NOT validate authorization solely through happy-path UI tests.
- MUST NOT use real production credentials in test fixtures.
- MUST NOT claim a security control works based only on configuration presence.

## SHOULD
- Prefer integration tests against realistic protocol and policy boundaries, supplemented by unit tests for deterministic policy logic.

## Exceptions
Untestable controls require documented manual evidence, risk, reviewer, and a plan to improve testability.

## Verification
Inspect CI results, negative test coverage, test fixtures, environment assumptions, security test reports, and regression suites.