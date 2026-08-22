# Capacity Planning

## Purpose
Forecast and validate the resources required to meet reliability and performance targets under expected and abnormal load.

## When to use
Use before launches, traffic growth, seasonal peaks, architecture changes, or when saturation appears in incidents.

## Inputs
Traffic history, growth forecasts, SLOs, resource utilization, latency curves, queue depth, dependency limits, autoscaling policy, cost constraints.

## Preconditions
Baseline workload and bottleneck measurements must exist.

## Context to inspect
CPU, memory, I/O, connections, thread pools, database limits, queue throughput, cache capacity, regional quotas, autoscaling behavior, and dependency quotas.

## Core knowledge
Capacity is constrained by the first saturated resource and by dependency ceilings. Average utilization is insufficient; peak demand, burstiness, headroom, failover load, and recovery backlog matter.

## Procedure
1. Establish current throughput and resource baseline.
2. Identify limiting resources and dependency quotas.
3. Model expected growth and peak multipliers.
4. Reserve headroom for failover, deployments, and recovery.
5. Load test representative critical paths.
6. Determine scaling thresholds and cooldown behavior.
7. Validate database, queue, cache, network, and third-party capacity.
8. Test degraded scenarios such as one region or node unavailable.
9. Document capacity assumptions and trigger points for review.
10. Monitor forecast error and refine the model.

## Decision points
Scale vertically for simple short-term relief when platform limits allow; scale horizontally when architecture supports partitioning and elasticity. Pre-provision when startup latency or quota acquisition makes reactive scaling unsafe.

## Common failure patterns
Planning from averages, ignoring failover capacity, testing only stateless tiers, assuming autoscaling is instantaneous, and overlooking external quotas.

## Verification
Demonstrate target throughput under peak and failure scenarios while SLOs remain satisfied and critical resources retain agreed headroom.

## Expected output
Capacity model, bottleneck evidence, scaling thresholds, quota requirements, and review triggers.

## Stop conditions
Escalate when projected demand exceeds architectural limits, required quotas are unavailable, or cost/risk trade-offs require business approval.