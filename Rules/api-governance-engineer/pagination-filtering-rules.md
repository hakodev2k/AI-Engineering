# Pagination and Filtering Rules

## Purpose
Keep collection APIs predictable, scalable, and stable as datasets grow.

## Scope
Applies to list, search, filtering, sorting, and pagination behavior.

## MUST
- Collection APIs MUST define deterministic ordering whenever pagination depends on position.
- Pagination tokens MUST be opaque unless their structure is intentionally public and versioned.
- Filtering and sorting fields MUST have documented semantics, supported operators, and limits.
- Maximum page size and server behavior when limits are exceeded MUST be defined.
- Pagination behavior MUST remain correct under concurrent inserts and deletes to the degree promised by the contract.

## MUST NOT
- Clients MUST NOT be required to infer completion from undocumented page-size behavior.
- Unbounded collection responses MUST NOT be exposed where dataset growth can create availability risk.
- Pagination tokens MUST NOT expose sensitive implementation data.

## SHOULD
- Cursor-based pagination SHOULD be preferred where offset pagination causes correctness or performance problems.
- Expensive filters SHOULD be constrained or separately modeled.

## Exceptions
Exceptions require bounded dataset evidence, performance analysis, consumer impact, and approval.

## Verification
Run contract and load tests across first, middle, last, empty, concurrent-change, invalid-token, and maximum-size cases. Inspect query plans or backend metrics for expensive filters.