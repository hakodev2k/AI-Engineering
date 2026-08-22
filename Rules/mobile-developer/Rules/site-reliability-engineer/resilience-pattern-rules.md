# Resilience Pattern Rules

## Purpose
Apply retries, timeouts, circuit breaking, load shedding, and degradation controls without amplifying failures.

## Scope
Applies to synchronous calls, queues, background work, external dependencies, and distributed-system failure handling.

## MUST
- Remote calls MUST have bounded timeouts appropriate to the end-to-end latency budget.
- Retries MUST be bounded, back off, and be safe for the operation being retried.
- Retry behavior MUST account for aggregate amplification across service layers.
- Overload controls MUST protect critical work from unbounded queueing or resource exhaustion.
- Graceful degradation MUST preserve correctness and security boundaries.

## MUST NOT
- MUST NOT retry non-idempotent operations without an explicit duplicate-safety strategy.
- MUST NOT use infinite retries or unbounded queues in production paths.
- MUST NOT hide persistent dependency failure by converting all errors into stale success.

## SHOULD
- Use jitter for distributed retry storms where appropriate.
- Prefer load shedding over total collapse when capacity is exhausted.

## Exceptions
Deviations require failure-mode evidence, bounded risk, and verification under degraded conditions.

## Verification
Inspect timeout/retry configuration, load tests, chaos or dependency-failure tests, queue depth behavior, and incident traces.