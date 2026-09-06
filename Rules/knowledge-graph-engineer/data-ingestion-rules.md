# Data Ingestion Rules

## Purpose
Ensure graph ingestion is deterministic, traceable, idempotent, and safe under retries or partial failure.

## Scope
Batch loads, streams, CDC, connectors, parsing, validation, deduplication, and write pipelines.

## MUST
- Ingestion pipelines MUST define delivery semantics, retry behavior, and duplicate handling.
- Source schema changes MUST be detected before malformed data enters production graphs.
- Ingested records MUST preserve source identifiers and provenance required for investigation.
- Partial failures MUST be observable and recoverable without silently losing accepted data.
- Writes that may repeat MUST be idempotent or protected by equivalent duplicate controls.

## MUST NOT
- MUST NOT drop failed records silently.
- MUST NOT acknowledge durable success before required graph writes are persisted.
- MUST NOT bypass validation to increase ingestion throughput without approved risk acceptance.

## SHOULD
- Prefer replayable ingestion sources for critical graph domains.
- Isolate poison records for investigation.

## Exceptions
Lossy ingestion requires documented semantics, bounded impact, and owner approval.

## Verification
Review retry tests, replay tests, failure queues, source-schema checks, and ingestion metrics.