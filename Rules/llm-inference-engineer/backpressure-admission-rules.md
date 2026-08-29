# Backpressure and Admission Rules

## Purpose
Prevent overload from turning bounded demand into cascading latency, memory, and availability failures.

## Scope
Applies to gateways, queues, worker admission, rate limits, token budgets, concurrency controls, and overload responses.

## MUST
- Each serving tier MUST have a bounded admission policy for scarce inference resources.
- Queue limits and concurrency limits MUST be explicit and observable.
- Overload behavior MUST return a defined error, retry signal, or degraded response instead of waiting indefinitely.
- Admission logic MUST account for request size or token cost when large requests can dominate resources.
- Retry guidance MUST avoid synchronized retry storms.

## MUST NOT
- MUST NOT accept unbounded queued work.
- MUST NOT allow one tenant or request class to consume all capacity without an explicit policy.
- MUST NOT hide overload by increasing timeouts indefinitely.
- MUST NOT retry rejected requests recursively inside the same saturated dependency chain.

## SHOULD
- Admission controls SHOULD fail early when completion within SLO is improbable.
- Per-tenant quotas SHOULD be used where noisy-neighbor risk is material.

## Exceptions
Exceptions require quantified capacity impact, safeguards, duration, and approval when shared production reliability is affected.

## Verification
Inspect queue bounds, rate-limit configuration, overload tests, retry behavior, tenant isolation tests, and saturation dashboards.