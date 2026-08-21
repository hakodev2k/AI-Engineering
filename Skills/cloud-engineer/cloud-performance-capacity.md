# Cloud Performance and Capacity

## Purpose
Diagnose cloud bottlenecks and plan capacity using measured workload behavior rather than assumptions.

## When to use
Use for latency regressions, saturation, growth planning, scaling design, and performance-sensitive migrations.

## Inputs
Traffic, latency percentiles, resource metrics, quotas, dependency timings, workload forecasts, SLOs.

## Context to inspect
Compute, storage, databases, network, autoscaling, connection pools, throttling, quotas, caches, managed-service limits.

## Core knowledge
Performance is constrained by the slowest saturated dependency. Cloud elasticity is not instantaneous and provider quotas can become hard capacity limits.

## Procedure
1. Define the affected user-visible metric.
2. Establish baseline and reproduction conditions.
3. Trace latency across dependencies.
4. Inspect CPU, memory, I/O, network, connections, and throttling.
5. Separate resource saturation from inefficient application behavior.
6. Validate autoscaling signals and lag.
7. Check service quotas and regional capacity.
8. Benchmark candidate changes.
9. Model expected growth and headroom.
10. Re-measure after changes.

## Decision points
Scale up for simple immediate headroom; scale out when workload partitioning and resilience benefit. Optimize before scaling when inefficiency is dominant.

## Common failure patterns
Average-only metrics, scaling without bottleneck evidence, ignoring downstream limits, no load test, and assuming autoscaling prevents overload.

## Verification
Run representative load and confirm percentile latency, saturation, errors, and scaling remain within targets.

## Expected output
Evidence-based bottleneck findings and a capacity plan.

## Stop conditions
Escalate provider capacity constraints or performance targets incompatible with architecture.