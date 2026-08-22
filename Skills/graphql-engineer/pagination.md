# GraphQL Pagination

## Purpose
Design bounded, stable pagination that performs correctly as datasets change and supports predictable client navigation.

## When to use
Use for any collection that can grow beyond a small bounded size.

## Inputs
Ordering requirements, data source, expected cardinality, filtering, consistency needs, and client navigation patterns.

## Context to inspect
Inspect current connection conventions, sort keys, indexes, cursor encoding, maximum page size, and mutation frequency.

## Core knowledge
Offset pagination is simple but can become slow and unstable on changing large datasets. Cursor/keyset pagination uses a deterministic ordering boundary and is generally better for scalable forward traversal. Ordering must be unique or include a tie-breaker.

## Procedure
1. Determine navigation and total-count requirements.
2. Choose a deterministic sort order.
3. Ensure a unique tie-breaker exists.
4. Select cursor/keyset or offset based on scale and UX needs.
5. Define default and maximum page sizes.
6. Encode cursors as opaque client tokens.
7. Align database indexes with filter and order predicates.
8. Define forward/backward semantics if supported.
9. Test insertions/deletions between page requests.
10. Benchmark deep traversal and large datasets.

## Decision points
Use offset for small/admin datasets or random page jumps when cost is acceptable. Prefer cursor pagination for high-volume changing feeds. Avoid expensive total counts unless consumers truly need them.

## Common failure patterns
Non-deterministic ordering, unbounded first/last values, exposing raw cursor internals, missing composite indexes, duplicate/missing rows between pages, and computing counts on every request.

## Verification
Validate page boundaries, duplicates, missing records, empty pages, concurrent inserts, reverse navigation, and query plans.

## Expected output
A documented pagination contract with bounded page sizes and supporting indexes.

## Stop conditions
Stop if no stable ordering key exists and product semantics cannot define one.