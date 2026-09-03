# Resilience, Timeout, and Retry Rules

## Purpose
Prevent cascading failures and uncontrolled duplicate inference work.

## Scope
Applies to gateways, model workers, artifact stores, schedulers, and downstream dependencies.

## MUST
- Define explicit timeouts for remote operations and request execution boundaries.
- Bound retries by attempt count, elapsed time, and idempotency semantics.
- Use circuit breaking or load shedding where repeated dependency failure can amplify overload.
- Propagate cancellation and deadlines across serving components.

## MUST NOT
- Retry non-idempotent operations blindly.
- Configure retry loops whose total duration exceeds the caller's deadline.
- Hide persistent dependency failure behind infinite or high-amplification retries.

## SHOULD
- Add jitter to retry backoff where synchronized retries could create bursts.
- Prefer fallback behavior only when correctness and product semantics are explicit.

## Exceptions
Deviations require failure-mode analysis, bounded risk, observability, and approval for production behavior.

## Verification
Use fault injection, timeout tests, retry-count metrics, traces, cancellation tests, and dependency-failure load tests.