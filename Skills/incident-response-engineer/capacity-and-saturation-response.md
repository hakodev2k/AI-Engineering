# Capacity and Saturation Response

## Purpose
Diagnose and mitigate incidents caused by exhausted CPU, memory, connections, threads, queues, storage, I/O, quotas, or downstream capacity.

## When to use
Use when latency rises with load, resources approach limits, queues grow, timeouts cascade, or scaling fails to restore health.

## Inputs
Resource metrics, workload rates, concurrency, queue depth, latency, scaling configuration, quotas, dependency capacity, and baseline utilization.

## Context to inspect
Inspect CPU throttling, memory pressure, garbage collection, connection pools, thread/event-loop saturation, disk/network I/O, autoscaling lag, quotas, and hot partitions.

## Core knowledge
Saturation is about demand relative to constrained capacity. Scaling one layer may move the bottleneck downstream. Queueing effects can sharply increase latency before nominal utilization reaches 100 percent.

## Procedure
1. Identify which resource correlates with degraded throughput or latency.
2. Compare current demand and concurrency with healthy baselines.
3. Check queue depth and wait time at each constrained layer.
4. Determine whether the bottleneck is local or downstream.
5. Reduce optional workload and retry amplification.
6. Scale only where downstream dependencies can absorb added load.
7. Address hot partitions or uneven distribution when present.
8. Apply temporary quota increases only with owner approval and cost awareness.
9. Monitor throughput, latency, errors, and saturation after each action.
10. Capture long-term capacity or efficiency improvements.

## Decision points
Scale out for parallelizable stateless load; optimize or shed work when the bottleneck is serialized or downstream-limited. Scale up when per-instance resource limits dominate and horizontal scaling cannot help quickly.

## Common failure patterns
Scaling the wrong tier, ignoring connection limits, treating queue growth as capacity, retry storms, and declaring success while utilization remains at unstable thresholds.

## Verification
Confirm successful throughput increases, queues drain, latency normalizes, and no downstream resource becomes newly saturated.

## Expected output
A bottleneck assessment with mitigation, measured capacity response, residual risk, and follow-up recommendations.

## Stop conditions
Escalate when capacity changes exceed cost/ quota authority or scaling risks data consistency or dependency collapse.