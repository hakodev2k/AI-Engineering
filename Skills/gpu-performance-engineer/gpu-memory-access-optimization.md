# GPU Memory Access Optimization

## Purpose
Reduce GPU memory stalls and unnecessary data movement by improving access efficiency across registers, shared memory, caches, and device memory.

## When to use
Use when profiling shows memory-bound execution, poor global-load/store efficiency, low cache effectiveness, excessive traffic, or memory stalls on the critical path.

## Inputs
- Kernel source or generated code
- Data layouts and tensor/buffer shapes
- Memory-related profiler counters
- Hardware memory hierarchy characteristics

## Context to inspect
Inspect alignment, stride, coalescing, reuse distance, cache locality, shared-memory banking, register spills, read/write amplification, and host-device transfers.

## Core knowledge
The cheapest byte is one never moved. Effective optimization often comes from reducing traffic before maximizing raw bandwidth. Coalesced accesses, locality, tiling, layout selection, and reuse can matter more than occupancy.

## Procedure
1. Quantify bytes moved and memory time.
2. Identify inefficient or redundant transactions.
3. Inspect thread-to-address mapping for coalescing.
4. Evaluate layout changes for dominant access patterns.
5. Eliminate unnecessary intermediates and repeated loads.
6. Use cache or shared-memory reuse only when reuse exceeds staging cost.
7. Check shared-memory bank conflicts.
8. Inspect register spilling and local-memory traffic.
9. Re-measure bandwidth, stalls, and kernel runtime.
10. Validate across representative shapes.

## Decision points
Prefer layout changes when several kernels benefit. Prefer kernel-local tiling when reuse is localized. Use shared memory when predictable reuse justifies synchronization. Avoid caching data with low reuse or severe capacity pressure.

## Common failure patterns
- Assuming contiguous source code implies coalesced transactions
- Creating expensive transposes for small gains
- Increasing shared-memory use until occupancy collapses
- Ignoring write traffic
- Treating cache hit rate alone as a performance objective

## Verification
Confirm reduced transactions or bytes moved, improved relevant stall/bandwidth counters, faster end-to-end runtime, and unchanged output.

## Expected output
A memory-access diagnosis and implemented optimization with before/after traffic, timing, and layout/resource trade-offs.

## Stop conditions
Stop when memory is no longer a material limiter, layout changes break required interfaces, or gains do not survive representative workloads.