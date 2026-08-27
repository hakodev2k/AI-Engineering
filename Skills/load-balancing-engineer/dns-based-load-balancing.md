# DNS-Based Load Balancing

## Purpose
Use DNS safely as a traffic-steering layer while accounting for caching, resolver behavior, TTLs, and failover delay.

## When to use
Use for global steering, active-active regions, endpoint migration, weighted rollout, or DNS failover.

## Inputs
Zones, records, TTLs, resolver population, health checks, target endpoints, routing policy, and failover objectives.

## Context to inspect
Inspect authoritative DNS, delegation, DNSSEC, CNAME chains, client resolver behavior, negative caching, and current TTLs.

## Core knowledge
DNS controls answers, not established connections. Recursive resolvers cache records and may not honor intended granularity. Low TTL increases query load but cannot guarantee instant failover. Changes must consider propagation and rollback.

## Procedure
1. Map the resolution chain.
2. Measure current resolver and TTL behavior.
3. Define weighted, latency, geo, or failover policy.
4. Validate target health independently.
5. Choose TTL based on change rate and DNS load.
6. Reduce TTL ahead of planned migration when justified.
7. Test answers from representative regions and resolvers.
8. Execute staged weight changes.
9. Monitor DNS answers and endpoint traffic.
10. Restore stable TTL after migration.

## Decision points
Use DNS for coarse endpoint selection, not per-request balancing. Prefer lower TTL during controlled transitions, higher TTL for stable operation and resilience to authoritative outages.

## Common failure patterns
Assuming TTL equals failover time; changing records without lowering TTL beforehand; unhealthy CNAME target; resolver concentration; forgetting negative caching.

## Verification
Query authoritative and recursive resolvers, confirm expected answer distribution, and correlate DNS changes with actual traffic movement.

## Expected output
A DNS steering configuration, TTL strategy, validation evidence, and rollback plan.

## Stop conditions
Stop when DNS ownership is unclear, DNSSEC integrity could be affected without approval, or target health cannot be established.