# DNS Traffic Management and GSLB

## Purpose
Use DNS-based traffic steering for regional distribution, failover, and proximity while respecting caching semantics.

## When to use
Multi-region applications, disaster recovery, latency steering, weighted rollout, or DNS failover.

## Inputs
Endpoints, regions, health signals, traffic policy, TTLs, capacity, user geography, RTO/RPO, provider features.

## Context to inspect
Resolver geography, EDNS Client Subnet behavior, health-check vantage points, endpoint capacity, CDN/LB layers, TTL/cache behavior.

## Core knowledge
DNS steering chooses answers, not individual connections, and recursive resolvers cache them. Failover speed is bounded by health detection plus caches and client behavior.

## Procedure
1. Define steering goal and failure scenarios.
2. Establish endpoint capacity and independent health criteria.
3. Choose weighted, latency, geo, or failover policy.
4. Set TTL from acceptable failover time and query load.
5. Avoid health checks that depend on the same failing DNS path.
6. Stage low-weight traffic first.
7. Observe regional traffic and errors.
8. Test endpoint and region failures.
9. Validate recovery/failback hysteresis.
10. Document manual override.

## Decision points
Use DNS steering for coarse regional placement; use load balancers/anycast for finer connection-level control. Prefer application-level health checks when they reliably represent readiness.

## Common failure patterns
TTL assumed as guaranteed client refresh, false-positive health checks, failing over to insufficient capacity, geo mismatch due resolver location, and oscillating failback.

## Verification
Confirm returned answers by region/resolver, measured traffic distribution, health-triggered failover, capacity, and recovery.

## Expected output
Traffic policy, health model, TTL rationale, failover evidence, and override runbook.

## Stop conditions
Stop if backup capacity is unverified, health signals are unreliable, or failover would violate data/state constraints.