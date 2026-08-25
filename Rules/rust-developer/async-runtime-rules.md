# Async Runtime

## Purpose
Keep asynchronous Rust responsive, bounded, cancellable, and operationally predictable.

## Scope
Async functions, executors, tasks, streams, timers, and asynchronous I/O.

## MUST
- Blocking work on async executor threads MUST be isolated using an appropriate blocking mechanism or dedicated pool.
- Spawned tasks MUST have defined ownership, cancellation, error, and shutdown behavior.
- External async operations MUST use bounded timeouts appropriate to their SLOs.
- Unbounded task creation MUST be prevented with concurrency limits or backpressure.

## MUST NOT
- MUST NOT hold synchronous locks across `.await` when this can block executor progress.
- MUST NOT detach important tasks whose failures become unobservable.
- MUST NOT assume cancellation is atomic; partial effects MUST be considered.

## SHOULD
- Prefer structured concurrency patterns where task lifetime follows request or component lifetime.
- Instrument queueing, task latency, and timeout failures on critical paths.

## Exceptions
Long-lived detached tasks require explicit lifecycle ownership and operational monitoring.

## Verification
Run async integration tests, cancellation tests, load tests, runtime metrics inspection, and review every task-spawn boundary.