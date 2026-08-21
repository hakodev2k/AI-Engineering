# Capacity and Performance Engineering

## Purpose
Keep platforms performant under current and forecast load while controlling cost.

## When to use
Use for scaling decisions, saturation incidents, capacity reviews, performance regressions, or major traffic events.

## Inputs
Traffic history, concurrency, CPU/memory/IO/network metrics, latency SLOs, growth forecast, autoscaling behavior.

## Context to inspect
Resource utilization, queue depth, throttling, connection pools, quotas, limits, autoscaling events, load-test results.

## Core knowledge
Capacity planning is about bottlenecks and headroom, not average CPU. Tail latency, burst behavior, quotas, dependencies, and scaling lag often dominate.

## Procedure
1. Establish baseline demand and latency.
2. Identify saturation signals by resource.
3. Measure peak and burst patterns.
4. Check dependency and provider quotas.
5. Load test representative scenarios.
6. Determine scaling unit and lead time.
7. Configure autoscaling with safe bounds.
8. Reserve headroom for failure/maintenance.
9. Forecast growth and cost.
10. Revisit after architecture or traffic changes.

## Decision points
Scale up for simplicity when vertical headroom exists; scale out when workload supports partitioning; pre-scale for predictable events when autoscaling lag is material.

## Common failure patterns
Sizing from averages, no quota review, autoscaling on noisy signals, ignoring downstream limits, load testing unrealistic traffic.

## Verification
Load test meets SLO with target headroom, autoscaling behaves under burst, and quotas exceed expected peak.

## Expected output
Measured capacity model and scaling policy.

## Stop conditions
Stop when observed bottleneck requires application redesign outside platform scope.