# Memory Coalescing and Access Patterns

## Purpose
Design global-memory access patterns that maximize useful bandwidth and minimize unnecessary memory transactions.

## When to use
Use when kernels are bandwidth-bound, show low memory efficiency, or operate on strided, transposed, sparse, or irregular data.

## Inputs
Kernel code, tensor/array shapes, strides, data types, profiler memory metrics, and target GPU architecture.

## Context to inspect
Thread-to-data mapping, alignment, vector width, transaction granularity, cache-line behavior, strides, gather/scatter patterns, and reuse distance.

## Core knowledge
Adjacent threads should usually access adjacent and aligned memory so hardware can combine requests efficiently. Coalescing rules vary by architecture, but wasted sectors, excessive transactions, and poor spatial locality remain common causes of throughput loss.

## Procedure
1. Map each thread lane to exact byte addresses for important loads and stores.
2. Identify contiguous, strided, scattered, and redundant accesses.
3. Check alignment and transaction utilization.
4. Reorder thread mapping or data layout where this improves contiguous access.
5. Consider vectorized loads/stores only when alignment and semantics permit.
6. Use shared memory or tiling when rearranging access can amortize global traffic.
7. Evaluate structure-of-arrays versus array-of-structures layouts when field access is selective.
8. Measure actual global-load/store efficiency and bandwidth.
9. Validate all changes across boundary and odd-size cases.

## Decision points
Prefer layout changes when they benefit multiple kernels; prefer local kernel transformations when external layout contracts are expensive to change. Avoid extra staging when it costs more than the saved memory traffic.

## Common failure patterns
Optimizing arithmetic while memory transactions dominate; ignoring alignment; assuming contiguous source syntax means contiguous lane addresses; introducing costly transposes; and improving one kernel while degrading the overall pipeline.

## Verification
Confirm reduced memory transactions, improved effective bandwidth, unchanged results, and end-to-end benefit rather than isolated microbenchmark gains.

## Expected output
A documented access strategy with before/after profiler evidence.

## Stop conditions
Stop when required layout changes break external ABI/data contracts or when no representative workload exists to validate the trade-off.