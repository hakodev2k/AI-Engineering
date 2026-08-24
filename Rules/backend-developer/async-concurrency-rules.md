# Async and Concurrency Rules

## Purpose
Prevent race conditions, deadlocks, resource starvation, and unsafe parallelism in backend workloads.

## Scope
Asynchronous execution, threads, tasks, locks, shared state, parallel processing, and cancellation.

## MUST
- Shared mutable state MUST have an explicit concurrency strategy.
- Cancellation and timeouts MUST propagate through asynchronous dependency calls when supported.
- Parallelism MUST be bounded according to resource capacity and downstream limits.
- Critical sections MUST be minimal and reviewed for deadlock and contention risk.

## MUST NOT
- MUST NOT block synchronously on asynchronous work in request or worker paths where deadlock or starvation can result.
- MUST NOT assume in-memory synchronization protects state across processes or instances.
- MUST NOT start unbounded background work detached from lifecycle management.

## SHOULD
- Prefer immutable data and message passing over shared mutable state.
- Concurrency-sensitive code SHOULD have stress or race-focused tests.

## Exceptions
Unbounded or blocking behavior requires measured justification, bounded blast radius, and operational safeguards.

## Verification
Use concurrency tests, stress tests, thread/task dumps, cancellation tests, code review, and production telemetry.