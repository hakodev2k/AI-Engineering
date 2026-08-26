# GPU Architecture and Execution

## Purpose
Reason correctly about GPU execution, memory hierarchy, occupancy, and bottlenecks before changing kernels or system configuration.

## When to use
Use for kernel design, GPU performance reviews, unexplained utilization, portability work, or architecture selection. Do not optimize from utilization percentages alone.

## Inputs
Workload, GPU model, kernel code, profiler traces, compiler flags, tensor/data shapes, latency or throughput targets.

## Preconditions
Obtain a reproducible workload and identify the exact accelerator architecture and software stack.

## Context to inspect
Inspect launch dimensions, instruction mix, memory transfers, synchronization, occupancy, register/shared-memory use, clocks, power limits, and concurrent workloads.

## Core knowledge
GPUs trade sophisticated single-thread latency for massive throughput. Warps/wavefronts execute groups of lanes; divergence wastes issue capacity. Occupancy is a means of hiding latency, not a goal. Registers, shared memory/LDS, caches, HBM/GDDR, interconnects, and host memory have different capacities and costs. Roofline reasoning separates compute-bound from bandwidth-bound regimes.

## Procedure
1. Define the performance objective and representative input.
2. Map the workload into host work, transfers, kernels, synchronization, and collectives.
3. Identify architecture limits: compute throughput, memory bandwidth, cache/shared memory, register file, launch capacity, and interconnect.
4. Profile before modifying code.
5. Classify the dominant constraint using counters and timing evidence.
6. Inspect launch geometry, divergence, occupancy limiters, memory access patterns, and synchronization.
7. Form one measurable hypothesis.
8. Change the smallest relevant factor.
9. Re-profile under identical conditions.
10. Retain only improvements that preserve correctness and representative behavior.

## Decision points
Increase occupancy only when latency hiding is limiting; extra occupancy can increase spills or reduce useful shared memory. Prefer locality and coalescing before exotic instruction-level tuning. Choose architecture-specific optimization only when its value exceeds portability cost.

## Common failure patterns
Optimizing synthetic microcases, treating 100% utilization as proof of efficiency, ignoring thermal throttling, register spilling, divergent branches, uncoalesced accesses, hidden synchronization, or host-side starvation.

## Verification
Verify numerical correctness, kernel and end-to-end timings, profiler counters, repeatability, resource use, and behavior across required GPU models and input sizes.

## Expected output
An evidence-backed bottleneck classification, change set, benchmark comparison, and documented portability implications.

## Stop conditions
Stop when the workload is not reproducible, required profiling access is unavailable, correctness changes, hardware is thermally unstable, or evidence contradicts the optimization hypothesis.