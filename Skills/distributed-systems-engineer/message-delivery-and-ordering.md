# Message Delivery and Ordering

## Purpose
Design reliable consumers around actual broker delivery and ordering guarantees instead of assumed exactly-once FIFO behavior.

## When to use
Use for queues, streams, event buses, change feeds, and asynchronous jobs.

## Inputs
Broker guarantees, partitioning, throughput, ordering requirements, consumer concurrency, retention, and failure behavior.

## Context to inspect
Inspect acknowledgment mode, visibility/lock timeout, redelivery, partition keys, consumer groups, dead-letter policy, and offset/checkpoint storage.

## Core knowledge
At-most-once can lose work; at-least-once can duplicate it. Ordering is usually scoped to a partition/key and can be affected by retries. End-to-end correctness belongs in application design.

## Procedure
1. Identify required delivery semantics per workflow.
2. Define the smallest scope that truly requires ordering.
3. Select partition/routing keys accordingly.
4. Make consumers idempotent.
5. Commit side effects and acknowledgments/checkpoints safely.
6. Define retry and poison-message behavior.
7. Handle gaps, reordering, and delayed messages where relevant.
8. Define replay behavior and retention.
9. Monitor lag, redelivery, dead letters, and processing age.
10. Test crashes before and after side-effect commit.

## Decision points
Avoid global ordering unless business correctness requires it because it constrains parallelism. Use sequence/version checks when stale updates must be rejected.

## Common failure patterns
Acknowledging before durable work, assuming FIFO across partitions, unbounded retries, and treating dead-letter queues as permanent storage.

## Verification
Crash consumers at critical boundaries and prove no unacceptable loss or duplicate side effect. Validate ordering scope under concurrency.

## Expected output
A documented delivery, ordering, acknowledgment, retry, and replay contract.

## Stop conditions
Escalate when broker guarantees are unknown or business correctness depends on guarantees the platform cannot provide.