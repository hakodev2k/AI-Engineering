# Database Tracing Rules

## Purpose
Provide actionable database latency and failure evidence without leaking data or creating excessive overhead.

## Scope
Applies to relational, document, key-value, graph, cache, and managed database client spans.

## MUST
- Database spans MUST identify the database system and logical operation using approved bounded attributes.
- Query telemetry MUST avoid sensitive literal values and MUST use normalized or parameterized representations where available.
- Connection acquisition, query execution, and transaction latency SHOULD be distinguishable when they have materially different failure modes.
- Slow-query conclusions MUST be corroborated with database-side evidence when available.

## MUST NOT
- MUST NOT record raw credentials, connection strings containing secrets, or unrestricted query parameters.
- MUST NOT claim the database is the root cause solely because a child database span is long.
- MUST NOT add per-row or per-iteration spans for bulk operations without measured diagnostic value.

## SHOULD
- Correlate database spans with query plans, lock waits, pool saturation, and server metrics during investigations.
- Normalize operation names to stable low-cardinality values.

## Exceptions
Exceptions require a bounded diagnostic need, sensitive-data review, overhead estimate, and expiry or rollback plan.

## Verification
Inspect representative traces, validate redaction, compare client spans with database logs/metrics, and benchmark instrumentation overhead on database-heavy paths.
