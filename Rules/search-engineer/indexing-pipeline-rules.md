# Indexing Pipeline

## Purpose
Ensure documents enter search indexes completely, correctly, and recoverably.

## Scope
Extraction, transformation, enrichment, ingestion, retries, checkpoints, and reconciliation.

## MUST
- Make ingestion idempotent or explicitly deduplicate repeated delivery.
- Define checkpoint and replay semantics for every pipeline stage.
- Detect and surface rejected, malformed, stale, and partially processed documents.
- Reconcile index state against the authoritative source using measurable completeness criteria.
- Preserve enough provenance to diagnose how an indexed document was produced.

## MUST NOT
- Silently drop failed documents.
- Retry permanent failures indefinitely.
- Advance durable checkpoints before required downstream persistence is confirmed.

## SHOULD
- Separate transient from permanent failure handling.
- Support bounded backfills without starving fresh updates.

## Exceptions
Exceptions require quantified loss tolerance, recovery procedure, monitoring, and approval.

## Verification
Exercise replay tests, duplicate delivery, poison records, checkpoint recovery, reconciliation reports, and failure metrics.