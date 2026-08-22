# Testing Rules

## Purpose
Define evidence required to protect backend behavior, regressions, and failure handling.

## Scope
Applies to unit, integration, contract, database, concurrency, and end-to-end tests.

## MUST
- Tests MUST target observable behavior and meaningful failure modes rather than implementation trivia.
- Critical persistence, integration, authorization, and serialization behavior MUST have integration-level coverage where unit tests cannot prove correctness.
- Regression fixes MUST add or strengthen a test that demonstrates the prior failure when practical.
- Tests MUST be deterministic enough for CI use; flaky behavior MUST be investigated rather than normalized.
- Time, randomness, external services, and concurrency MUST be controlled explicitly when they affect determinism.
- Test data MUST not contain real secrets or production-sensitive information.

## MUST NOT
- MUST NOT mock away the behavior being validated.
- MUST NOT ignore repeatedly failing tests without documented ownership and remediation.
- MUST NOT treat code coverage percentage alone as proof of test quality.

## SHOULD
- Prefer small unit tests for pure logic and integration tests for infrastructure boundaries.
- Include negative, cancellation, retry, and concurrency scenarios where risk justifies them.

## Exceptions
Untested high-risk changes require documented reason, alternative evidence, and reviewer approval.

## Verification
Run relevant CI suites, inspect failure reproducibility, review test assertions, and verify representative environment behavior.