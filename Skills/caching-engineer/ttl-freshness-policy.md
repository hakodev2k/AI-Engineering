# TTL and Freshness Policy

## Purpose
Set expiration and freshness rules from business correctness and workload evidence rather than arbitrary durations.

## When to use
Use for new cache entries, stale-data incidents, mass expirations, excessive misses, or origin overload.

## Inputs
Freshness SLA, update frequency, request rate, miss cost, invalidation capability, failure tolerance.

## Context to inspect
Inspect source update patterns, current TTLs, expiration distribution, hit ratio, stale-read reports, and dependency outages.

## Core knowledge
TTL is a correctness and load-control mechanism. Short TTLs improve eventual freshness but increase misses; long TTLs increase reuse but widen stale windows. Jitter prevents synchronized expiry. Soft and hard TTLs can separate serving freshness from refresh deadlines.

## Procedure
1. Translate business freshness into a maximum stale window.
2. Measure update and access distributions.
3. Determine whether explicit invalidation is reliable.
4. Choose hard TTL, and soft TTL when background refresh is useful.
5. Add bounded random jitter for high-cardinality or synchronized populations.
6. Define stale-if-error behavior where acceptable.
7. Model origin load at steady state and mass expiry.
8. Implement metrics by namespace.
9. Test expiry, refresh, clock assumptions, and dependency failure.
10. Recalibrate from observed hit rate and stale-read evidence.

## Decision points
Prefer invalidation plus safety TTL for correctness-sensitive mutable data. Prefer TTL-only for naturally disposable data when staleness is acceptable. Use no-cache for data whose stale exposure is unacceptable and invalidation cannot be guaranteed.

## Common failure patterns
One global TTL; no jitter; infinite TTL without invalidation; TTL shorter than typical reuse distance; silently extending stale data during outages.

## Verification
Measure stale age, hit ratio, miss rate, refresh rate, and origin amplification; simulate simultaneous expiry.

## Expected output
Per-namespace freshness contract and expiration policy supported by load and correctness evidence.

## Stop conditions
Stop when no owner can define acceptable staleness or outage behavior.