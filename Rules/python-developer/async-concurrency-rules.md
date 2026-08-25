# Async and Concurrency Rules
## Purpose
Prevent deadlocks, starvation, races, and hidden blocking.
## Scope
asyncio, threads, processes, and concurrent integrations.
## MUST
- Blocking work inside an event loop MUST be isolated or made asynchronous.
- Shared mutable state MUST have an explicit synchronization strategy.
- Cancellation, timeout, and shutdown behavior MUST be defined for long-running tasks.
## MUST NOT
- MUST NOT fire-and-forget critical work without lifecycle and failure ownership.
- MUST NOT assume the GIL provides application-level thread safety.
## SHOULD
- Prefer bounded concurrency and structured task ownership.
## Exceptions
Deviations require measured need and failure tests.
## Verification
Concurrency tests, timeout/cancellation tests, traces, and load evidence.