# Pagination Rules

## Purpose
Ensure large collections remain bounded, stable, and evolvable under concurrent change.

## Scope
Applies to list fields, connections, cursors, limits, ordering, and pagination metadata.

## MUST
- Potentially unbounded collections MUST require explicit pagination.
- Pagination MUST define deterministic ordering, including tie-breaking for non-unique sort fields.
- Cursor semantics MUST remain opaque to clients and stable for the documented lifetime.
- Page-size limits MUST be enforced server-side.
- Pagination behavior MUST define how concurrent inserts, updates, and deletes affect traversal.

## MUST NOT
- MUST NOT expose raw database offsets or primary keys as contractual cursor semantics unless intentionally documented.
- MUST NOT allow clients to request effectively unlimited page sizes.
- MUST NOT claim stable traversal when ordering cannot provide it.

## SHOULD
- SHOULD prefer cursor pagination for large or frequently changing datasets.
- SHOULD expose total counts only when their cost and consistency semantics are acceptable.

## Exceptions
Alternative pagination requires documented workload characteristics, consistency implications, performance evidence, and reviewer approval.

## Verification
Use contract tests for ordering and cursor behavior, concurrent-change tests, boundary tests for limits, and query-plan or latency evidence.