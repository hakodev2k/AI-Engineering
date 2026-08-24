# SQL Testing Rules

## Purpose
Provide deterministic evidence that SQL preserves semantics across normal, boundary, concurrent, and failure conditions.

## Scope
Queries, stored modules, migrations, constraints, data repairs, and performance-sensitive SQL.

## MUST
- Tests MUST cover correctness-critical null, duplicate, empty-set, boundary, and invalid-data behavior where applicable.
- Data-changing SQL MUST test expected affected rows and persisted invariants.
- Migrations MUST be tested against representative pre-migration states.
- Concurrency-sensitive logic MUST include concurrent execution tests.

## MUST NOT
- MUST NOT treat successful parsing or execution as proof of correctness.
- MUST NOT make tests depend on accidental row order or uncontrolled shared state.
- MUST NOT use production data containing sensitive information as routine test fixtures.

## SHOULD
- Keep fixtures minimal but representative of cardinality and distribution edge cases.
- Add regression tests for expensive or recurring defects.

## Exceptions
Where automated testing is impractical, the change requires a documented manual verification procedure and reviewer evidence.

## Verification
Run tests in CI or controlled environments; compare expected result sets, constraints, row counts, and failure states; include plan/performance checks for critical queries.