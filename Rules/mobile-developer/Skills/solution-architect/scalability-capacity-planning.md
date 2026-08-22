# Scalability and Capacity Planning

## Purpose
Design and validate capacity so systems handle expected growth and peaks without speculative overengineering.

## When to use
Use for growth planning, launches, seasonal peaks, new workloads, and scaling bottlenecks.

## Inputs
Traffic forecasts, workload shape, latency targets, resource usage, data growth, dependency limits, cost constraints.

## Preconditions
Representative workload units and success metrics are defined.

## Context to inspect
Current throughput, percentiles, CPU/memory/IO, queue depth, database limits, connection pools, rate limits, partitioning, autoscaling behavior.

## Core knowledge
Scalability depends on the bottleneck. Horizontal scaling does not solve shared-state, database, lock, or downstream constraints. Capacity should include headroom and degraded-mode behavior.

## Procedure
1. Define workload model and peak assumptions.
2. Measure baseline resource cost per workload unit.
3. Identify likely saturation points.
4. Evaluate vertical and horizontal scaling options.
5. Check state, partitioning, and coordination constraints.
6. Validate dependency quotas and connection limits.
7. Define autoscaling metrics and safe bounds.
8. Include growth in data size and background workloads.
9. Run load tests to saturation.
10. Record capacity envelope, headroom, and triggers for scale changes.

## Decision points
Scale up for simplicity when limits and cost are acceptable. Scale out when workload parallelizes and state/coordination design supports it.

## Common failure patterns
Scaling app tier while database saturates, CPU-only autoscaling, no load model, unrealistic test data, ignoring cold starts or queue backlog.

## Verification
Load tests prove target throughput/latency with documented headroom and bottleneck behavior.

## Expected output
Capacity model, scaling strategy, limits, and operational thresholds.

## Stop conditions
Stop when demand forecast or dependency quota is too uncertain to make a defensible design.