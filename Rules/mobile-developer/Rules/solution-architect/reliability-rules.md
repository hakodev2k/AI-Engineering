# Reliability Rules

## Purpose
Design systems that behave predictably under component failures and recover without hidden data loss.

## Scope
Applies to critical workflows, dependencies, stateful components, queues, caches, and external services.

## MUST
- Critical workflows MUST identify failure modes and expected behavior for dependency, timeout, partial, and restart failures.
- Retries MUST be bounded and combined with timeout, backoff, and idempotency where needed.
- Stateful systems MUST define recovery and reconciliation after partial failure.
- Single points of failure MUST be accepted only when aligned with business impact and recovery targets.
- Reliability controls MUST be observable so operators can distinguish healthy, degraded, and failed states.

## MUST NOT
- MUST NOT retry non-idempotent operations blindly.
- MUST NOT allow cascading failure by using unbounded concurrency, queues, or retry storms.
- MUST NOT equate process uptime with business workflow reliability.

## SHOULD
- Use graceful degradation when it preserves meaningful user value safely.
- Test realistic failure paths rather than only happy paths.

## Exceptions
Low-criticality components may accept simpler recovery with documented impact.

## Verification
Use chaos/failure tests, dependency simulations, recovery drills, metrics, logs, queue behavior, and business-level success indicators.