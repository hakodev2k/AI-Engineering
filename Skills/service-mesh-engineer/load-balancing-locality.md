# Load Balancing and Locality

## Purpose
Choose mesh load-balancing and locality behavior that preserves availability while controlling latency and cross-zone cost.

## When to use
Use for uneven load, multi-zone traffic, hot endpoints or locality-aware routing.

## Inputs
Endpoint topology, request distribution, zone capacity, latency, failure domains and cost constraints.

## Context to inspect
Service discovery, endpoint weights, health/ejection settings, session affinity and autoscaling behavior.

## Core knowledge
Round-robin is simple but ignores heterogeneous latency and capacity. Least-request can improve balance but reacts to queueing. Locality reduces latency/cost but can overload a zone during imbalance.

## Procedure
1. Measure per-endpoint and per-zone load.
2. Confirm endpoint metadata and health accuracy.
3. Identify affinity requirements.
4. Select an algorithm aligned with workload behavior.
5. Define locality preference and failover.
6. Ensure spare capacity for zone failures.
7. Test endpoint churn and asymmetric capacity.
8. Observe distribution, tail latency and cross-zone traffic.
9. Tune gradually and document assumptions.

## Decision points
Prefer simple balancing unless measurements show a problem. Use locality only with capacity-aware failover. Use consistent hashing only for justified affinity and understand rebalance effects.

## Common failure patterns
Locality concentrating overload, stale health, hash hotspots, aggressive outlier ejection and balancing that fights autoscaling.

## Verification
Load test normal and zone-failure scenarios; verify distribution, failover time, saturation and recovery.

## Expected output
A measured load-balancing policy with failure-domain behavior.

## Stop conditions
Stop when topology metadata is unreliable or failover capacity is insufficient.