# Background Job Design

## Purpose
Implement durable asynchronous jobs that execute safely across retries, restarts, scaling, and partial failures.

## When to use
Use for scheduled work, long-running tasks, deferred processing, batch operations, or work unsuitable for request latency budgets.

## Inputs
Job semantics, trigger, deadlines, retry policy, data volume, concurrency, side effects, recovery requirements.

## Context to inspect
Scheduler/queue, worker lifecycle, persistence, locks/leases, idempotency, shutdown behavior, telemetry, and deployment model.

## Core knowledge
At-least-once execution, idempotency, leases, checkpoints, bounded retries, poison jobs, graceful shutdown, partitioning, and backpressure.

## Procedure
1. Define job input as durable minimal state.
2. Make side effects idempotent or deduplicated.
3. Bound execution time, concurrency, and retries.
4. Persist progress/checkpoints for large work.
5. Handle cancellation and graceful shutdown.
6. Separate transient from permanent failures.
7. Provide dead-letter/manual recovery path.
8. Instrument queue age, duration, failures, retries, and throughput.
9. Test restart during each critical phase.

## Decision points
Use a queue for event-driven scalable work; use a scheduler for time-driven triggers. Split large jobs when checkpoints and independent retries reduce blast radius.

## Common failure patterns
In-memory-only jobs, duplicate side effects, endless retries, overlapping schedules, no shutdown handling, and invisible stuck queues.

## Verification
Force worker crashes, duplicate delivery, dependency outage, and scale-out; verify eventual correct completion without duplicate business effects.

## Expected output
A recoverable, observable background-processing workflow.

## Stop conditions
Stop when side effects cannot be made safely retryable and no reconciliation/compensation mechanism exists.