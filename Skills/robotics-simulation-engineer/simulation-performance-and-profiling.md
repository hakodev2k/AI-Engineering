# Simulation Performance and Profiling

## Purpose
Profile and optimize robotics simulation throughput, latency, memory, and GPU/CPU utilization without silently reducing decision-critical fidelity.

## When to use
Use when simulation misses real-time deadlines, large scenario campaigns are too slow, training throughput is constrained, or CI execution becomes costly.

## Inputs
Representative scenarios, profiler traces, CPU/GPU metrics, physics/render settings, target real-time factor or steps/second, memory and cost limits.

## Preconditions
A validated behavioral baseline and performance target must exist.

## Context to inspect
Physics broad/narrow phase, solver iterations, mesh complexity, renderer passes, sensor rates, copying/serialization, middleware traffic, Python/native boundaries, GPU synchronization, asset loading, logging, and reset overhead.

## Core knowledge
Simulation bottlenecks move with workload. Throughput optimization should preserve observables that matter to validation. Faster-than-real-time batch simulation has different priorities from deterministic real-time HIL. Measure wall-clock cost per useful scenario, not only raw physics steps.

## Procedure
1. Reproduce the target workload with stable instrumentation.
2. Measure end-to-end time and break it into physics, rendering, I/O, control, reset, and orchestration.
3. Identify CPU/GPU saturation, idle waits, synchronization, and memory pressure.
4. Rank bottlenecks by contribution and scalability.
5. Remove unnecessary sensors, rendering, logging, and data copies where fidelity permits.
6. Simplify collision/visual assets only with regression checks.
7. Tune stepping and solver parameters within validated bounds.
8. Batch or parallelize independent environments where architecture supports it.
9. Re-profile after each material change.
10. Track throughput and fidelity metrics together.

## Decision points
Optimize single-environment latency for HIL/control; optimize aggregate throughput for training and scenario sweeps. Prefer algorithmic reductions over adding hardware when bottlenecks scale poorly.

## Common failure patterns
Optimizing synthetic microbenchmarks; disabling critical physics; measuring only average utilization; GPU oversubscription; excessive logging; parallelism that introduces nondeterminism or memory exhaustion.

## Verification
Demonstrate target performance on representative workloads and verify behavioral/fidelity regression metrics remain within tolerance.

## Expected output
A bottleneck report, measured optimizations, before/after metrics, retained fidelity evidence, and capacity limits.

## Stop conditions
Stop when further speedup requires violating validated fidelity, unsupported engine modifications, or infrastructure changes outside authorized scope.