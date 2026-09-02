# Deterministic Memory Management

## Purpose
Control allocation, fragmentation, paging, and cache effects so memory behavior cannot create unacceptable timing spikes or failures.

## When to use
Use for hard/firm real-time paths, long-lived embedded systems, allocation-related jitter, or memory-constrained targets.

## Inputs
Memory map, allocation patterns, object lifetimes, allocator configuration, stack sizes, cache/TLB behavior, timing requirements.

## Context to inspect
Heap use, dynamic containers, language runtime, garbage collection, page faults, virtual memory, DMA buffers, stack usage, and memory pools.

## Core knowledge
General-purpose allocation and garbage collection optimize flexibility or average throughput, not necessarily bounded latency. Static allocation, arenas, object pools, bounded allocators, and pre-faulted memory improve predictability at the cost of flexibility.

## Procedure
1. Map allocations on all deadline-critical paths.
2. Identify operations with unbounded or data-dependent allocation cost.
3. Preallocate persistent and burst-capacity objects where justified.
4. Use pools/arenas for bounded-lifetime objects.
5. Prevent paging or pre-fault critical memory when platform permits.
6. Size stacks from measurement plus justified margin.
7. Align DMA/shared buffers to hardware requirements.
8. Measure fragmentation and allocation latency over long-duration tests.
9. Document memory exhaustion behavior.

## Decision points
Static allocation provides strongest predictability; bounded pools balance flexibility and timing; general heap allocation is acceptable only outside critical paths or with demonstrated bounds.

## Common failure patterns
Allocation inside ISRs, hidden allocations in libraries, memory growth during overload, stack overflow, runtime GC pauses, and assuming startup fragmentation represents steady state.

## Verification
Run long-duration stress tests, stack/heap instrumentation, allocation-latency tracing, and exhaustion tests on target hardware.

## Expected output
A memory policy with allocation zones, capacity bounds, failure semantics, and timing evidence.

## Stop conditions
Stop when runtime or OS memory behavior cannot be bounded enough for the required deadline class.