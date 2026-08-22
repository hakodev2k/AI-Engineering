# Capacity and Scalability

## Purpose
Translate workload growth and SLOs into measurable capacity limits and safe scaling strategies.

## When to use
Use before launches, traffic growth, architecture changes, seasonal events, and when saturation or cost becomes material.

## Inputs
Traffic forecasts, workload mix, latency targets, resource metrics, storage growth, dependency quotas, and cost constraints.

## Context to inspect
Inspect CPU, memory, I/O, connections, queue lag, partition load, database capacity, autoscaling, and third-party quotas.

## Core knowledge
Scalability is workload-specific. Throughput, concurrency, service time, queueing, skew, and state placement determine limits. Scaling one tier can expose the next bottleneck.

## Procedure
1. Define representative workload units and SLOs.
2. Measure baseline throughput and resource consumption.
3. Identify bottleneck resources and hard quotas.
4. Model expected growth and burst factors.
5. Load-test increasing traffic until a clear limit appears.
6. Distinguish vertical, horizontal, partition, and asynchronous scaling options.
7. Validate downstream capacity at each proposed scale point.
8. Define autoscaling signals and safe minimum/maximum bounds.
9. Maintain headroom for failure and traffic variance.
10. Re-test after material architecture changes.

## Decision points
Scale out stateless work when parallelism is natural; partition state when one node/store is the limit; optimize before scaling when waste is dominant and measurable.

## Common failure patterns
Linear extrapolation without skew, autoscaling after queues already explode, ignoring database/third-party limits, and benchmarking unrealistic workloads.

## Verification
Produce repeatable load results showing saturation point, SLO behavior, scaling response, and recovery.

## Expected output
A capacity model, bottleneck map, scaling plan, and alert thresholds.

## Stop conditions
Escalate when realistic workload data is unavailable and a high-risk capacity decision would otherwise be speculative.