# Reliability and Retry Rules
## Purpose
Prevent transient failures from becoming duplicate or cascading side effects.
## Scope
Retries, timeouts, idempotency, circuit breaking, and partial failure.
## MUST
- Set bounded timeouts and retry budgets for external operations.
- Make retryable side effects idempotent or protect them with deduplication.
- Distinguish transient, permanent, and authorization failures.
## MUST NOT
- Retry destructive or non-idempotent actions blindly.
- Create infinite retry or agent loops.
## SHOULD
- Use backoff, jitter, circuit breakers, and compensating actions where appropriate.
## Exceptions
Long-running operations require explicit lifecycle and cancellation semantics.
## Verification
Use failure injection, duplicate-delivery tests, timeout tests, retry metrics, and recovery exercises.