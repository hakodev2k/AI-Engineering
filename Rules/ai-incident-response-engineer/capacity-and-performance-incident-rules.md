# Capacity and Performance Incident Rules

## Purpose
Diagnose AI latency, throughput, saturation, and resource incidents using measurement rather than assumption.

## Scope
Applies to model inference, queues, token processing, retrieval, tools, network, compute accelerators, memory, and provider quotas.

## MUST
- Performance incidents MUST use time-aligned measurements for latency distributions, throughput, errors, saturation, queueing, and relevant resource utilization.
- Investigators MUST distinguish model compute time from queue, retrieval, tool, network, and application latency where telemetry permits.
- Capacity conclusions MUST consider workload shape, token/context size, concurrency, batching, quotas, and traffic mix when relevant.
- Performance remediation claims MUST include before/after evidence under comparable conditions.
- Load shedding, rate limiting, or degradation controls MUST protect critical service paths and define user impact.
- Scaling changes during incidents MUST be monitored for cost and downstream saturation effects.

## MUST NOT
- Average latency alone MUST NOT be used to dismiss tail-latency incidents.
- Responders MUST NOT increase capacity indefinitely without investigating causal bottlenecks and cost.
- Performance fixes MUST NOT weaken safety or security checks without explicit approval.

## SHOULD
- Use representative load tests and profiling after stabilization.
- Track per-model or per-route service-level indicators where useful.

## Exceptions
Provider-managed internals may limit visibility; use available request telemetry and provider evidence while documenting uncertainty.

## Verification
Review dashboards, traces, profiles, quota data, benchmarks, cost signals, and before/after measurements.