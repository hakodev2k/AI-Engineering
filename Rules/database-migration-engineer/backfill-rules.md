# Backfill

## Purpose
Make large historical data changes safe, resumable, and observable.

## Scope
Applies to production backfills and bulk transformations.

## MUST
- Backfills MUST be idempotent or checkpointed so interruption does not create duplicate or inconsistent results.
- Batch size and concurrency MUST be bounded using measured impact on latency, locks, replication, storage, and compute.
- Progress, failures, skipped records, and completion criteria MUST be observable.

## MUST NOT
- MUST NOT run unbounded full-table updates on production data without impact analysis and approval.
- MUST NOT hide failed records merely to reach nominal completion.

## SHOULD
- Prefer key-range or stable-cursor batching over offset pagination for mutable large datasets.
- Provide pause, resume, and rate-control mechanisms for long-running jobs.

## Exceptions
Small bounded datasets may use simpler execution when evidence demonstrates negligible operational risk.

## Verification
Review execution plans, batch metrics, checkpoint behavior, restart tests, failure logs, and reconciliation results.