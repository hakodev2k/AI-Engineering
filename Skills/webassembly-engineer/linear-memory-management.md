# Linear Memory Management

## Purpose
Design and troubleshoot safe, efficient data placement and ownership in WebAssembly linear memory.

## When to use
Use for allocators, host/guest buffers, memory growth, corruption, excessive copying, or out-of-bounds traps.

## Inputs
Module memory declarations, allocator strategy, ABI ownership rules, workload sizes, runtime limits, profiles, and failure traces.

## Context to inspect
Inspect initial/maximum pages, shared vs unshared memory, growth calls, allocator exports, stack/heap layout, host memory views, and buffer lifetime.

## Core knowledge
Linear memory is byte-addressable and bounds checked. Growth can invalidate host-side views depending on embedding API. Allocation ownership must be explicit across the boundary. Memory64, multiple memories, and shared memory require runtime/toolchain support checks.

## Procedure
1. Map stack, heap, static data, and exchanged buffers.
2. Establish who allocates, owns, and frees each cross-boundary buffer.
3. Reproduce corruption with deterministic inputs.
4. Check bounds, integer overflow, alignment, and length calculations.
5. Observe growth and refresh host views as required.
6. Profile peak pages, allocation rate, fragmentation, and copy volume.
7. Reduce copies only after correctness is established.
8. Set defensible memory maxima and host limits.
9. Add boundary and exhaustion tests.

## Decision points
Prefer copying for simple isolation; shared memory or zero-copy only when profiling proves value. Choose guest allocator, host-managed region, or canonical ABI based on interface model and ownership complexity.

## Common failure patterns
Use-after-free across host/guest; stale typed-array views after growth; unchecked pointer+length overflow; unbounded growth; assuming alignment prevents races; freeing memory in the wrong allocator.

## Verification
Run sanitizers/toolchain checks where available, stress allocation/growth, verify maximum-memory enforcement, and measure peak memory and copy costs.

## Expected output
Explicit memory ownership rules, corrected allocation/growth behavior, resource limits, and regression evidence.

## Stop conditions
Stop if corruption cannot be reproduced safely, memory limits require product-level capacity decisions, or shared-memory changes alter the security/concurrency model without review.