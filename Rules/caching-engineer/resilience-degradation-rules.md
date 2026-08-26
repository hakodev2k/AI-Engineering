# Resilience and Graceful Degradation

## Purpose
Keep cache failures from cascading into broader outages.

## Scope
Timeouts, circuit breaking, fallback, stale serving, origin protection, and dependency failure.

## MUST
- Cache clients MUST use bounded connection, operation, and retry behavior appropriate to request budgets.
- The system MUST define behavior for cache unavailable, slow, partially partitioned, and returning stale data.
- Cache bypass or fallback MUST account for origin capacity before activation at scale.
- Critical fallback paths MUST be exercised before production incidents.

## MUST NOT
- Retries MUST NOT be unbounded or multiply across layers without a retry budget.
- Cache failure MUST NOT automatically redirect unrestricted full traffic to an origin that cannot sustain it.
- Fail-open behavior MUST NOT bypass security or correctness requirements.

## SHOULD
- Use stale serving, load shedding, circuit breakers, or degraded responses when consistent with business requirements.

## Exceptions
Require quantified dependency capacity, accepted user impact, mitigation, and approval for high-risk behavior.

## Verification
Run cache outage, latency, partition, and origin-saturation tests; inspect timeout, retry, fallback, error, and saturation telemetry.