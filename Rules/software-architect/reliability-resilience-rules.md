# Reliability and Resilience Rules

## Purpose
Design systems that tolerate expected failures without creating uncontrolled cascades.

## Scope
Applies to availability, dependency failure, retries, timeouts, circuit breaking, graceful degradation, and recovery.

## MUST
- Critical dependencies MUST have explicit failure, timeout, and recovery behavior.
- Availability targets MUST map to architecture decisions and dependency assumptions.
- Retry behavior MUST be bounded and coordinated to avoid amplification.
- Critical workflows MUST define behavior for partial failure and degraded operation.

## MUST NOT
- MUST NOT assume downstream services or infrastructure are continuously available.
- MUST NOT use infinite retries or unbounded queues.
- MUST NOT create a single failure domain for critical capabilities without documented risk acceptance.

## SHOULD
- Prefer bulkheads, rate limits, backpressure, and graceful degradation where failure propagation is plausible.
- Prefer resilience mechanisms validated under failure conditions.

## Exceptions
Reduced resilience may be acceptable for non-critical paths when impact and recovery expectations are explicit.

## Verification
Use chaos/failure tests, dependency simulations, recovery drills, SLO evidence, traces, and incident history.