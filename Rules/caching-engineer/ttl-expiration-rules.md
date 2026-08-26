# TTL and Expiration

## Purpose
Bound staleness and resource consumption with explicit expiration policy.

## Scope
Time-based expiration, sliding expiration, refresh windows, and retention controls.

## MUST
- Every cached data class MUST define whether expiration is required and how its TTL relates to business staleness tolerance.
- TTL selection MUST account for update frequency, recomputation cost, failure modes, and origin load after expiry.
- Safety-sensitive or authorization-sensitive values MUST use expiration compatible with revocation requirements.
- TTL changes with material origin-load impact MUST be capacity-reviewed before production rollout.

## MUST NOT
- Infinite TTL MUST NOT be used for mutable data without a proven invalidation mechanism and recovery procedure.
- TTLs MUST NOT be synchronized across large populations when simultaneous expiry can overload dependencies.
- Sliding expiration MUST NOT silently extend data beyond its maximum acceptable staleness.

## SHOULD
- Apply bounded jitter to large cache populations where synchronized expiry is possible.
- Prefer explicit freshness budgets over arbitrary round-number TTLs.

## Exceptions
Exceptions require stated freshness risk, dependency capacity evidence, recovery plan, and approval where production impact is material.

## Verification
Review configuration, freshness tests, expiry distributions, load tests, origin metrics, and revocation tests.