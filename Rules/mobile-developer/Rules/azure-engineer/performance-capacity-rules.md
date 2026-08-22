# Performance and Capacity Rules

## Purpose
Manage Azure capacity and performance using measurements rather than assumptions.

## Scope
Latency, throughput, CPU, memory, IOPS, bandwidth, quotas, autoscaling, load testing, and service limits.

## MUST
- Define performance objectives for critical workload paths.
- Measure baseline behavior before claiming an optimization or capacity improvement.
- Identify service quotas, throttling boundaries, and saturation indicators before scale events.
- Load test material architecture changes under representative conditions when feasible.
- Include downstream dependencies when diagnosing performance bottlenecks.

## MUST NOT
- Claim performance improvement without comparable before/after evidence.
- Scale resources blindly without identifying the constrained resource or expected effect.
- Ignore percentile latency and rely only on averages for user-facing critical paths.

## SHOULD
- Maintain capacity headroom appropriate to growth and recovery scenarios.
- Automate scaling only when signals and limits are well understood.

## Exceptions
Evidence limitations must be documented with risk and follow-up validation.

## Verification
Inspect benchmarks, load tests, Azure Monitor metrics, quotas, scaling rules, traces, and cost/performance comparisons.