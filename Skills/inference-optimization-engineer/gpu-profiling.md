# GPU Profiling

## Purpose
Identify accelerator bottlenecks using evidence from kernels, memory traffic, occupancy, synchronization, and host-device interaction.

## When to use
Use when GPU utilization appears low, latency regresses after a runtime change, or a serving path is suspected to be compute- or memory-bound.

## Inputs
Profiler traces, model graph, runtime configuration, kernel timings, GPU metrics, workload samples, and hardware specifications.

## Context to inspect
Inspect host preprocessing, H2D/D2H copies, kernel launch gaps, synchronization, stream usage, memory bandwidth, tensor shapes, precision, and runtime fusion decisions.

## Core knowledge
High utilization does not imply efficient useful work. Kernel launch overhead, memory-bound operations, poor occupancy, synchronization, and shape fragmentation can dominate inference.

## Procedure
1. Reproduce the issue with a stable workload.
2. Capture end-to-end and GPU traces.
3. Separate host, transfer, and device time.
4. Rank kernels by aggregate and critical-path time.
5. Classify major kernels as compute-, memory-, or launch-bound.
6. Inspect occupancy, bandwidth, and synchronization.
7. Compare shapes and batch sizes against optimized kernel paths.
8. Form one optimization hypothesis at a time.
9. Measure before and after using identical workloads.
10. Check tail latency and correctness, not kernel time alone.

## Decision points
Prefer batching or fusion when launch overhead dominates. Prefer reduced memory movement or lower precision when bandwidth dominates. Consider custom kernels only after runtime-level options are exhausted and maintenance cost is justified.

## Common failure patterns
Profiling cold initialization, interpreting utilization alone, optimizing non-critical kernels, mixing profiler overhead into final benchmarks, and ignoring CPU bottlenecks.

## Verification
Verified improvement requires repeatable end-to-end gains with unchanged outputs within accepted numerical tolerances and no p99 regression.

## Expected output
Profiler evidence, bottleneck classification, optimization hypothesis, and measured before/after results.

## Stop conditions
Escalate when profiler access is blocked, traces are non-reproducible, or a proposed kernel change risks unsupported numerical behavior.