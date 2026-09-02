# Performance and Capacity Observability

## Purpose
Detect and explain resource or scaling conditions that can change ML inference latency, throughput, or quality.

## Scope
Applies to compute, accelerator, memory, network, queue, batching, storage, and autoscaling behavior supporting ML workloads.

## MUST
- Capacity monitoring MUST include saturation and queueing signals for resources that constrain inference or evaluation throughput.
- Performance conclusions MUST use percentile distributions and workload context, not averages alone.
- Material performance changes MUST be correlated with model, runtime, hardware, traffic, and configuration versions where relevant.
- Capacity thresholds MUST account for expected bursts and recovery behavior.

## MUST NOT
- MUST NOT claim an optimization succeeded without before-and-after measurements under comparable workloads.
- MUST NOT increase concurrency or batching without observing effects on tail latency, failures, and model semantics where applicable.
- MUST NOT run production resources persistently near exhaustion without documented risk acceptance.

## SHOULD
- Maintain representative load tests and capacity forecasts for critical serving paths.
- Monitor accelerator memory and utilization when specialized hardware is used.

## Exceptions
Reduced headroom requires quantified evidence, rollback capability, and accountable approval.

## Verification
Review load tests, dashboards, percentile metrics, scaling events, saturation history, forecasts, and benchmark comparisons.