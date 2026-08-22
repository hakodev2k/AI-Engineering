# Incremental Processing Rules
## Purpose
Make incremental loads correct, restartable, and efficient.
## Scope
Watermarks, CDC, merge/upsert, snapshots, and partitioned processing.
## MUST
- Incremental boundaries MUST be explicit and replay-safe.
- Late and duplicate records MUST have defined handling.
- Watermarks MUST not advance past unprocessed data.
- Reprocessing MUST preserve correctness across retries.
## MUST NOT
- MUST NOT assume event time equals arrival time.
- MUST NOT use destructive overwrite when safe merge semantics are required.
## SHOULD
- Prefer idempotent merge keys and checkpointed progress.
## Exceptions
Full rebuilds may replace incremental logic when cost and downtime are acceptable.
## Verification
Test duplicates, late arrivals, retries, partial failure, and reconciliation against source totals.