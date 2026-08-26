# Capacity and Performance

## Purpose
Keep ML infrastructure within evidenced latency, throughput, and resource targets.

## Scope
CPU, memory, storage, network, accelerators, schedulers, training, and inference.

## MUST
- Capacity plans MUST use measured workload demand and defined headroom assumptions.
- Performance changes MUST include before/after evidence under representative conditions.
- Accelerator utilization and bottlenecks MUST be measured before expensive scaling decisions.
- Load tests MUST cover expected concurrency and material peak scenarios.

## MUST NOT
- Performance improvement MUST NOT be claimed from intuition alone.
- Autoscaling MUST NOT be configured without accounting for provisioning and model-load latency.

## SHOULD
- Capacity SHOULD distinguish steady-state, burst, failure, and recovery demand.

## Exceptions
Proxy benchmarks require documented representativeness limits and production validation plans.

## Verification
Review benchmarks, profiles, queue metrics, utilization, load tests, scaling events, and capacity forecasts.