# Ingestion Contract Rules

## Purpose
Keep source-to-warehouse ingestion predictable, auditable, and resilient to source change.

## Scope
Applies to batch, streaming, CDC, API, file, and database ingestion contracts.

## MUST
- Every ingestion contract MUST define source ownership, schema, freshness, delivery semantics, and failure handling.
- Source field changes MUST be detected before they silently alter analytical meaning.
- Required identifiers and timestamps MUST be validated at ingestion boundaries.
- Duplicate, late, and out-of-order records MUST have explicit handling rules.

## MUST NOT
- MUST NOT infer undocumented source semantics from sample data alone.
- MUST NOT silently discard malformed records without traceable evidence.

## SHOULD
- Quarantine invalid records when recovery is preferable to pipeline failure.
- Prefer schema compatibility checks before production rollout.

## Exceptions
Exceptions require documented source limitations, quantified risk, and owner approval.

## Verification
Inspect source contracts, schema checks, rejection logs, replay tests, and freshness monitoring.