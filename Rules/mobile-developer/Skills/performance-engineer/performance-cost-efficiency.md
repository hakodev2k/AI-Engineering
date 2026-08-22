# Performance and Cost Efficiency

## Purpose
Optimize useful work per unit of infrastructure cost while preserving required latency, throughput, reliability, and operational safety.

## When to use
Use for cloud cost pressure, low utilization, expensive scaling, architecture comparisons, or optimizations that trade resource consumption against performance.

## Inputs
Performance metrics, utilization, capacity curves, cloud/infrastructure costs, workload forecasts, SLOs, and scaling configuration.

## Context to inspect
Inspect CPU/memory requests and limits, idle capacity, autoscaling, database tiers, cache/storage/network costs, regional topology, licensing, and reserved/committed capacity.

## Core knowledge
Cheapest infrastructure is not necessarily most cost-efficient if it increases latency, retries, operational toil, or instance count. Evaluate cost per useful transaction/job and required headroom.

## Procedure
1. Define the performance constraints that cannot be violated.
2. Calculate cost per unit of useful work for major components.
3. Identify low-utilization and overprovisioned resources.
4. Identify high-cost bottlenecks driving scale.
5. Measure whether code/query/cache improvements reduce required capacity.
6. Compare rightsizing, scale-out, scale-up, and service-tier options.
7. Include redundancy and peak headroom.
8. Model network/storage/request-based charges.
9. Test candidate changes under representative load.
10. Monitor post-change cost and SLO trends.

## Decision points
Prefer efficiency improvements when they reduce both latency and resource demand; rightsize when headroom remains adequate; accept higher cost when it materially protects required SLOs or resilience.

## Common failure patterns
Optimizing monthly spend while increasing failure risk, removing all headroom, comparing instance price rather than useful throughput, and ignoring managed-service/network costs.

## Verification
Show lower cost per useful work unit or lower required capacity while all defined performance and reliability targets remain satisfied.

## Expected output
A cost/performance model with verified optimization choices and retained headroom.

## Stop conditions
Escalate when changes alter resilience commitments or require financial commitments outside authority.