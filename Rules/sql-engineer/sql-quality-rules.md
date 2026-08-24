# SQL Quality Rules

## Purpose
Ensure SQL is correct, maintainable, reviewable, and predictable across supported database platforms.

## Scope
Applies to production SQL, stored modules, migration SQL, reporting queries, and operational scripts.

## MUST
- SQL MUST express joins, predicates, ordering, null handling, and type conversions explicitly when correctness depends on them.
- Changes MUST preserve documented business invariants and result semantics.
- Complex statements MUST be decomposed or documented so reviewers can validate intent and failure modes.
- Dialect-specific behavior MUST be identified when portability is expected.

## MUST NOT
- MUST NOT rely on accidental row order, implicit conversions with material correctness risk, or undocumented engine behavior.
- MUST NOT use `SELECT *` in stable production contracts unless schema-wide projection is intentional and reviewed.
- MUST NOT hide correctness-critical logic behind unexplained literals or duplicated expressions.

## SHOULD
- Queries SHOULD favor clear relational expressions over clever compression.
- Repeated business logic SHOULD have one governed source when feasible.

## Exceptions
Exceptions require documented context, rationale, alternatives considered, risk, and reviewer approval when they affect shared or production behavior.

## Verification
Use peer review, representative tests, schema inspection, static/lint checks where available, and result comparison against known cases. Review nulls, duplicates, boundary values, collation, time zones, and data-type behavior explicitly.