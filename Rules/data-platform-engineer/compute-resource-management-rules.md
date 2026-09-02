# Compute Resource Management Rules

## Purpose
Keep shared data compute predictable under contention while preventing runaway workloads and avoidable platform instability.

## Scope
Applies to clusters, worker pools, warehouses, executors, queues, autoscaling, quotas, concurrency, and workload placement.

## MUST
- Workload classes MUST define resource limits, concurrency behavior, priority, and isolation expectations appropriate to their criticality.
- Resource requests and autoscaling policies MUST be based on measured workload demand and platform saturation evidence.
- Shared compute MUST enforce safeguards against unbounded CPU, memory, storage, or concurrency consumption.
- Critical workloads MUST define behavior when capacity is unavailable, including queueing, degradation, or escalation.
- Capacity changes with material cost or production impact MUST be reviewable and observable after rollout.

## MUST NOT
- MUST NOT solve persistent inefficiency solely by increasing capacity without investigating the bottleneck.
- MUST NOT allow a single tenant or job class to starve higher-priority workloads without an explicit policy.
- MUST NOT configure autoscaling without upper bounds or quota awareness when uncontrolled expansion can create financial or operational risk.

## SHOULD
- Prefer workload-aware scheduling and measured headroom over static overprovisioning.
- SHOULD expose utilization, queue time, throttling, eviction, and saturation metrics.

## Exceptions
Exceptions require evidence, expected duration, cost and reliability impact, safeguards, and accountable approval.

## Verification
Inspect quotas, scheduler policy, autoscaling limits, utilization history, saturation metrics, load tests, and post-change evidence.