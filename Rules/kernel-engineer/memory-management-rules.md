# Memory Management Rules

## Purpose
Prevent corruption, leaks, use-after-free defects, unbounded allocation, and unsafe memory-pressure behavior.

## Scope
Kernel allocation, virtual memory, page management, mappings, reclaim, ownership, and memory pressure.

## MUST
- Every allocation MUST have explicit ownership, lifetime, release, and failure semantics.
- Allocation failure MUST be handled on paths where failure is possible.
- Code running in constrained or non-sleepable contexts MUST use allocation mechanisms valid for that context.
- Mapping changes MUST preserve required permissions, coherency, ordering, and teardown semantics.
- Memory-pressure behavior MUST be bounded and evaluated for critical paths.
- Shared memory structures MUST define synchronization and lifetime rules together.

## MUST NOT
- MUST NOT dereference memory after ownership transfer or release.
- MUST NOT assume allocation succeeds unless the allocator contract guarantees it.
- MUST NOT expose writable or executable mappings beyond the minimum required scope.
- MUST NOT introduce unbounded kernel memory growth controlled by untrusted input.

## SHOULD
- Prefer explicit ownership models and scoped cleanup patterns.
- Hot-path allocation SHOULD be measured and minimized when it affects latency or fragmentation.
- Large or long-lived allocations SHOULD include capacity and pressure analysis.

## Exceptions
Any deviation requires measured need, failure-mode analysis, alternative evaluation, and maintainer approval for high-risk memory semantics.

## Verification
Use static analysis, sanitizers/debug allocators where supported, fault injection, leak checks, stress tests, memory-pressure tests, mapping inspection, and focused review of allocation/free pairs and error unwinding.