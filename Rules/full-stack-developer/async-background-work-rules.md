# Async and Background Work Rules

## Purpose
Keep asynchronous and deferred work reliable and observable.
## Scope
Async I/O, queues, jobs, schedulers, and event handlers.
## MUST
- Propagate cancellation and timeouts where supported.
- Make retried side effects idempotent or otherwise deduplicated.
- Define retry limits, poison-message handling, and observability for background work.
## MUST NOT
- Fire-and-forget critical work without durable ownership.
- Retry permanent failures indefinitely.
## SHOULD
- Separate user response latency from durable asynchronous processing when business semantics allow.
## Exceptions
Best-effort work must be explicitly classified and safe to lose.
## Verification
Run failure, retry, duplicate, timeout, cancellation, and recovery tests; inspect queue/job metrics.