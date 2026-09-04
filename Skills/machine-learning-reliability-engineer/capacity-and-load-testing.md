# Capacity and Load Testing

## Purpose
Prove that ML serving systems meet throughput, tail-latency, resource, and recovery objectives under realistic and adverse demand.

## When to use
Use before launches, major model/runtime changes, scaling events, or when saturation and latency incidents occur.

## Inputs
- Expected traffic profile
- Model artifact and serving runtime
- Hardware and autoscaling configuration
- Latency/throughput SLOs
- Request-size and feature distributions

## Context to inspect
Inspect model warm-up, batching, concurrency, accelerator utilization, CPU/memory, queueing, network dependencies, autoscaling delays, and request heterogeneity.

## Core knowledge
Average latency hides saturation. Senior reliability testing focuses on p95/p99 latency, queue depth, throughput, memory growth, cold starts, load shedding, and recovery after overload. Test traffic must resemble production payloads and burst patterns.

## Procedure
1. Define normal, peak, burst, and overload traffic scenarios.
2. Build representative request sets including large and expensive cases.
3. Establish a stable baseline on production-like hardware.
4. Increase concurrency gradually while measuring throughput and tail latency.
5. Observe CPU, memory, accelerator utilization, queues, batching efficiency, and dependency latency.
6. Identify the saturation point and safe operating margin.
7. Test autoscaling, cold starts, and scale-down behavior.
8. Exercise load shedding, rate limiting, and backpressure.
9. Run soak tests to detect leaks or degradation over time.
10. Repeat after major model, runtime, or hardware changes.

## Decision points
Scale out when work parallelizes and startup cost is acceptable; scale up when model memory or accelerator constraints dominate. Prefer controlled load shedding over uncontrolled queue growth when latency-sensitive requests cannot be served within SLO.

## Common failure patterns
- Testing only average request size.
- Ignoring warm-up and cold-start costs.
- Autoscaling reacts after queues already violate SLOs.
- GPU memory fragmentation appears only in soak tests.
- Synthetic traffic skips real dependency calls.

## Verification
Verify target throughput at required tail latency with headroom, bounded resource use, correct overload behavior, and recovery after peak demand.

## Expected output
A capacity envelope, saturation analysis, scaling recommendations, overload controls, and repeatable load-test suite.

## Stop conditions
Stop if the test environment is too unlike production to support conclusions or if load testing could affect real users without approved isolation.