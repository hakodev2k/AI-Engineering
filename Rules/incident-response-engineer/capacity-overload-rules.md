# Capacity and Overload Rules

## Purpose
Stabilize systems under demand spikes, resource exhaustion, or cascading load.

## Scope
CPU, memory, threads, connections, queues, storage, rate limits, quotas, and downstream capacity.

## MUST
- Identify the constrained resource and measure saturation, demand, queueing, and error behavior before claiming a capacity cause.
- Protect critical workloads with bounded concurrency, prioritization, admission control, or load shedding where supported.
- Validate that scaling actions address the actual bottleneck and do not shift failure to a dependency.
- Monitor recovery for backlog drain and secondary saturation.

## MUST NOT
- Treat adding capacity as proof of root cause.
- Remove safety limits globally without explicit risk assessment and approval where required.

## SHOULD
- Prefer controlled degradation over total collapse and define which workloads may be sacrificed first.

## Exceptions
Pre-approved autoscaling or emergency capacity procedures may execute rapidly but still require post-action validation.

## Verification
Use resource telemetry, queue depth, latency, throughput, error rates, scaling events, and dependency metrics before and after mitigation.