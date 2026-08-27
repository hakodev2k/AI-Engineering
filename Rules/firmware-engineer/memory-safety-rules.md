# Memory Safety

## Purpose
Prevent corruption, exhaustion, fragmentation, and lifetime defects.

## Scope
Stacks, heaps, static storage, buffers, pointers, DMA memory, and memory-mapped regions.

## MUST
- Buffer lengths and object lifetimes MUST be explicit at interfaces.
- Stack usage MUST be bounded for critical tasks and interrupt contexts.
- Memory regions shared with DMA MUST satisfy alignment, cache coherency, and lifetime requirements.
- Bounds-sensitive parsing and copying MUST validate sizes before access.
- Memory exhaustion MUST have defined behavior where allocation is possible at runtime.

## MUST NOT
- Unchecked pointer arithmetic or unchecked external lengths MUST NOT control memory access.
- Dynamic allocation MUST NOT be used on deterministic critical paths without bounded behavior and fragmentation analysis.
- Freed or out-of-scope memory MUST NOT remain referenced by asynchronous hardware or tasks.

## SHOULD
- Static allocation SHOULD be preferred for fixed-lifetime critical resources.

## Exceptions
Exceptions require memory-budget evidence and stress verification.

## Verification
Use compiler diagnostics, sanitizers where target/host permits, static analysis, stack-watermark tests, and long-duration stress tests.