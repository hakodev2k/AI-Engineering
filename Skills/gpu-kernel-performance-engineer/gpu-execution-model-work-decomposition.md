# GPU Execution Model and Work Decomposition

## Purpose
Design kernel work decomposition that maps problem structure onto GPU execution units without creating avoidable serialization, underutilization, or synchronization overhead. This skill helps a Senior GPU Kernel Performance Engineer reason from algorithm shape to grid, block/workgroup, warp/wavefront, and thread/lane behavior.

## When to use
Use when designing a new kernel, porting CPU code to a GPU, diagnosing low SM/CU utilization, or reviewing a kernel whose launch geometry appears arbitrary. Do not use launch-shape tuning as a substitute for fixing an unsuitable algorithm.

## Inputs
Kernel source, problem dimensions, target GPU architecture, profiler traces, launch parameters, data layout, correctness constraints, expected workload ranges.

## Preconditions
A reproducible correctness case must exist. Know the target programming model such as CUDA, HIP, SYCL, OpenCL, Triton, or a compiler-generated equivalent.

## Context to inspect
Inspect iteration independence, reduction dependencies, tile shapes, boundary conditions, warp/wavefront width, scheduler behavior, maximum threads per block/workgroup, shared-memory use, registers per thread, and expected problem-size distribution.

## Core knowledge
GPUs achieve throughput by running many lightweight threads and hiding latency with ready warps/wavefronts. Logical parallelism, launch dimensions, occupancy, memory behavior, and synchronization interact. More threads do not automatically mean better performance; the mapping must preserve locality and enough independent work.

## Procedure
1. Express the computation as independent and dependent dimensions.
2. Identify the smallest safe unit of parallel work.
3. Map contiguous data dimensions to adjacent lanes when possible.
4. Choose an initial block/workgroup shape compatible with hardware limits and algorithm tiling.
5. Estimate resource use per block: registers, shared memory, threads, and barriers.
6. Check whether enough blocks exist to populate all compute units for representative problem sizes.
7. Handle tails and boundary conditions without making the common path expensive.
8. Profile achieved occupancy, active warps, issue utilization, and stall reasons.
9. Compare multiple launch shapes while holding algorithm and inputs constant.
10. Retain the simplest geometry that performs robustly across the supported workload range.

## Decision points
Prefer one-dimensional launches for naturally linear data when multidimensional indexing adds no locality benefit. Use multidimensional tiles when they improve data reuse or simplify neighborhood access. Increase block size only while resource pressure and synchronization remain acceptable.

## Common failure patterns
Using a fashionable block size without measurement; creating too few blocks for small workloads; mapping strided dimensions across neighboring lanes; excessive per-block synchronization; assuming maximum occupancy is the objective; over-specializing for one input size.

## Verification
Validate bitwise or tolerance-based correctness, compare profiler utilization and stall metrics, benchmark multiple representative sizes, and confirm launch geometry remains within resource limits on every supported device.

## Expected output
A justified work decomposition, launch geometry, benchmark evidence, and documented assumptions about workload and hardware.

## Stop conditions
Escalate when the algorithm has insufficient parallelism, requires global synchronization unsupported by the execution model, or architecture-specific optimization would violate portability requirements.