# Queue and Backlog Recovery

## Purpose
Recover asynchronous systems from growing queues, delayed processing, poison messages, retry storms, and dead-letter accumulation without creating duplicate or out-of-order side effects.

## When to use
Use when message age, queue depth, consumer lag, dead letters, or processing retries indicate asynchronous degradation.

## Inputs
Queue metrics, message age, producer/consumer rates, retry policy, dead-letter data, handler idempotency, ordering guarantees, and downstream capacity.

## Context to inspect
Inspect partitioning, visibility/lock timeouts, concurrency, poison-message handling, batch size, rate limits, deduplication, and side-effect semantics.

## Core knowledge
Queue depth alone is insufficient; age and drain rate determine recovery. Increasing consumers can overload downstream systems. Reprocessing is safe only when handler and external side effects tolerate duplicates.

## Procedure
1. Measure arrival rate, processing rate, oldest-message age, and failure rate.
2. Identify whether backlog is caused by reduced capacity, poison messages, downstream failure, or producer surge.
3. Stop retry amplification and isolate poison messages.
4. Verify idempotency and ordering requirements before replay.
5. Restore downstream health before increasing consumer concurrency.
6. Scale consumers gradually within dependency capacity.
7. Prioritize time-sensitive messages if semantics allow.
8. Reprocess dead letters in bounded batches with monitoring.
9. Track drain time and duplicate/error indicators.
10. Reconcile business outcomes after backlog clears.

## Decision points
Replay when messages remain valid and processing is safe; discard only with explicit business rules and authorization. Preserve ordering when domain correctness depends on it even if recovery is slower.

## Common failure patterns
Scaling consumers into a failing dependency, infinite poison retries, replaying non-idempotent messages, ignoring message expiry, and declaring recovery when queue depth falls but outcomes are wrong.

## Verification
Confirm backlog age returns to normal, processing keeps pace with arrivals, dead letters stabilize, and representative business outcomes are correct.

## Expected output
A backlog diagnosis and controlled recovery record with drain metrics, replay decisions, and reconciliation evidence.

## Stop conditions
Escalate when message loss, duplicate financial/external side effects, or ordering violations cannot be safely bounded.