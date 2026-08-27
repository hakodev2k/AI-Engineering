# Multi-Zone Failure-Domain Design

## Purpose
Design balancing across zones and failure domains so redundancy survives infrastructure loss without hidden correlated dependencies.

## When to use
Use for high-availability services, zone expansion, topology redesign, or post-incident resilience work.

## Inputs
Zone topology, backend placement, cross-zone capability, capacity, latency, network cost, dependency placement, and availability targets.

## Context to inspect
Inspect balancer nodes, backend distribution, subnet/routing, NAT, shared dependencies, autoscaling, and provider failure semantics.

## Core knowledge
Redundancy requires independent failure domains, not merely multiple instances. Cross-zone balancing improves utilization but can increase inter-zone dependency and cost. Zonal affinity limits blast radius but requires local spare capacity.

## Procedure
1. Map every component to a failure domain.
2. Identify shared dependencies that defeat zone independence.
3. Measure per-zone demand and capacity.
4. Decide cross-zone versus zonal routing.
5. Reserve capacity for one-zone loss.
6. Define health and withdrawal behavior.
7. Test asymmetric zone degradation and complete loss.
8. Verify autoscaling does not concentrate replacements in a failed domain.
9. Measure cross-zone traffic and latency.
10. Document failure expectations.

## Decision points
Prefer zonal locality for isolation and cost when each zone has enough headroom; use cross-zone balancing when utilization efficiency and uneven demand dominate.

## Common failure patterns
Three zones sharing one NAT or database path; no N-1 capacity; health checks originating outside failed path; cross-zone traffic surprise; replacement capacity scheduled into impaired zone.

## Verification
Failure tests must show continued service within SLO and surviving zones below safe capacity thresholds.

## Expected output
A failure-domain map, routing policy, N-1 capacity evidence, and tested recovery plan.

## Stop conditions
Escalate when critical dependencies are single-zone or surviving capacity cannot meet required availability.