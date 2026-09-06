# Testing and Regression Rules

## Purpose
Prevent retrieval regressions across ingestion, indexing, ranking, security, and answer grounding.

## Scope
Unit, integration, end-to-end, adversarial, migration, and regression testing.

## MUST
- Critical retrieval logic MUST have deterministic tests for representative edge cases.
- Index migrations MUST have compatibility and cutover tests.
- Authorization boundaries MUST have positive and negative retrieval tests.
- Confirmed production failures MUST become regression tests where practical.
- End-to-end tests MUST cover representative ingestion-to-answer paths.

## MUST NOT
- MUST NOT rely only on unit tests for cross-system retrieval behavior.
- MUST NOT ignore flaky retrieval tests without owner, diagnosis, or quarantine.
- MUST NOT validate only happy-path queries when ambiguity, empty results, stale data, or hostile content are realistic.

## SHOULD
- Maintain stable golden query suites plus rotating production-like samples.
- Include failure injection for unavailable dependencies and partial indexes.

## Exceptions
Manual-only checks require documented evidence, reviewer, and repeatable procedure.

## Verification
Inspect CI results, golden datasets, migration tests, security tests, and regression coverage.