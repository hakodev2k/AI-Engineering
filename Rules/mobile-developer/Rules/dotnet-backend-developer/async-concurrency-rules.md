# Async and Concurrency Rules

## Purpose
Prevent deadlocks, race conditions, thread starvation, duplicate work, and unbounded concurrency.

## Scope
Applies to async methods, parallel work, shared state, background processing, and concurrent request handling.

## MUST
- Asynchronous I/O MUST remain asynchronous end-to-end across application boundaries where practical.
- Cancellation tokens MUST be propagated through cancellable I/O and long-running operations.
- Shared mutable state MUST have an explicit synchronization strategy.
- Parallelism MUST be bounded by a documented concurrency limit when work can amplify load.
- Retryable or concurrently executable operations that can produce side effects MUST address idempotency.
- Ordering requirements MUST be explicit when concurrent execution could change business outcomes.

## MUST NOT
- MUST NOT use `.Result`, `.Wait()`, or sync-over-async in request paths without a proven boundary requirement.
- MUST NOT fire-and-forget tasks whose failures, cancellation, and lifetime are unobserved.
- MUST NOT use locks across awaited operations.
- MUST NOT assume collections or scoped services are thread-safe unless documented.

## SHOULD
- Prefer immutable data and message passing over shared mutation.
- Prefer `SemaphoreSlim`, channels, or framework concurrency primitives over ad hoc locking when appropriate.

## Exceptions
Exceptions require evidence that the chosen model is safe, bounded, observable, and compatible with host shutdown.

## Verification
Use concurrency tests, cancellation tests, load tests, code review, traces, and failure-injection scenarios.