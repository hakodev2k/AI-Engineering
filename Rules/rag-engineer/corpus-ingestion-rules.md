# Corpus Ingestion Rules

## Purpose
Keep source content complete, traceable, and safely ingestible.

## Scope
Connectors, parsing, normalization, deduplication, source metadata, and ingestion failures.

## MUST
- Every ingested document MUST retain source identity, acquisition time, and processing version.
- Ingestion MUST be idempotent or have explicit duplicate handling.
- Parse failures MUST be observable and attributable to source records.
- Source schema changes MUST be detected before corrupting indexed content.
- Unsupported or malformed content MUST be quarantined rather than silently accepted.

## MUST NOT
- MUST NOT discard source provenance.
- MUST NOT silently truncate content where omitted text could affect retrieval quality.
- MUST NOT bypass source access restrictions during ingestion.

## SHOULD
- Preserve raw source references for reprocessing.
- Normalize text deterministically.

## Exceptions
Lossy transformations require documented justification, impact, and validation.

## Verification
Inspect ingestion logs, deduplication tests, parse-error queues, provenance metadata, and sampled source-to-index reconciliation.