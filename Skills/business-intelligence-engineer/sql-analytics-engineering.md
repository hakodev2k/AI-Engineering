# SQL Analytics Engineering

## Purpose
Develop reliable, maintainable SQL transformations and analytical queries for BI workloads.

## When to use
Use when building marts, reusable datasets, KPI logic, reconciliation queries, or complex report sources.

## Inputs
Schemas, business rules, target grain, expected volumes, SQL dialect, performance constraints, sample data.

## Context to inspect
Review warehouse conventions, query history, indexes/partitioning, existing transformations, null semantics, timezone rules, and tests.

## Core knowledge
Correct analytical SQL depends on grain, join cardinality, deterministic window ordering, explicit null handling, and set-based reasoning. Readability and testability matter because metric logic evolves.

## Procedure
1. Define output grain and required columns.
2. Trace each field to authoritative sources.
3. Establish join cardinalities before writing joins.
4. Build transformations in named logical stages.
5. Use window functions deliberately and specify deterministic partitions/order.
6. Guard division, null, duplicate, and boundary behavior.
7. Push filters and projections appropriately without changing semantics.
8. Inspect execution plan and scanned volume for material workloads.
9. Add data assertions for uniqueness, accepted ranges, and reconciliation.
10. Document non-obvious business rules.

## Decision points
Use SQL for set-oriented transformations close to governed data; use another processing engine when algorithmic logic or scale characteristics clearly demand it. Materialize expensive stable transformations when reuse and measured cost justify it.

## Common failure patterns
Fan-out joins, SELECT DISTINCT masking duplicates, nondeterministic windows, implicit casts, timezone errors, correlated subqueries at scale, and business logic copied across dashboards.

## Verification
Compare row counts and totals at each stage, test edge cases, inspect plans, measure runtime/scanned bytes, and reconcile final metrics against trusted references.

## Expected output
Readable SQL with explicit grain, validated semantics, appropriate performance, tests, and lineage notes.

## Stop conditions
Stop when source semantics are unknown, joins cannot be cardinality-validated, or required production query-plan access is unavailable for a performance-critical change.