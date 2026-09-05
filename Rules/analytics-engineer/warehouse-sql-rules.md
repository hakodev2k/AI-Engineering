# Warehouse SQL Rules

## Purpose
Ensure analytical SQL is correct, portable within project constraints, reviewable, and efficient at scale.

## Scope
Applies to production SQL used for transformations, marts, metrics, reconciliation, and governed analytical outputs.

## MUST
- Joins MUST have explicit intended cardinality and keys consistent with model grain.
- Aggregations MUST preserve the intended grain and avoid accidental fan-out.
- Date, time-zone, null, and numeric precision semantics MUST be explicit when they affect business results.
- Window functions and ordering MUST use deterministic tie-breaking when output correctness depends on order.
- SQL that scans large data volumes MUST select only required data when practical.

## MUST NOT
- MUST NOT use DISTINCT to hide unexplained duplication in critical logic.
- MUST NOT rely on implicit type coercion when it can alter comparison or aggregation semantics.
- MUST NOT use nondeterministic ordering for rank, first, or last business logic.

## SHOULD
- Prefer readable CTE or model boundaries that expose business transformations clearly.
- Inspect query plans for expensive joins, shuffles, scans, and sorts on critical workloads.

## Exceptions
Vendor-specific SQL is acceptable when project constraints justify it and maintainability impact is documented.

## Verification
Review compiled SQL, query plans, grain tests, reconciliation outputs, and edge-case fixtures.