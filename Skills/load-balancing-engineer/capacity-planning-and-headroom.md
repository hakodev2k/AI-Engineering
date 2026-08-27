# Capacity Planning and Headroom

## Purpose
Size load-balancing tiers and backend pools for peak, burst, and failure-redistributed traffic with measurable safety margin.

## When to use
Use for growth planning, architecture reviews, regional failover, scaling limits, or saturation incidents.

## Inputs
RPS, CPS, bandwidth, packet rate, concurrency, TLS rate, resource utilization, quotas, and growth forecast.

## Context to inspect
Inspect historical peaks, seasonality, load tests, autoscaling lag, instance limits, network quotas, and failure-domain capacity.

## Core knowledge
Capacity is multidimensional. A tier can saturate on CPU, memory, bandwidth, packets, connections, ports, TLS handshakes, or provider quota. Headroom must reflect burst duration, scaling lead time, and failure redistribution.

## Procedure
1. Establish resource-specific utilization baselines.
2. Identify the first saturating dimension.
3. Derive safe per-unit capacity from load tests and production.
4. Model peak plus forecast growth.
5. Model zone and region loss.
6. Include retry and reconnect amplification.
7. Set headroom targets and scaling thresholds.
8. Verify provider and network quotas.
9. Run capacity tests near the planned envelope.
10. Review forecasts periodically.

## Decision points
Scale out when horizontal distribution improves resilience and limits permit; scale up when per-node bottlenecks or operational simplicity dominate. Reserve more headroom when scaling is slow or traffic is bursty.

## Common failure patterns
Using CPU as the only signal; ignoring failover load; relying on autoscaling beyond quotas; testing average payloads only; no capacity for reconnect storms.

## Verification
Demonstrate target load plus failure scenario stays below defined saturation thresholds with acceptable latency and errors.

## Expected output
A capacity model, headroom policy, scaling thresholds, and quota checklist.

## Stop conditions
Escalate when no representative load test exists, critical quotas cannot be raised, or failover demand exceeds surviving capacity.