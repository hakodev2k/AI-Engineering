# Retry and Timeout Rules

## Purpose
Prevent cascading failure and excessive latency when dependencies are slow or transiently unavailable.

## Scope
Outbound network calls, database operations, queue operations, and other retryable backend dependencies.

## MUST
- Every remote call MUST have a bounded timeout appropriate to the request budget.
- Retries MUST be limited, observable, and restricted to failures that are plausibly transient.
- Retry delays MUST use backoff and jitter where concurrent retry storms are possible.
- End-to-end request deadlines MUST account for nested retries and downstream timeouts.

## MUST NOT
- MUST NOT retry operations that can duplicate side effects unless idempotency or deduplication protects them.
- MUST NOT use infinite retries on request paths.
- MUST NOT configure downstream timeouts longer than the caller's remaining deadline without justification.

## SHOULD
- Retry policy SHOULD differ by operation and failure class rather than using one global policy.
- Circuit breaking or load shedding SHOULD be considered for persistently failing dependencies.

## Exceptions
Long-running operations require asynchronous workflow design, explicit SLA, cancellation strategy, and operational visibility.

## Verification
Inspect timeout/retry configuration, chaos tests, failure telemetry, deadline propagation, and duplicate-side-effect tests.