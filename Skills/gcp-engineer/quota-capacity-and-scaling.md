# Quota, Capacity, and Scaling

## Purpose
Prevent production saturation by managing GCP quotas, service limits, regional capacity, autoscaling bounds, and dependency headroom.

## When to use
Use before launches, seasonal events, regional expansion, scaling incidents, or major architecture changes.

## Inputs
Traffic forecast, resource model, service quotas, regional footprint, autoscaling policy, and dependency capacities.

## Context to inspect
Quotas, current utilization, rate limits, autoscaler history, MIG/GKE/Cloud Run limits, database connections, Pub/Sub backlog, and load-balancer metrics.

## Core knowledge
Cloud elasticity is constrained by quotas, downstream limits, provisioning time, and regional capacity. Autoscaling can amplify overload into dependent systems.

## Procedure
1. Translate business traffic into resource demand.
2. Identify hard service quotas and soft operational limits.
3. Measure current headroom by region.
4. Request quota increases early.
5. Set autoscaling minimums and maximums intentionally.
6. Protect stateful dependencies with connection/rate controls.
7. Pre-warm or reserve capacity when startup time matters.
8. Load test beyond expected peak.
9. Define graceful degradation behavior.
10. Monitor capacity margin continuously.

## Decision points
Scale out for parallelizable stateless load; scale up when single-instance constraints dominate. Add queueing when burst smoothing is acceptable.

## Common failure patterns
Unlimited autoscaling, quota requests during incidents, ignoring regional stock constraints, and testing only average load.

## Verification
Run peak-load and dependency-saturation tests and confirm alerts fire before hard limits are reached.

## Expected output
A quantified capacity and quota plan.

## Stop conditions
Stop launch approval when required quota or failover capacity is not confirmed.