# Background Job Rules
## Purpose
Make asynchronous work recoverable and operationally safe.
## Scope
Workers, queues, schedulers, batch jobs, and task processors.
## MUST
- Jobs MUST define retry, timeout, duplicate-delivery, and terminal-failure behavior.
- Side-effecting jobs MUST be idempotent or protected by an equivalent deduplication strategy.
- Failed work MUST remain observable and recoverable where business requirements demand it.
## MUST NOT
- MUST NOT retry indefinitely without backoff and limits.
- MUST NOT acknowledge durable work before required effects are safely committed unless the design accounts for loss.
## SHOULD
- Use bounded concurrency and dead-letter handling for persistent failures.
## Exceptions
Best-effort tasks require explicit loss tolerance.
## Verification
Duplicate, crash, retry, poison-message, and shutdown tests.