# Pagination, Filtering, and Sorting

## Purpose
Design bounded collection APIs that remain predictable and performant as datasets grow.

## When to use
Use for list/search endpoints over potentially large datasets.

## Inputs
Consumer access patterns, dataset size, ordering fields, query capabilities, and performance limits.

## Context to inspect
Indexes, query plans, consistency needs, current filters, maximum page size, and data volatility.

## Core knowledge
Every pageable result needs deterministic ordering. Offset pagination is simple but degrades for deep pages and changing data; cursor/keyset pagination scales better for sequential traversal.

## Procedure
1. Identify real consumer query patterns.
2. Define allowed filters and sortable fields.
3. Require deterministic tie-break ordering.
4. Choose offset or cursor pagination.
5. Set default and maximum page sizes.
6. Validate query parameters.
7. Align indexes with common predicates/order.
8. Define continuation metadata.
9. Benchmark representative and worst-case queries.

## Decision points
Use cursor pagination for high-volume or rapidly changing collections; use offset when random page access and modest scale justify simplicity.

## Common failure patterns
Unbounded results, arbitrary dynamic SQL, unstable ordering, expensive total counts, and exposing unsupported filters.

## Verification
Test boundaries, duplicate/missing-item behavior across pages, invalid filters, and query performance.

## Expected output
A bounded, documented collection-query contract.

## Stop conditions
Stop when required access patterns cannot meet performance constraints without data-model changes.