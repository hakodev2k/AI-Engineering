# GPU Cost Optimization

## Purpose
Reduce accelerator cost without degrading required model quality, throughput, latency, reliability, or delivery speed.

## When to use
Use for rising GPU spend, poor utilization, large idle reservations, or architecture reviews.

## Inputs
Billing data, utilization, queue time, model/runtime profiles, instance pricing, SLOs, reservation commitments.

## Context to inspect
Idle capacity, fragmentation, workload priority, hardware fit, batching, autoscaling, storage/network charges, preemptible usage, and scheduling policy.

## Core knowledge
Cost optimization must distinguish unit cost from total business cost. Cheaper hardware can be more expensive if jobs run longer or engineering complexity increases.

## Procedure
1. Attribute spend by workload, tenant, model, and environment.
2. Establish cost per useful unit such as training run, token, image, or request.
3. Identify idle, fragmented, and low-utilization capacity.
4. Match workload requirements to accelerator classes.
5. Evaluate batching, precision, compilation, and scheduling improvements.
6. Test spot/preemptible capacity for restart-safe workloads.
7. Compare reserved commitments against sustained baseline demand.
8. Remove abandoned resources and stale reservations.
9. Re-measure SLOs and unit economics after changes.

## Decision points
Use cheaper/preemptible capacity when recovery is safe; dedicated premium capacity when latency or availability dominates. Optimize utilization before buying commitments.

## Common failure patterns
Optimizing raw hourly price, lowering capacity below failure headroom, hidden egress/storage costs, and driving utilization so high that queues violate SLOs.

## Verification
Compare cost per workload unit, queueing, runtime, SLOs, and reliability before and after optimization.

## Expected output
A prioritized, evidence-based GPU cost optimization plan.

## Stop conditions
Stop when cost attribution or workload SLOs are too incomplete to measure impact.