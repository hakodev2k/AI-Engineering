# Scalability and Capacity Planning

## Purpose
Design systems that meet growth targets through evidence-based capacity models and appropriate scaling strategies.

## When to use
Use when traffic is growing, bottlenecks appear, infrastructure cost rises, or new scale targets are introduced.

## Inputs
Traffic profiles, latency/throughput targets, resource utilization, workload mix, data growth, dependency limits, cost constraints.

## Context to inspect
CPU, memory, I/O, database limits, queue depth, connection pools, hot partitions, autoscaling rules, and historical peaks.

## Core knowledge
Scaling problems are workload-specific. Horizontal scaling helps only when state, coordination, and bottlenecks permit it. Capacity planning requires headroom for variance and failures.

## Procedure
1. Establish peak and sustained workload characteristics.
2. Measure current saturation points.
3. Build a simple capacity model.
4. Identify the first constrained resource.
5. Reduce avoidable work before adding capacity.
6. Choose scale-up, scale-out, partitioning, caching, or asynchronous buffering based on the bottleneck.
7. Define headroom and autoscaling thresholds.
8. Load-test at target and failure scenarios.
9. Recalculate cost and operational complexity.

## Decision points
Scale up for simplicity when limits and cost permit; scale out when independent workers can share load safely. Partition only when a real scaling boundary exists.

## Common failure patterns
Autoscaling on the wrong metric, ignoring database bottlenecks, assuming statelessness, hot partitions, no capacity headroom, and scaling before profiling.

## Verification
Load tests meet target throughput and latency with acceptable utilization, headroom, failure behavior, and cost.

## Expected output
A capacity model, bottleneck analysis, scaling strategy, and measurable validation criteria.

## Stop conditions
Stop when production workload characteristics or dependency quotas are unknown enough to invalidate the model.