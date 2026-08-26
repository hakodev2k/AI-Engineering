# SQL Query Design

## Purpose
Produce correct, maintainable PostgreSQL queries whose semantics remain clear as data volume and schema complexity grow.

## When to use
Use when implementing or reviewing joins, aggregates, reporting queries, CTEs, window functions, or data transformations.

## Inputs
Business requirement, schema, sample data, expected result shape, cardinalities, latency target.

## Context to inspect
Read constraints, indexes, row counts, null semantics, existing query conventions, and transaction context.

## Core knowledge
SQL is declarative: correctness of set semantics comes before optimization. Understand three-valued logic, join cardinality, aggregation grain, window functions, lateral joins, CTE behavior, and deterministic ordering.

## Procedure
1. Define the exact result grain.
2. State filters and null semantics explicitly.
3. Build joins from known cardinalities.
4. Prevent accidental row multiplication.
5. Separate filtering, aggregation, and presentation concerns.
6. Use window functions where they preserve row identity.
7. Parameterize external values.
8. Test edge cases and duplicate/null behavior.
9. Inspect EXPLAIN when performance matters.
10. Simplify before shipping.

## Decision points
Prefer joins for relational composition, EXISTS for existence tests, window functions for per-row analytics, and CTEs when they improve structure without hiding performance consequences.

## Common failure patterns
SELECT DISTINCT masking bad joins, NOT IN with nulls, implicit casts, missing ordering assumptions, correlated subqueries over large sets, application-side filtering.

## Verification
Compare results against hand-checked fixtures, test empty/null/duplicate cases, and inspect execution plans at realistic scale.

## Expected output
A parameterized query plus correctness assumptions and performance evidence when relevant.

## Stop conditions
Stop when required semantics or source-of-truth definitions are unresolved.