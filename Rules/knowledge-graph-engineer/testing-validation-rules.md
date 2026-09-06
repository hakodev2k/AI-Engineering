# Testing and Validation Rules

## Purpose
Prevent semantic, structural, query, and migration regressions before they reach production.

## Scope
Unit tests, mapping tests, ontology tests, constraint tests, integration tests, query tests, migration tests, and failure testing.

## MUST
- Critical ontology and mapping behavior MUST have deterministic automated tests where practical.
- Public query contracts MUST have result-shape and compatibility tests.
- Entity resolution MUST have positive, negative, and ambiguity test cases.
- Migrations MUST be tested for data preservation and rollback behavior where rollback is supported.
- Production-critical ingestion paths MUST have integration coverage for retries and partial failure.

## MUST NOT
- MUST NOT rely only on unit tests for cross-system graph behavior.
- MUST NOT ignore flaky data or query tests; they MUST be investigated or quarantined with ownership.
- MUST NOT validate only happy-path entities when malformed, duplicate, temporal, or conflicting data is realistic.

## SHOULD
- Use synthetic fixtures that expose fan-out, cycles, duplicates, and temporal edge cases.
- Include representative graph scale in performance-sensitive tests.

## Exceptions
Unautomatable checks require documented manual evidence and reviewer ownership.

## Verification
Inspect CI results, fixtures, failure scenarios, migration tests, and contract-test coverage.