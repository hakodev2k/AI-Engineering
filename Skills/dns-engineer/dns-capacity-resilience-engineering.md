# DNS Capacity and Resilience Engineering

## Purpose
Size DNS platforms and eliminate correlated failure for peak load, attacks, and dependency outages.

## When to use
Growth planning, HA review, DDoS preparation, resolver saturation, or regional resilience design.

## Inputs
QPS history, peak/attack profiles, latency, resource utilization, topology, provider limits, cache ratios, growth forecast.

## Context to inspect
CPU/memory/network, socket/concurrency limits, cache size, authority/recursive separation, anycast, load balancing, upstream dependencies, and site/provider diversity.

## Core knowledge
DNS is lightweight per query but bursty and externally critical. Plan normal, failover, cold-cache, and abuse states. Redundancy must not share hidden network/provider/control dependencies.

## Procedure
1. Baseline QPS percentiles, bursts, response sizes, and errors.
2. Segment recursive versus authoritative workloads.
3. Measure resource cost for representative query mixes.
4. Model node/site/provider loss.
5. Model cold-cache amplification on recursive resolvers.
6. Reserve headroom for growth and attack conditions.
7. Validate network and DDoS capacity, not only server CPU.
8. Load-test in safe environments.
9. Define scaling and failover thresholds.
10. Test failure and recovery behavior.

## Decision points
Scale out for failure isolation and query distribution; scale up when state/cache locality and simplicity dominate. Use managed authoritative providers when global DDoS resilience outweighs control requirements.

## Common failure patterns
Sizing from average QPS, identical redundant servers on one dependency, ignoring response-size bandwidth, no cold-cache test, and failover targets without spare capacity.

## Verification
Demonstrate target QPS/latency under peak and N-1 conditions, stable failover, and sufficient network/resource headroom.

## Expected output
Capacity model, resilience topology, exhaustion thresholds, test evidence, and upgrade plan.

## Stop conditions
Escalate when attack assumptions exceed available mitigation, telemetry is insufficient, or required resilience cannot be met by current architecture.