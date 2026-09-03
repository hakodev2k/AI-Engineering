# Autoscaling and Warm Capacity

## Purpose
Configure inference capacity scaling so demand changes are absorbed without cold-start storms, unstable queues, or excessive idle accelerator cost.

## When to use
Use when traffic is variable, accelerator provisioning is expensive, or model load/warmup time is material.

## Inputs
Arrival-rate history, startup and model-load time, safe per-replica capacity, queue metrics, SLOs, hardware quotas, and cost targets.

## Context to inspect
Inspect autoscaler signals, polling delay, provisioning latency, warmup behavior, cache population, scale-down grace periods, node availability, and scheduled traffic patterns.

## Core knowledge
Reactive scaling is constrained by the delay between overload and usable capacity. Queue depth is often a better leading signal than accelerator utilization alone. Minimum warm capacity is a reliability control, not merely a cost decision.

## Procedure
1. Measure usable-capacity startup time from zero to warm.
2. Define safe per-replica load from capacity tests.
3. Select leading scaling signals such as queue depth, concurrency, or token backlog.
4. Set minimum warm replicas from SLO and failure requirements.
5. Define scale-out thresholds before saturation.
6. Add cooldown and stabilization to prevent oscillation.
7. Pre-scale for known predictable events where justified.
8. Test rapid bursts and sustained ramps.
9. Verify scale-down does not terminate active requests or needed caches.
10. Monitor scaling lag, rejected requests, and idle cost.

## Decision points
Use predictive or scheduled scaling for predictable peaks. Use queue-based reactive scaling for irregular workloads. Keep higher warm floors when provisioning latency exceeds acceptable queueing time.

## Common failure patterns
Scaling on GPU utilization only, zero warm capacity for large models, aggressive scale-down, not accounting for quota exhaustion, and benchmarking already-warm replicas only.

## Verification
Verified means burst and ramp tests demonstrate stable queues, SLO compliance, bounded scaling lag, and expected idle-to-load cost behavior.

## Expected output
Autoscaling policy, warm-capacity floor, thresholds, cooldowns, and validated burst behavior.

## Stop conditions
Escalate when infrastructure cannot provision within required time, quotas are insufficient, or no reliable scaling signal is observable.