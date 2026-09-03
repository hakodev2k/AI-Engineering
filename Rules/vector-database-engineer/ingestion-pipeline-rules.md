# Ingestion Pipeline

## Purpose
Make vector ingestion correct, repeatable, observable, and safe under retries and partial failure.

## Scope
Applies to source extraction, chunking outputs, embedding generation, upserts, deletes, and bulk loads.

## MUST
- Ingestion operations MUST be idempotent or carry deduplication semantics sufficient to make retries safe.
- Each record MUST preserve source identity and embedding/index lineage needed for reconciliation.
- Invalid dimensions, malformed metadata, and contract violations MUST fail explicitly rather than entering the index silently.
- Bulk ingestion MUST use bounded concurrency, backpressure, retry limits, and checkpointing.
- Deletes and source tombstones MUST propagate according to a documented consistency objective.
- Pipeline failures MUST expose actionable metrics and dead-letter or recovery mechanisms where data would otherwise be lost.

## MUST NOT
- MUST NOT retry non-idempotent writes indefinitely.
- MUST NOT acknowledge durable ingestion before required persistence guarantees are met.
- MUST NOT silently skip failed records in production bulk loads.

## SHOULD
- Reconciliation jobs SHOULD detect missing, duplicated, stale, and orphaned vectors.
- Ingestion SHOULD separate transient failures from permanent data errors.
- Large backfills SHOULD be rate-limited against serving SLOs.

## Exceptions
Exceptions require bounded impact, documented recovery, evidence, and approval for changes that threaten production availability or data integrity.

## Verification
Review integration tests, retry tests, checkpoints, reconciliation reports, dead-letter handling, metrics, and failure-injection results.