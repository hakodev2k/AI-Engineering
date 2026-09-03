# Source Ingestion Rules

## Purpose
Ensure knowledge sources enter a RAG system with controlled provenance, validation, and repeatable processing.

## Scope
Applies to source connectors, crawlers, file imports, database extracts, APIs, queues, document feeds, and scheduled ingestion jobs.

## MUST
- Every ingested record MUST retain a stable source identifier, ingestion timestamp, source type, and origin metadata sufficient for audit and reprocessing.
- Ingestion MUST validate schema, encoding, size, format, and required metadata before accepting content into downstream processing.
- Failed or partially processed items MUST be isolated and observable rather than silently dropped.
- Reprocessing MUST be idempotent or otherwise protected from creating duplicate logical content.
- Sensitive or restricted source classifications MUST be preserved through ingestion.
- Connector credentials MUST use managed secret storage and least privilege.
- Changes to ingestion logic MUST include compatibility assessment for existing indexed content.

## MUST NOT
- Ingestion MUST NOT strip provenance that is required for authorization, citations, or legal retention.
- Malformed content MUST NOT be coerced into apparently valid data without explicit evidence and rules.
- Production ingestion MUST NOT use developer credentials, hard-coded secrets, or broad administrator access.
- Source deletions MUST NOT be ignored when downstream indexes are expected to reflect authoritative removal.

## SHOULD
- Ingestion pipelines SHOULD support deterministic replay from checkpoints.
- Large sources SHOULD use incremental ingestion when correctness can be maintained.
- Connector behavior SHOULD expose rate limits, backoff, and freshness metrics.

## Exceptions
Exceptions require documented reason, source limitations, risk, compensating controls, and approval when provenance, security, or retention guarantees are weakened.

## Verification
Inspect connector configuration, schemas, retry/dead-letter behavior, replay tests, deduplication tests, audit metadata, secret access policy, and metrics for accepted, rejected, delayed, and failed records.