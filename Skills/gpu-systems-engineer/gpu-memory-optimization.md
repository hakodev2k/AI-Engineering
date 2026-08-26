# GPU Memory Optimization

## Purpose
Reduce GPU memory traffic, footprint, allocation overhead, and data-movement stalls without compromising correctness.

## When to use
Use for OOM failures, bandwidth-bound kernels, allocation churn, poor cache behavior, excessive host-device transfers, or capacity planning.

## Inputs
Memory traces, allocation timeline, tensor/buffer lifetimes, layouts, transfer paths, kernel profiles, GPU topology.

## Preconditions
Capture representative peak-memory and bandwidth measurements before changing ownership or layout.

## Context to inspect
Inspect allocations, pooling, fragmentation, lifetime overlap, alignment, stride/layout, page locking, unified memory, cache hit rates, HBM traffic, copies, peer access, and NUMA affinity.

## Core knowledge
Peak footprint and bandwidth are distinct constraints. Coalescing, locality, reuse, alignment, transfer overlap, pinned memory, memory pools, recomputation, precision, and layout transformations can trade capacity, bandwidth, compute, latency, and complexity.

## Procedure
1. Measure peak allocated, reserved, and actually used memory.
2. Attribute large buffers and lifetime overlaps.
3. Measure bandwidth and transfer time separately from compute.
4. Identify unnecessary copies, materializations, padding, and long-lived intermediates.
5. Fix access locality and layout before adding complex caching.
6. Reuse allocations through appropriate pools where lifetime semantics permit.
7. Overlap transfers with compute only after dependency correctness is explicit.
8. Consider reduced precision, chunking, recomputation, or offload using measured trade-offs.
9. Test fragmentation and steady-state behavior.
10. Re-profile end to end.

## Decision points
Choose recomputation when compute is cheaper than retained memory. Use pinned host memory for transfer-critical buffers while controlling host pressure. Use unified memory when programmability benefits outweigh migration unpredictability.

## Common failure patterns
Counting reserved memory as unavoidable use, hidden copies from layout conversion, allocator synchronization, over-pinning host memory, page migration storms, misaligned/coalescing failures, and optimizations that reduce footprint but increase latency excessively.

## Verification
Verify peak memory, bandwidth, transfer time, allocation count, correctness, fragmentation under long runs, and performance across representative sizes.

## Expected output
A memory map, quantified bottleneck, safe optimization, and before/after capacity and performance evidence.

## Stop conditions
Stop when ownership is ambiguous, memory telemetry is unavailable, proposed changes alter required numerical semantics, or host/system pressure would create a larger reliability risk.