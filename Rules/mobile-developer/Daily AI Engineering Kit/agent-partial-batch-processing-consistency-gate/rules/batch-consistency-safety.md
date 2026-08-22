# Batch Consistency Safety Rules

## MUST
- Identify stable item identity before retry or restart analysis.
- Distinguish batch status from per-item status.
- Reconcile source count with succeeded, failed, skipped, retried, and unresolved counts.
- Verify checkpoint durability and its ordering relative to item effects.
- Bound investigative/test retries to two transient reruns unless repository policy is stricter.
- Preserve evidence for partial-failure and restart tests.
- Require explicit approval for schema changes, production deployment/config, data deletion, queue purge, breaking contracts, or irreversible backfills.

## MUST NOT
- Mark a batch successful solely because the loop returned without throwing.
- Swallow an item failure without recording item identity and outcome.
- Retry the entire batch when successful item effects are non-idempotent and unprotected.
- Advance a checkpoint beyond unresolved items unless the business contract explicitly permits it and recovery is proven.
- Use unbounded parallelism for side-effecting item work.
- Delete production records, purge/replay queues, or mutate production checkpoints without approval.
- Log secrets or sensitive payload bodies.

## SHOULD
- Prefer durable per-item result records for resumable work.
- Prefer item-scoped retry over whole-batch retry when side effects are independent.
- Make checkpoint writes atomic with the protected durable state where practical.
- Use bounded concurrency and backpressure.
- Include failed-item quarantine/dead-letter/reconciliation when automatic recovery cannot be safe.
