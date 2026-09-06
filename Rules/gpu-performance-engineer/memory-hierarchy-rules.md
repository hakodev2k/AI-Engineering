# Memory Hierarchy Rules

## Purpose
Use GPU memory resources deliberately to reduce stalls, excess traffic, and capacity failures.

## Scope
Registers, shared memory, caches, global memory, pinned host memory, unified memory, and temporary buffers.

## MUST
- Memory optimization MUST be guided by measured bandwidth, cache behavior, allocation pressure, or stall evidence.
- Access patterns MUST be evaluated for coalescing, locality, alignment, and reuse where relevant.
- Shared memory and register use MUST be balanced against occupancy and supported problem sizes.
- Temporary allocations in hot paths MUST be bounded and measured.
- Peak device memory MUST be measured under production-representative concurrency and shapes.

## MUST NOT
- MUST NOT assume a lower allocation count implies lower latency without measurement.
- MUST NOT rely on allocator behavior that is undocumented or unstable across supported runtimes.
- MUST NOT introduce silent host fallback or paging as a capacity strategy for latency-critical workloads.

## SHOULD
- SHOULD reuse buffers when lifecycle and concurrency semantics are safe.
- SHOULD prefer memory layouts that match dominant kernels and access patterns.

## Exceptions
Exceptions require workload evidence, memory-risk analysis, and documented fallback behavior.

## Verification
Review profiler counters, allocation traces, peak-memory tests, cache metrics, and representative load tests.