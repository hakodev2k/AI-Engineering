# Background Processing

## Purpose
Design reliable background jobs/workers that survive retries, restarts, duplicate delivery, and partial dependency failures.

## When to use
Scheduled jobs, queues, long-running work, out-of-band processing, batch operations.

## Inputs
Job semantics, trigger source, payload, retry rules, durability needs, SLAs, dependency limits.

## Context to inspect
Worker hosting, scheduler/queue behavior, persistence, visibility timeout, shutdown handling, job state, logging.

## Core knowledge
At-least-once delivery is common; idempotency matters; retries need backoff/jitter; poison messages need quarantine; graceful shutdown must stop intake and finish/abandon safely.

## Procedure
1. Define job unit and success semantics.
2. Make processing idempotent or deduplicated.
3. Persist enough state for recovery.
4. Bound concurrency.
5. Classify transient vs permanent failures.
6. Configure finite retries with backoff/jitter.
7. Add dead-letter/quarantine handling.
8. Propagate correlation and structured logs.
9. Test restart during processing.

## Decision points
Use in-process hosted services for simple non-critical workloads; durable schedulers/queues for work that must survive process loss.

## Common failure patterns
Infinite retries, non-idempotent duplicate effects, no poison-message path, hidden job loss on deployment, unbounded workers.

## Verification
Failure/restart tests, duplicate-delivery tests, queue depth/age metrics, audit of terminal states.

## Expected output
Recoverable, observable background processing with bounded retries.

## Stop conditions
Escalate workflows needing exactly-once cross-system guarantees.