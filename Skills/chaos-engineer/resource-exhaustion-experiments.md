# Resource Exhaustion Experiments

## Purpose
Validate service behavior when CPU, memory, disk, file descriptors, connections, threads, or other finite resources approach exhaustion.

## When to use
Use for services with capacity limits, bursty workloads, memory-sensitive runtimes, connection-heavy systems, or prior saturation incidents.

## Inputs
Capacity metrics, runtime limits, autoscaling configuration, quotas, memory profiles, connection pools, thread pools, disk usage, and SLOs.

## Preconditions
The experiment can be constrained to isolated instances, containers, or controlled traffic and can be terminated automatically.

## Context to inspect
Requests and limits, garbage collection, queue bounds, pool sizes, autoscaling thresholds, eviction behavior, disk reservations, backpressure, and load shedding.

## Core knowledge
Resource exhaustion often creates nonlinear degradation. A saturated component can increase latency, trigger retries, grow queues, and spread pressure across dependencies. Senior analysis focuses on graceful degradation, bounded queues, fairness, and recovery rather than merely observing a crash.

## Procedure
1. Select the resource and target component.
2. Establish baseline utilization and headroom.
3. Define the expected saturation behavior.
4. Set abort thresholds for user impact and host health.
5. Increase pressure gradually within the approved scope.
6. Observe latency, queue growth, errors, throttling, and autoscaling.
7. Check whether load shedding or backpressure activates.
8. Inspect downstream and neighboring services for propagated pressure.
9. Remove the pressure and measure recovery.
10. Confirm resources, pools, and queues return to healthy levels.

## Decision points
Prefer gradual saturation when identifying thresholds; use abrupt pressure when validating protective controls. Test one resource at a time unless combined exhaustion is a known production risk.

## Common failure patterns
Unbounded queues; autoscaling too slow to matter; memory pressure causing restart loops; disk exhaustion breaking logging or recovery; connection leaks; and recovery that leaves pools or caches degraded.

## Verification
Compare observed saturation thresholds and recovery behavior against capacity assumptions and SLOs. Confirm protective mechanisms engaged before unacceptable customer impact.

## Expected output
Measured resource thresholds, failure propagation evidence, recovery behavior, and capacity or control improvements.

## Stop conditions
Stop when system health crosses abort thresholds, neighboring workloads are affected unexpectedly, or cleanup cannot be guaranteed.