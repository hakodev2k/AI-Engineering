# Filtering and Faceting

## Purpose
Keep structured constraints and aggregations correct under real corpus and authorization conditions.

## Scope
Filters, facets, aggregations, ranges, sorting, and filter-aware retrieval.

## MUST
- Apply mandatory tenant, visibility, and authorization filters before results become observable.
- Define null, missing, multi-valued, timezone, and boundary semantics for structured filters.
- Validate facet counts against the same visibility scope presented to the user.
- Bound expensive aggregations and high-cardinality facets.

## MUST NOT
- Leak hidden document existence through facet counts or filter metadata.
- Implement security boundaries as optional UI filters.
- assume lexical and vector paths apply filters identically without tests.

## SHOULD
- Use stable canonical representations for filter values.
- Test combinations representative of production query complexity.

## Exceptions
Exceptions require documented semantics, exposure analysis, and approval for security-sensitive behavior.

## Verification
Run boundary tests, authorization tests, count reconciliation, high-cardinality load tests, and query-plan/profile inspection.