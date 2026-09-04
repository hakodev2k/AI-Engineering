# Reliability, Timeout, and Retry Rules

## Purpose
Make API failure behavior bounded, predictable, and safe under dependency degradation.

## Scope
Applies to synchronous calls, client guidance, gateway behavior, and service-to-service integrations.

## MUST
- Every network dependency MUST have a bounded timeout appropriate to its latency budget.
- Retry behavior MUST distinguish transient from permanent failures and MUST define maximum attempts or elapsed time.
- Retried mutations MUST be idempotent or protected by an equivalent duplicate-prevention mechanism.
- Backoff and jitter MUST be used where repeated synchronized retries can amplify an outage.
- End-to-end latency budgets MUST account for nested retries and downstream timeouts.
- Reliability claims MUST be supported by production telemetry or representative failure testing.

## MUST NOT
- Infinite retries MUST NOT be used.
- A downstream timeout MUST NOT exceed the remaining caller deadline when deadline propagation is available.
- Retries MUST NOT conceal persistent failures indefinitely.
- Circuit breaking or load shedding MUST NOT be disabled without understanding system-wide impact.

## SHOULD
- Deadline propagation SHOULD be used across internal boundaries.
- Retry budgets SHOULD be coordinated with rate limits and capacity controls.

## Exceptions
Exceptions require failure-mode analysis, evidence, bounded risk, monitoring, and accountable approval.

## Verification
Inspect client and gateway configuration, distributed traces, failure-injection tests, retry metrics, and latency budgets. Confirm retries remain bounded during dependency failure.