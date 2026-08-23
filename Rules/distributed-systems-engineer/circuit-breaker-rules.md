# Circuit Breaker Rules

## Purpose
Limit repeated calls to unhealthy dependencies and accelerate recovery.

## Scope
Remote service calls and dependency access paths.

## MUST
- Circuit-breaker thresholds MUST be based on meaningful failure and latency signals.
- Open, half-open, and recovery behavior MUST be bounded and observable.
- Fallback behavior MUST be safe for the business operation.

## MUST NOT
- MUST NOT use circuit breakers to hide persistent dependency failure.
- MUST NOT return fabricated success when the dependency result is required for correctness.

## SHOULD
- Breaker policy SHOULD be tuned using production or representative load evidence.

## Exceptions
No breaker is acceptable when fail-fast behavior already bounds damage and is documented.

## Verification
Test dependency failure, recovery, half-open probes, fallback behavior, and breaker metrics.