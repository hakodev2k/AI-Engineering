# Retry and Timeout Rules

## Purpose
Bound dependency failure and prevent retry behavior from amplifying outages or causing unintended repeated effects.

## Scope
Applies to synchronous calls, asynchronous delivery, polling, batch jobs, and workflow orchestration.

## MUST
- Connection, operation, and end-to-end time budgets MUST be explicit where applicable.
- Retry policy MUST define retryable conditions, maximum attempts or elapsed time, delay strategy, and terminal handling.
- Retried operations MUST be safe to repeat or protected by idempotency.
- Retry behavior MUST account for downstream rate limits and capacity.
- Timeouts MUST surface diagnostic context without exposing sensitive information.

## MUST NOT
- MUST NOT use infinite retries.
- MUST NOT retry permanent validation, authorization, or contract errors as transient failures.
- MUST NOT configure nested retries without evaluating multiplicative request amplification.

## SHOULD
- Backoff with jitter SHOULD be used for distributed contention or throttling scenarios.
- Retry budgets SHOULD be coordinated across layers.

## Exceptions
Document the dependency constraint, retry risk, measured evidence, mitigation, and approval.

## Verification
Inspect configuration and code, simulate timeout and throttling conditions, review metrics for retry amplification, and test terminal failure handling.