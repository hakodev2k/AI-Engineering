# Context Testing Rules

## Purpose
Protect context behavior with deterministic, integration, and regression testing.

## Scope
Assembly tests, retrieval tests, serialization tests, boundary tests, and end-to-end model-context tests.

## MUST
- Context pipelines MUST have deterministic tests for ordering, truncation, filtering, and metadata preservation.
- Retrieval integrations MUST test empty, duplicate, stale, malformed, and conflicting source cases.
- Context serialization MUST have snapshot or equivalent regression coverage.
- Important production failures MUST produce regression tests where practical.
- Tests MUST isolate context behavior from unrelated model randomness when feasible.

## MUST NOT
- MUST NOT validate only successful retrieval paths.
- MUST NOT accept flaky context tests without investigation and ownership.
- MUST NOT rely exclusively on end-to-end model outputs to test deterministic assembly logic.

## SHOULD
- Use synthetic fixtures for hard boundary and conflict cases.
- Run representative integration tests in CI.

## Exceptions
Manual verification requires documented evidence and reviewer ownership.

## Verification
Inspect CI results, deterministic fixtures, regression tests, and integration coverage.