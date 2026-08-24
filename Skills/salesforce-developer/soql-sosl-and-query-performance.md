# SOQL, SOSL, and Query Performance

## Purpose
Design selective, bulk-safe data access that returns the required records while controlling query count, row count, CPU, heap, and lock pressure.

## When to use
Use when implementing selectors, search, reports-like application queries, integrations, batch jobs, or investigating slow Apex. Use SOSL when cross-object text search is the real requirement; use SOQL for structured predicates and relationships.

## Inputs
Object model, filters, cardinality, data volumes, indexes, sharing context, query plan, latency target.

## Preconditions
Know the expected production-scale distribution, not only sandbox sample data.

## Context to inspect
Existing selector classes, relationship queries, formula fields, external IDs, skinny/index strategy where applicable, sharing rules, soft-deleted records, and query-plan output.

## Core knowledge
Selective queries reduce rows scanned. Non-selective predicates, leading wildcards, broad OR clauses, formulas, and skewed data can create CPU or timeout failures. Relationship traversal can reduce round trips but may inflate heap. Queries also consume transaction-level limits.

## Procedure
1. Define the smallest required field set and record set.
2. Estimate cardinality and skew for each predicate.
3. Prefer indexed/selective filters for high-volume objects.
4. Use bind variables instead of constructing query strings when possible.
5. Consolidate queries by IDs or relationship keys outside loops.
6. Choose parent-child or child-parent relationships only when result sizes remain bounded.
7. Inspect Query Plan for critical queries.
8. For dynamic SOQL, validate field/object allowlists and bind safely.
9. Paginate or batch when row/heap limits are plausible.
10. Measure query count, rows, CPU, and heap with realistic test data.

## Decision points
Choose SOSL for keyword search across multiple objects/fields. Choose SOQL for deterministic relational filtering. Prefer multiple bounded queries over one huge relationship query when heap or row explosion is likely.

## Common failure patterns
Queries in loops, SELECT-all behavior, non-selective filters, querying fields never used, offset pagination at scale, unsafe dynamic SOQL, and test data too small to reveal skew.

## Verification
Validate with Query Plan or equivalent evidence, representative volumes, bulk tests, and transaction-limit measurements. Confirm returned data is correct under the intended sharing context.

## Expected output
A selective query strategy with measured limit usage and documented assumptions.

## Stop conditions
Escalate when required access patterns cannot be made selective without schema/index changes or when production cardinality is unknown for a high-risk query.