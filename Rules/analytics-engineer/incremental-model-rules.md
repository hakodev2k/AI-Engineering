# Incremental Model Rules

## Purpose
Ensure incremental processing remains correct, replayable, and safe under late, duplicated, updated, or out-of-order data.

## Scope
Applies to incremental tables, merge logic, partitions, change-data processing, and backfills.

## MUST
- Incremental models MUST define the field or condition that determines new and changed records.
- Merge or upsert keys MUST be stable and tested for the intended grain.
- Late-arriving and updated records MUST have explicit handling consistent with business requirements.
- Incremental logic MUST produce results equivalent to a correct full rebuild for supported data conditions.
- Backfill procedures MUST be documented and tested before production use for critical models.

## MUST NOT
- MUST NOT assume source records are append-only without evidence or contract.
- MUST NOT use ingestion time as business event time unless the semantics explicitly require it.
- MUST NOT run destructive backfills without impact analysis and approval.

## SHOULD
- Periodically compare incremental output with controlled full-refresh results.
- Bound lookback windows using evidence about source lateness.

## Exceptions
Exceptions require documented source behavior, risk, and reconciliation evidence.

## Verification
Review incremental predicates, merge keys, lateness tests, full-refresh comparisons, and backfill records.