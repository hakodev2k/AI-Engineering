# Testing and Validation Rules

## Purpose
Prevent feature regressions across transformation, history, materialization, and serving paths.

## Scope
Unit, integration, contract, historical, parity, load, and failure testing.

## MUST
- Critical transformations MUST have deterministic tests for edge cases and null behavior.
- Contract changes MUST have compatibility tests.
- Historical feature generation MUST include point-in-time correctness tests.
- Features used online and offline MUST have parity tests appropriate to their timing semantics.
- Production-critical pipelines MUST have integration coverage for materialization and retrieval.

## MUST NOT
- MUST NOT rely only on unit tests for cross-system feature behavior.
- MUST NOT ignore flaky data tests; they MUST be investigated or quarantined with ownership.
- MUST NOT validate only happy-path records when malformed or late data is realistic.

## SHOULD
- Include representative data scale in performance-sensitive tests.
- Use synthetic fixtures that expose leakage, skew, duplication, and stale-data failures.

## Exceptions
Unautomatable checks require documented manual evidence and reviewer ownership.

## Verification
Inspect CI results, test fixtures, coverage of failure cases, parity tests, and contract checks.