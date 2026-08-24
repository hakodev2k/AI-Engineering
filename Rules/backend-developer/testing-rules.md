# Testing Rules

## Purpose
Provide deterministic evidence that backend behavior, contracts, failure handling, and critical invariants remain correct.

## Scope
Unit, integration, contract, end-to-end, regression, concurrency, and failure-path testing.

## MUST
- Critical business invariants and externally visible contracts MUST have automated regression coverage.
- Integration tests MUST cover real boundary behavior where mocks would hide database, serialization, network, or configuration failures.
- Failure paths that can corrupt state, duplicate side effects, or break recovery MUST be tested explicitly.
- Tests MUST be deterministic enough that repeated failure indicates actionable defect evidence.

## MUST NOT
- MUST NOT treat line coverage percentage as proof of behavioral correctness.
- MUST NOT ignore flaky tests on critical paths.
- MUST NOT rely exclusively on mocks for infrastructure behavior that materially affects correctness.

## SHOULD
- Test data SHOULD be isolated, reproducible, and minimized to the scenario under test.
- Property or generative tests SHOULD be considered for broad input invariants.

## Exceptions
Manual-only verification requires documented reason, reviewer evidence, and an automation plan when the risk is recurring.

## Verification
Inspect CI history, flaky-test rates, boundary coverage, regression tests, failure-injection tests, and test isolation.