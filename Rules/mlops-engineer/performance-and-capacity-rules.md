# Performance and Capacity Rules

## Purpose
Keep ML workloads within explicit latency, throughput, resource, and scalability constraints using measurement rather than assumption.

## Scope
Covers training, batch inference, online serving, accelerators, memory, CPU, storage, and network use.

## MUST
- Performance requirements MUST define representative workload, concurrency, dataset/request shape, and percentile or completion targets.
- Performance changes MUST be supported by before/after measurements under comparable conditions.
- Production serving MUST have resource requests/limits or equivalent capacity controls appropriate to the platform.
- Capacity planning MUST account for model size, concurrency, warm-up, autoscaling delay, and dependency bottlenecks.
- Load tests MUST include saturation and failure behavior for critical online systems.

## MUST NOT
- Average latency alone MUST NOT justify a latency-sensitive release when tail latency matters.
- Accelerator utilization MUST NOT be optimized at the expense of required reliability or response targets without an explicit trade-off.

## SHOULD
- Representative benchmarks SHOULD be automated and versioned.
- Capacity models SHOULD include growth and failover headroom.

## Exceptions
A performance target waiver requires measured evidence, impact analysis, monitoring, expiry, and accountable approval.

## Verification
Review benchmark definitions/results, load tests, profiler evidence, autoscaling configuration, resource metrics, saturation behavior, and capacity forecasts.