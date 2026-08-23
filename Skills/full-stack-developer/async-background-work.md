# Async and Background Work

## Purpose
Design asynchronous execution without blocking requests, losing work, or creating duplicate side effects.

## When to use
Long-running tasks, external calls, queues, scheduled processing, notifications, imports, or expensive workflows.

## Inputs
Workload duration, delivery guarantees, retry needs, throughput, ordering, side effects, infrastructure.

## Context to inspect
Request timeouts, queue semantics, worker lifecycle, cancellation, idempotency, persistence, observability.

## Core knowledge
Async I/O improves resource utilization but does not make work durable. Durable background processing requires explicit delivery, retry, poison-message, idempotency, and shutdown semantics.

## Procedure
1. Determine whether work belongs inside request latency budget.
2. Define durable handoff if execution may outlive the request.
3. Specify message/job identity and payload contract.
4. Make side effects idempotent or deduplicated.
5. Bound retries with backoff and terminal handling.
6. Propagate cancellation for request-scoped work.
7. Limit concurrency according to downstream capacity.
8. Handle graceful shutdown and recovery.
9. Instrument queue depth, age, failures, and duration.
10. Test duplicates, crashes, retries, and dependency outages.

## Decision points
Use in-process async for bounded request work; durable queues for work requiring persistence or decoupling. Preserve ordering only when business semantics require it.

## Common failure patterns
Fire-and-forget tasks, blocking async code, infinite retries, non-idempotent handlers, unbounded parallelism, and no dead-letter handling.

## Verification
Crash workers during processing, replay messages, simulate dependency failure, and verify no lost or unintended duplicate effects.

## Expected output
Reliable asynchronous workflow with explicit operational semantics.

## Stop conditions
Escalate when required delivery or consistency guarantees cannot be met by available infrastructure.