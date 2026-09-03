# Freshness Rules

## Purpose
Define how current contracted data must be for intended consumers.

## Scope
Applies to batch datasets, streams, snapshots, metrics, and replicated data products.

## MUST
- Time-sensitive contracts MUST define expected update cadence and maximum acceptable staleness.
- Freshness measurement MUST use a clearly defined source, event, or publication timestamp.
- Late-arriving data behavior MUST be documented when it can change previously published results.
- Freshness breaches MUST be observable for critical contracts.

## MUST NOT
- Processing completion time MUST NOT be presented as source-data freshness when those concepts differ.
- Systems MUST NOT present stale data as current after a contractual freshness limit is exceeded.

## SHOULD
- Consumers SHOULD be able to determine the effective data timestamp from contract metadata.
- Backfills SHOULD preserve a clear distinction between event time and processing time.

## Exceptions
Exceptions require documented consumer tolerance, measurement rationale, duration, and owner approval.

## Verification
Inspect timestamps, schedules, freshness monitors, sample records, and incident evidence for delayed or backfilled data.