# Dead-Letter Queue Replay Rules

## MUST
- Export or snapshot candidate dead-letter messages before reasoning about replay; preserve original message IDs, failure timestamps, failure reasons, and idempotency keys.
- Classify each message as `eligible`, `blocked`, or `needs-review` using deterministic policy before replay planning.
- Prove the consumer's idempotency behavior or equivalent deduplication boundary for every replayable operation.
- Use bounded batches no larger than the configured `max_batch_size`.
- Reconcile every attempted replay with an external receipt or deduplication result before marking the task verified.
- Preserve evidence for blocked messages rather than silently dropping them from the plan.
- Require explicit human approval before any production replay.
- Require explicit human approval before changing queue retention, redrive policy, production configuration, schemas, database migrations, or security controls.
- Keep replay planning scripts read-only with respect to queue systems; execution must remain an explicit, separately authorized action.

## MUST NOT
- Replay a `schema-invalid`, `authorization`, `poison-message`, or `business-rule` failure merely because the infrastructure is healthy again.
- Replay messages without a stable original message ID when policy requires one.
- Replay non-idempotent operations without a proven deduplication or transaction boundary.
- Replay a duplicate message ID or duplicate idempotency key from the same export batch.
- Increase permissions, bypass authentication, rotate secrets, modify production configuration, or weaken validation to make replay succeed.
- Delete DLQ messages before successful reconciliation and retention requirements are satisfied.
- Use an unbounded retry or redrive loop.
- Treat "command returned 0" as evidence that downstream side effects occurred exactly once.

## SHOULD
- Prefer a dry-run or isolated staging replay when the consumer supports it.
- Start with the smallest representative batch and expand only after evidence shows correct behavior.
- Preserve original ordering when the business process depends on sequence.
- Record environment, queue/topic/subscription identity, consumer version, source revision, and replay operator in evidence.
- Use short-lived least-privilege credentials for execution tools and keep them out of repository files and logs.
