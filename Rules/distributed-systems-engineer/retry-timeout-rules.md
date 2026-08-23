# Retry and Timeout Rules

## Purpose
Bound remote-call latency and prevent retries from amplifying failures.

## Scope
Synchronous RPC, asynchronous delivery, database access, and external services.

## MUST
- Every remote dependency MUST have explicit timeout semantics.
- Retries MUST be limited, back off, and account for operation idempotency.
- Retry budgets MUST fit within the caller's end-to-end deadline.

## MUST NOT
- MUST NOT retry permanent errors blindly.
- MUST NOT use unbounded retries or timeout values that exceed service objectives without justification.

## SHOULD
- Use jittered backoff and retry only where success probability materially improves.

## Exceptions
Aggressive retry policies require measured evidence and capacity analysis.

## Verification
Inspect client policies, load tests, failure tests, latency traces, and retry-rate metrics.