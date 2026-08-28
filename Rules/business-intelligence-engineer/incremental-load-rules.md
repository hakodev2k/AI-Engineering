# Incremental Load Rules

## Purpose
Prevent missed, duplicated, or corrupted records in incremental BI processing.

## Scope
Applies to CDC, watermark, partition, merge, upsert, and incremental transformation strategies.

## MUST
- Incremental logic MUST define the authoritative cursor, watermark, or change key.
- Late-arriving and out-of-order records MUST have an explicit handling strategy.
- Reprocessing the same input range MUST be idempotent or produce a documented equivalent result.
- Backfill procedures MUST define boundaries and reconciliation checks.

## MUST NOT
- MUST NOT advance a watermark before required data is durably processed.
- MUST NOT assume source arrival order equals business event order without evidence.

## SHOULD
- Incremental jobs SHOULD support bounded replay for recovery and correction.

## Exceptions
Exceptions require documented source limitations, loss/duplication risk analysis, recovery strategy, and approval.

## Verification
Run duplicate, gap, replay, late-arrival, and backfill tests; inspect cursor persistence and reconciliation results.