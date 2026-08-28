# Incremental Loading Rules

## Purpose
Make incremental warehouse processing correct, replayable, and resistant to late or changed source data.

## Scope
Applies to watermarking, CDC, merge/upsert, append-only, snapshot, and micro-batch loading.

## MUST
- Incremental logic MUST define its authoritative key, change boundary, late-arrival policy, and replay behavior.
- Watermarks MUST be derived from durable source evidence rather than local wall-clock assumptions alone.
- Reprocessing the same input MUST be idempotent or explicitly compensate for duplicates.
- Incremental results MUST be periodically validated against an authoritative rebuild or equivalent reconciliation.

## MUST NOT
- MUST NOT advance a watermark before corresponding data is durably committed.
- MUST NOT assume source events arrive in order unless guaranteed by contract.

## SHOULD
- Prefer replayable source ranges and deterministic merges.
- Track lag and skipped-range evidence for critical loads.

## Exceptions
Non-replayable sources require explicit loss-risk acceptance and compensating monitoring.

## Verification
Run duplicate/replay tests, late-data tests, watermark inspections, and incremental-versus-rebuild comparisons.