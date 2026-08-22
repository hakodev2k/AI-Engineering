# Timeout Budget Safety Rules

## MUST
- Define one parent deadline at the external request or job boundary.
- Propagate cancellation/deadline context to every downstream call in scope.
- Cap each child timeout to the remaining parent budget.
- Reserve at least `network_reserve_ms` before starting a downstream attempt.
- Suppress retries when remaining time is below `minimum_downstream_budget_ms`.
- Preserve timeout/cancellation evidence in logs or test output without secrets.
- Keep retry loops bounded by `max_retries`.
- Require human approval when a production timeout budget is increased by at least `approval_required_for_budget_increase_percent`.

## MUST NOT
- Configure infinite/unbounded production HTTP timeouts.
- Swallow `CancellationToken`, abort, deadline, or timeout signals.
- Treat caller cancellation as a retryable transport failure.
- Start a retry that can knowingly exceed the caller deadline.
- Increase timeout values merely to make a failing test pass.
- Disable resilience or security controls to obtain a green build.
- Change production configuration, deploy, or modify infrastructure without explicit approval.

## SHOULD
- Prefer absolute deadlines for cross-service propagation and monotonic timers for local elapsed-time measurement.
- Keep connect/request/retry budgets visible in configuration.
- Test near-deadline behavior deterministically with injectable clocks where practical.
- Separate timeout failures from cancellation initiated by the caller.
