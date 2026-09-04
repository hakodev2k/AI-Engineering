# GPU Workload Characterization

## Purpose
Establish a quantitative performance model for a GPU workload before optimization. This prevents local tuning from obscuring the real bottleneck and gives a Senior GPU Performance Engineer an evidence-based basis for prioritization.

## When to use
Use before tuning kernels, model inference, training loops, rendering, simulation, or data-processing pipelines; when throughput or latency regresses; or when moving to new GPU hardware. Do not begin optimization from profiler screenshots alone without a workload baseline.

## Inputs
- Representative workload and input distributions
- Hardware model and driver/runtime versions
- Latency, throughput, utilization, memory, power, and cost targets
- Existing benchmarks and profiler traces
- Deployment topology and concurrency level

## Preconditions
Use reproducible inputs, stable clocks where possible, and a warm-up phase. Record software and hardware versions.

## Context to inspect
Inspect CPU orchestration, host-device transfers, kernel mix, tensor or buffer sizes, batching, synchronization, memory capacity, launch frequency, and multi-GPU communication.

## Core knowledge
GPU performance is constrained by compute throughput, memory bandwidth, latency, occupancy, launch overhead, synchronization, and communication. Arithmetic intensity and scaling behavior often reveal whether optimization should target math, memory, scheduling, or system integration.

## Procedure
1. Define user-visible success metrics and percentile requirements.
2. Build a representative benchmark with fixed seeds or captured inputs.
3. Measure end-to-end wall time before profiling internals.
4. Break time into CPU, transfer, kernel, synchronization, and communication phases.
5. Record achieved throughput, memory bandwidth, occupancy, and device utilization.
6. Group kernels by cumulative time rather than optimizing by call count.
7. Compare workload intensity with hardware peak limits.
8. Test sensitivity to batch size, sequence/image size, concurrency, and precision.
9. Identify the dominant limiting resource and secondary constraints.
10. Establish a baseline report and preserve raw profiler evidence.

## Decision points
Choose kernel optimization when a small set of GPU kernels dominates runtime. Choose pipeline or batching work when launch gaps or CPU stalls dominate. Choose communication optimization when scaling degrades across devices. Choose algorithmic changes when the operation count itself is the problem.

## Common failure patterns
- Profiling non-representative toy inputs
- Ignoring warm-up and compilation effects
- Comparing runs with different clocks or power states
- Treating high utilization as proof of efficiency
- Optimizing a kernel that is not material to end-to-end latency

## Verification
Repeat the benchmark multiple times, report distribution rather than one sample, confirm the profiler decomposition matches wall-clock measurements, and verify that the identified bottleneck remains dominant under production-like concurrency.

## Expected output
A workload characterization report containing baseline metrics, bottleneck classification, sensitivity analysis, profiler evidence, and prioritized optimization targets.

## Stop conditions
Stop and escalate if representative inputs cannot be obtained, hardware state cannot be stabilized enough for comparison, or measurements conflict materially across tools.