# Testing Rules

## Purpose
Provide deterministic regression protection for GraphQL contracts, execution behavior, and production-critical failure modes.

## Scope
Applies to schema tests, resolver tests, contract tests, integration tests, authorization tests, performance checks, and end-to-end flows.

## MUST
- Schema and resolver changes MUST have tests covering expected success and failure behavior.
- Contract tests MUST protect nullability, argument requirements, error semantics, and compatibility-sensitive fields.
- Authorization-sensitive fields MUST include denied-path tests, not only successful access tests.
- Critical queries and mutations MUST be tested against representative downstream dependencies.
- Regression tests MUST be added for defects whose root cause can reasonably recur.

## MUST NOT
- MUST NOT rely exclusively on snapshot tests when semantic assertions are required.
- MUST NOT use nondeterministic retries to conceal flaky GraphQL tests.
- MUST NOT treat schema validation alone as evidence that resolver behavior is correct.

## SHOULD
- SHOULD keep most resolver tests isolated and deterministic, with targeted integration coverage for infrastructure boundaries.
- SHOULD include malformed, high-complexity, and partial-failure cases.

## Exceptions
Reduced coverage requires documented risk, rationale, compensating verification, and reviewer approval.

## Verification
Review CI results, coverage of critical operations, deterministic repeat runs, contract-test output, and regression test evidence.