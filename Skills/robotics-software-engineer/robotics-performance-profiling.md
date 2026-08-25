# Robotics Performance Profiling

## Purpose
Diagnose CPU, GPU, memory, network, middleware, and latency bottlenecks in robotics workloads using evidence instead of guesswork.

## When to use
Use when control loops miss deadlines, perception falls behind, queues grow, CPU/GPU saturates, or field performance differs from development systems.

## Inputs
- Performance symptoms
- Runtime metrics and traces
- Representative workloads
- Hardware specifications
- Timing budgets
- Build configuration

## Preconditions
Reproduce the issue under a measurable workload before optimizing.

## Context to inspect
Inspect process/thread CPU, callback duration, queue depth, message sizes/rates, memory allocation, copy paths, GPU utilization, I/O, frequency throttling, and thermal state.

## Core knowledge
Understand profiling versus tracing, wall time versus CPU time, tail latency, queueing, contention, allocator pressure, cache behavior, zero-copy trade-offs, GPU synchronization, and thermal throttling.

## Procedure
1. State the performance requirement and failing metric.
2. Capture a baseline with representative data.
3. Separate compute, waiting, I/O, and scheduling delay.
4. Profile the hottest processes and callbacks.
5. Inspect message rates, payloads, queue growth, and unnecessary serialization/copying.
6. Measure memory growth and allocation hot spots.
7. Inspect GPU kernels, transfers, and synchronization where applicable.
8. Check thermal and power throttling on target hardware.
9. Change one bottleneck at a time.
10. Re-measure end-to-end behavior and regressions.
11. Stress beyond nominal load to establish headroom.

## Decision points
Optimize the true critical path rather than the largest function in isolation. Prefer algorithmic or architectural reductions before low-level tuning. Zero-copy and composition improve throughput but may weaken isolation.

## Common failure patterns
- Benchmarking debug builds
- Optimizing average latency while tail deadlines fail
- Ignoring queue buildup
- Moving work to GPU without accounting for transfer cost
- Measuring on nonrepresentative desktop hardware

## Verification
Compare before/after percentile latency, deadline misses, CPU/GPU use, memory, queue depth, thermals, and mission-level throughput on target hardware.

## Expected output
A performance diagnosis with measured bottleneck, implemented change, evidence of improvement, and remaining headroom.

## Stop conditions
Stop when required tooling would perturb safety-critical operation, target hardware lacks sufficient capacity after justified optimization, or further changes would trade away correctness or isolation without approval.