# Failure Tolerance Rules

## Purpose
Limit cascading failures and preserve acceptable behavior when components degrade.

## Scope
Applies to retries, timeouts, circuit breaking, queues, redundancy, backpressure, and graceful degradation.

## MUST
- Remote calls MUST have bounded timeouts appropriate to end-to-end latency budgets.
- Retry policies MUST be bounded, observable, and safe for the operation's idempotency characteristics.
- Critical dependency failures MUST have an explicit containment or degradation strategy.
- Backpressure or load shedding MUST protect shared resources when overload can cascade.

## MUST NOT
- MUST NOT use unbounded retries or waits in production request paths.
- MUST NOT retry non-idempotent operations without a mechanism preventing duplicate side effects.
- MUST NOT assume redundancy is effective without testing common-mode and failover behavior.

## SHOULD
- Introduce jitter for distributed retry behavior where synchronized retries can amplify load.
- Test dependency degradation and recovery under realistic conditions.

## Exceptions
Exceptions require documented failure model, rationale, residual risk, and verification evidence.

## Verification
Inspect client policies, timeout budgets, retry metrics, failure tests, dependency simulations, and production saturation telemetry.
