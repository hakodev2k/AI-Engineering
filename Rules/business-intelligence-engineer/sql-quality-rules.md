# SQL Quality Rules

## Purpose
Ensure analytical SQL remains correct, reviewable, and maintainable.

## Scope
Applies to warehouse queries, transformations, marts, extracts, and report queries.

## MUST
- SQL MUST make join keys and intended join cardinality explicit.
- Aggregations MUST be performed at a grain compatible with the requested metric.
- Null handling, date boundaries, and timezone assumptions MUST be explicit where they affect results.
- Reusable business logic MUST be centralized rather than copied across unrelated production queries.

## MUST NOT
- MUST NOT use `SELECT *` in stable production transformations unless schema passthrough is intentional and contract-tested.
- MUST NOT mask duplicate amplification with `DISTINCT` without proving duplicates are semantically invalid.

## SHOULD
- Complex SQL SHOULD be decomposed into named, testable stages with clear responsibilities.

## Exceptions
Exceptions require rationale, correctness evidence, maintainability impact, and reviewer approval.

## Verification
Use SQL review, static checks where available, cardinality tests, representative result comparisons, and query plans.