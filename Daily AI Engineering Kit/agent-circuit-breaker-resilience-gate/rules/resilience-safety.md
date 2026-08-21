# Resilience Safety Rules

## MUST
- Classify side effects before any automatic retry.
- Bound retries, timeouts, backoff, and circuit-open duration with configuration.
- Respect `Retry-After` only up to the configured maximum.
- Treat 401/403 and business validation failures as non-retryable unless explicit service documentation proves otherwise.
- Preserve attempt evidence: timestamp, duration, status/error kind, attempt number, circuit state, and decision.
- Verify the operation's intended postcondition after a transport-level success.
- Require human approval for controls listed in `approval_required_for`.

## MUST NOT
- Retry forever or use recursive retry without a hard attempt budget.
- Retry a non-idempotent mutation automatically without an idempotency mechanism.
- Retry authentication failures by rotating, expanding, or discovering credentials.
- Disable the circuit breaker to make a failing workflow continue.
- Increase production timeouts/retries silently.
- Retry immediately in a tight loop after 429/5xx/timeouts.
- Hide exhausted retries or report a successful task from a single HTTP 2xx when the expected postcondition is unverified.

## SHOULD
- Prefer server-provided Retry-After for rate limiting.
- Add jitter to distributed retries.
- Keep attempt budgets small and service-specific.
- Separate call executor from verification for high-impact mutations.
- Emit metrics for attempts, retry reasons, circuit transitions, latency, and final outcome.
