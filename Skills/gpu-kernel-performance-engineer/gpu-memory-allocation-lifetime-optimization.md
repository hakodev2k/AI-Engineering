# GPU Memory Allocation and Lifetime Optimization

## Purpose
Reduce allocation overhead, fragmentation, unnecessary transfers, and lifetime hazards by designing predictable GPU memory ownership and reuse strategies around kernel execution.

## When to use
Use when workloads allocate frequently, suffer allocator-induced latency spikes, hit OOM despite modest live data, or show excessive synchronization around allocate/free operations.

## Inputs
Allocation traces, buffer sizes and lifetimes, stream/queue usage, allocator/runtime behavior, memory telemetry, workload shape distribution, concurrency model.

## Preconditions
Clarify whether memory is device-local, unified/managed, pinned host, pageable host, pooled, or externally owned. Preserve correctness and ownership semantics before optimizing reuse.

## Context to inspect
Inspect allocation frequency, size classes, fragmentation, peak live bytes, asynchronous frees, stream ownership, staging buffers, temporary tensors, unified-memory migration, alignment, and whether allocations force hidden synchronization.

## Core knowledge
Allocation cost and fragmentation can dominate short GPU workloads. Pools and arenas amortize allocation but require bounded retention and safe reuse. Asynchronous allocation APIs can reduce synchronization only when lifetime ordering is correct. Memory reuse must never cross unfinished work.

## Procedure
1. Capture allocation/frees alongside kernel and transfer timelines.
2. Compute peak live memory and identify high-frequency temporary sizes.
3. Separate true capacity pressure from fragmentation or allocator churn.
4. Reuse buffers whose lifetimes do not overlap.
5. Introduce pools or size-class caching for repeated temporary allocations when bounded memory retention is acceptable.
6. Tie reuse and asynchronous frees to stream/event completion rather than host assumptions.
7. Avoid unnecessary host-device copies by retaining device-resident intermediates where safe.
8. Evaluate unified/managed memory only against measured migration behavior.
9. Stress dynamic shapes and concurrent requests for fragmentation and OOM behavior.
10. Add telemetry for allocation latency, pool usage, peak memory, and failures.

## Decision points
Use pooling when reuse frequency outweighs retained-memory cost. Prefer explicit device memory for latency-sensitive predictable access; use managed memory when portability or oversubscription benefits justify migration variability. Preallocate only when capacity is known and idle reservation is acceptable.

## Common failure patterns
Pooling without bounds; reusing a buffer before prior stream work completes; calling synchronous free in hot paths; treating OOM as only a capacity problem; pinning excessive host memory; hiding memory growth with larger devices.

## Verification
Confirm lower allocation overhead, stable peak memory, no use-after-free races, reduced synchronization, and no regression under variable-size concurrent workloads.

## Expected output
A documented buffer-lifetime model, allocation/reuse strategy, and measured memory/latency improvements.

## Stop conditions
Escalate when allocator behavior is controlled by an opaque framework, capacity requirements exceed available hardware, or safe reuse requires redesigning ownership across subsystem boundaries.