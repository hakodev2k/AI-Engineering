# Ingestion Pipeline Rules

## Purpose
Ensure feature source data enters the platform reliably, idempotently, and with traceable failure handling.

## Scope
Batch ingestion, streaming ingestion, CDC, source connectors, retries, deduplication, and checkpoints.

## MUST
- Ingestion pipelines MUST define delivery semantics and deduplication behavior.
- Retries MUST be bounded and safe for duplicate delivery.
- Checkpoints or offsets MUST be recoverable after worker failure.
- Source schema changes MUST be detected before corrupting downstream feature values.
- Poison records MUST be isolated with enough evidence for investigation.

## MUST NOT
- MUST NOT drop failed records silently.
- MUST NOT acknowledge data before durable processing when loss would violate requirements.
- MUST NOT reset offsets or checkpoints in production without impact analysis and approval.

## SHOULD
- Expose lag, failure rate, duplicate rate, and throughput metrics.
- Prefer replayable sources for critical feature pipelines.

## Exceptions
Lossy ingestion is allowed only when explicitly consistent with feature semantics and documented.

## Verification
Inspect connector configuration, retry tests, replay tests, failure queues, checkpoint behavior, and lag metrics.