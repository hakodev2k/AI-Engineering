# Database Access for GraphQL

## Purpose
Design data access that supports flexible GraphQL selection without producing N+1 queries, unsafe dynamic SQL, over-fetching, or unstable transaction behavior.

## When to use
Use when resolvers read or mutate relational/document databases.

## Inputs
Schema fields, ORM/query layer, database schema, indexes, filters, pagination, and transaction requirements.

## Context to inspect
Inspect generated SQL, query plans, projection behavior, loader batches, transaction scope, connection pools, and tenant predicates.

## Core knowledge
GraphQL flexibility does not mean every selection set should become unrestricted dynamic database access. Stable query shapes, projections, batching, keyset pagination, and proper indexes usually outperform resolver-by-resolver fetching.

## Procedure
1. Trace GraphQL fields to data requirements.
2. Identify repeated loads and batch them.
3. Project only useful columns where complexity remains manageable.
4. Push filtering and ordering to the database.
5. Enforce bounded pagination.
6. Align indexes with common filter/order paths.
7. Inspect generated queries and execution plans.
8. Keep transaction scope around domain consistency needs, not whole arbitrary query execution.
9. Propagate cancellation/timeouts.
10. Load-test realistic nested selections.

## Decision points
Use ORM projections for maintainability when generated SQL is sound; use tuned SQL for critical paths when evidence justifies complexity. Precompute/read-model data when graph traversal repeatedly requires expensive joins.

## Common failure patterns
One query per resolver, client-driven arbitrary SQL expressions, in-memory filtering, missing indexes, huge joins from indiscriminate eager loading, and long transactions across external calls.

## Verification
Count database round trips, inspect plans, test pagination correctness, verify tenant filters, and compare performance under realistic selection sets.

## Expected output
Predictable, bounded database access aligned with GraphQL execution behavior.

## Stop conditions
Stop if required database changes are destructive or production plans cannot be inspected safely without approval.