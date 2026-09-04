# Retry and Failure Observability Rules

## Purpose
Make retries, fallbacks, partial failures, and degraded AI behavior measurable without masking instability.

## Scope
Applies to model calls, retrieval, tool calls, queues, external APIs, and application retries or fallbacks.

## MUST
- Every retryable operation MUST expose attempt count, terminal outcome, and retry reason in correlated telemetry.
- Metrics MUST distinguish initial success, recovered success after retry, fallback success, and terminal failure.
- Retry storms and repeated fallback activation MUST have measurable indicators.
- Timeouts, cancellations, rate limits, dependency failures, validation failures, and policy blocks MUST use distinct stable categories.
- Partial failures MUST be observable when the user receives a degraded but technically successful response.

## MUST NOT
- Successful retry completion MUST NOT erase evidence of preceding failures.
- Retries MUST NOT inflate user-request success counts or request volume metrics.
- Unknown failures MUST NOT be coerced into a generic success or expected-error category.

## SHOULD
- Track retry-induced latency and cost separately.
- Correlate fallback activation with quality and user-outcome signals.

## Exceptions
Low-level retries may be aggregated when individual attempts are too costly to retain, provided terminal state and aggregate retry pressure remain observable.

## Verification
Inject timeouts, rate limits, transient failures, fallback activation, and terminal errors; verify telemetry classifications, counts, and end-to-end correlation.