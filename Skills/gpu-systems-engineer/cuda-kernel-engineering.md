# CUDA Kernel Engineering

## Purpose
Design and improve CUDA kernels with explicit control over execution geometry, memory traffic, synchronization, and resource consumption.

## When to use
Use when implementing or reviewing custom CUDA kernels or replacing a demonstrably inadequate library path.

## Inputs
Kernel source, data shapes, GPU compute capability, compiler output, correctness reference, profiler evidence, target metrics.

## Preconditions
Confirm that a custom kernel is justified and establish a trusted CPU or framework reference for correctness.

## Context to inspect
Inspect grid/block dimensions, indexing, memory layout, streams, shared memory, atomics, barriers, register counts, PTX/SASS when necessary, and surrounding host launches.

## Core knowledge
Coalesced global access, shared-memory locality, warp behavior, launch overhead, register pressure, synchronization scope, asynchronous copies, and occupancy interact. Vendor libraries should normally be preferred for standard primitives because they encode architecture-specific tuning.

## Procedure
1. Specify kernel semantics and tolerated numerical error.
2. Establish baseline correctness and timing.
3. Choose a mapping from problem elements to grids, blocks, warps, and threads.
4. Make bounds behavior explicit.
5. Design memory accesses for coalescing and locality.
6. Introduce shared memory only when reuse offsets synchronization and capacity cost.
7. Minimize synchronization scope and avoid unnecessary atomics.
8. Compile with warnings and inspect resource usage.
9. Profile stalls, bandwidth, occupancy limiters, and achieved throughput.
10. Tune one dimension at a time across representative shapes.
11. Compare against established libraries.
12. Add regression tests and benchmarks.

## Decision points
Use atomics when contention is acceptably low and semantics require them; otherwise consider hierarchical reduction. Use shared memory for real reuse, not automatically. Specialize shapes only when frequency and gain justify code complexity.

## Common failure patterns
Incorrect indexing at tail blocks, race conditions, bank conflicts, register spills, excessive barriers, launch configurations that work on one architecture only, silent integer overflow, and benchmarks that exclude required transfers.

## Verification
Run deterministic correctness cases, randomized cases, sanitizer/race tooling where applicable, profiler analysis, end-to-end benchmarks, and tests on supported compute capabilities.

## Expected output
A correct kernel, documented launch/resource assumptions, benchmark evidence, and tests protecting edge cases.

## Stop conditions
Stop when a vendor primitive already meets requirements, numerical semantics are undefined, required hardware is unavailable, or optimization requires unsupported architecture assumptions.