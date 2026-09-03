# GPU Kernel Design

## Purpose
Design custom GPU kernels for LLM workloads when generic libraries or unfused execution cannot meet performance, memory, or fusion requirements.

## When to use
Use for attention variants, normalization, fused epilogues, quantized operators, bespoke reductions, or performance-critical graph regions with clear profiler evidence.

## Inputs
- Operation semantics
- Shapes and dtypes
- Target GPU characteristics
- Baseline profile
- Layout and numerical constraints

## Preconditions
Have a correct reference implementation and evidence that the target region is worth optimizing.

## Context to inspect
Inspect occupancy, memory bandwidth, arithmetic intensity, warp behavior, shared memory, register pressure, tensor-core eligibility, launch overhead, and shape distribution.

## Core knowledge
GPU performance depends on parallel decomposition, coalesced access, latency hiding, occupancy, synchronization, and efficient use of specialized units. The fastest design varies by shape and hardware. A kernel can be compute-bound, bandwidth-bound, latency-bound, or launch-bound.

## Procedure
1. Characterize the operation and baseline bottleneck.
2. Choose thread/block decomposition.
3. Define tile sizes and memory-access pattern.
4. Minimize global-memory round trips.
5. Use shared memory only when reuse justifies synchronization and capacity.
6. Bound register pressure and live ranges.
7. Exploit vectorized or tensor-core paths where legal.
8. Handle tails and irregular shapes safely.
9. Benchmark multiple shapes and launch configurations.
10. Inspect profiler counters and generated machine-level behavior where available.
11. Add hardware capability guards and fallback implementations.

## Decision points
Prefer library kernels when they already dominate performance. Use custom kernels when fusion or specialized layouts materially improve end-to-end execution. Optimize for workload distributions, not one synthetic shape.

## Common failure patterns
- Chasing occupancy without considering bandwidth or instruction throughput.
- Register spills from over-fusion.
- Uncoalesced memory access.
- Expensive synchronization.
- No tail handling for dynamic shapes.

## Verification
Implemented means the kernel launches and returns expected output. Verified means numerical tests pass, memory-checking tools show no invalid access, and representative end-to-end benchmarks improve without regressions on supported shapes.

## Expected output
A production-ready kernel with documented shape limits, launch policy, fallback path, correctness tests, and profiler evidence.

## Stop conditions
Stop when profiler evidence does not justify a custom kernel, numerical semantics are unclear, or the design requires unsupported hardware behavior.