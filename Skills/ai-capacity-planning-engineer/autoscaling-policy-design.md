# Autoscaling Policy Design

## Purpose
Design autoscaling policies for AI workloads that balance latency, queueing, utilization, warm-up time, and cost.

## When to use
Use for inference fleets, asynchronous AI workers, elastic training services, or recurring saturation/overprovisioning.

## Inputs
Traffic patterns, queue depth, utilization, latency SLOs, replica startup time, model load time, minimum capacity, scaling limits.

## Preconditions
Scaling signals must be observable and causally related to capacity pressure.

## Context to inspect
Horizontal/vertical scaling, warm pools, model loading, scheduler, cooldowns, traffic routing, provider quotas, failover reserve.

## Core knowledge
GPU workloads often scale slowly because nodes must provision and models must load. Reactive scaling alone may miss short demand spikes, so predictive or scheduled capacity can be necessary.

## Procedure
1. Identify the leading indicator of saturation.
2. Measure startup and model-warm time.
3. Define scale-out and scale-in thresholds.
4. Add hysteresis and cooldowns.
5. Preserve minimum failover capacity.
6. Model burst scenarios.
7. Test warm-pool or scheduled scaling where needed.
8. Validate quota and scheduler behavior.
9. Monitor oscillation and unmet demand.

## Decision points
Use queue-based signals for asynchronous workloads and latency/concurrency signals for interactive serving. Use scheduled scaling for predictable peaks.

## Common failure patterns
Scaling on GPU utilization alone, scale-in thrashing, ignoring model load time, and exhausting cloud quota during emergencies.

## Verification
Load tests demonstrate timely scale-out, stable scale-in, and SLO compliance across representative bursts.

## Expected output
A documented autoscaling policy with signals, thresholds, limits, and validation evidence.

## Stop conditions
Escalate when infrastructure lead time is longer than the workload can tolerate and no warm reserve exists.