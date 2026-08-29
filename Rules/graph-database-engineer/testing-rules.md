# Testing Rules

## Purpose
Provide deterministic evidence that graph behavior remains correct across topology and data edge cases.

## Scope
Unit, integration, migration, concurrency, performance, and failure testing for graph systems.

## MUST
- Test critical queries against realistic graph structures including cycles, disconnected components, duplicate candidates, missing relationships, and dense nodes.
- Use integration tests for database-specific semantics such as constraints, transactions, indexes, and query behavior.
- Add regression tests for production defects before or with the corrective change when practical.
- Test migrations on representative data and verify invariants afterward.
- Keep test data isolated and deterministic.

## MUST NOT
- Mock away graph semantics when the behavior under test depends on traversal or database guarantees.
- Hide flaky tests with unconditional retries.
- Use production data containing sensitive information in tests without approved controls.

## SHOULD
- Generate topology-focused fixtures and property-based cases for invariants.
- Include concurrency and failure-path tests for critical writes.

## Exceptions
A missing automated test for a material behavior requires documented reason, manual evidence, residual risk, and reviewer acceptance.

## Verification
Inspect CI results, fixture design, coverage of topology edge cases, migration tests, concurrency tests, failure injection, and regression linkage.