# Cardinality Control Rules

## Purpose
Prevent telemetry systems from becoming unstable or unaffordable due to unbounded attribute dimensions.

## Scope
Applies to span attributes, resource attributes, events, baggage, indexes, and trace-derived metrics.

## MUST
- Every indexed or aggregated tracing attribute MUST have a understood cardinality profile.
- Potentially unbounded values MUST be reviewed before production use.
- High-cardinality fields required for point lookup MUST be separated from dimensions used for broad aggregation when the backend supports that distinction.
- Cardinality regressions MUST have measurable detection thresholds.

## MUST NOT
- MUST NOT aggregate on raw user IDs, session IDs, request IDs, full URLs, stack traces, or arbitrary payload values.
- MUST NOT add labels copied from unrestricted headers or message properties.
- MUST NOT treat backend ingestion success as evidence that cardinality is safe.

## SHOULD
- Normalize routes, operations, error classes, and dependency names into bounded dimensions.
- Maintain allowlists for attributes promoted into indexed dimensions.

## Exceptions
Exceptions require a diagnostic use case, expected distinct-value count, cost estimate, retention impact, and approval from telemetry owners.

## Verification
Review backend cardinality reports, distinct-value counts, index growth, ingestion cost, and representative emitted attributes before and after changes.
