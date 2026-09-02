# Batch Processing Rules

## Purpose
Make large-scale batch workloads deterministic, recoverable, resource-aware, and safe to rerun.

## Scope
Applies to scheduled transforms, ETL/ELT jobs, backfills, compaction, enrichment, and bulk data maintenance.

## MUST
- Batch jobs MUST define input boundaries, output commit semantics, retry behavior, partial-failure handling, and rerun safety.
- Jobs that can be retried or backfilled MUST be idempotent or use deterministic partition/version replacement semantics.
- Backfills MUST define scope, expected resource demand, downstream impact, validation criteria, and cancellation or rollback behavior.
- Large jobs MUST use bounded resource consumption and MUST expose progress, duration, failures, and data-volume metrics.
- Output publication MUST avoid exposing partially committed results as complete data.

## MUST NOT
- MUST NOT mix irreversible side effects with retryable batch computation without an explicit deduplication or transaction boundary.
- MUST NOT run unbounded historical backfills in production without capacity and impact review.
- MUST NOT infer successful data processing solely from process exit status when output correctness can be independently validated.

## SHOULD
- Partition work into restartable units with deterministic boundaries.
- Prefer atomic or versioned publication patterns for critical outputs.

## Exceptions
Exceptions require documented constraints, failure impact, recovery plan, validation evidence, and approval for material production risk.

## Verification
Use rerun tests, partial-failure tests, backfill rehearsals, output reconciliation, resource metrics, row/count checks, and downstream acceptance tests.