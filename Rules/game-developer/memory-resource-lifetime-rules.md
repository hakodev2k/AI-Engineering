# Memory and Resource Lifetime Rules

## Purpose
Prevent leaks, spikes, fragmentation, and use-after-release behavior in long-running play sessions.

## Scope
Managed/native memory, GPU resources, pools, handles, subscriptions, caches, and ownership.

## MUST
- Long-lived resources MUST have explicit ownership and release semantics.
- Memory-sensitive features MUST be measured over representative sustained sessions, not only startup.
- Pools and caches MUST have bounded growth or a documented eviction policy.
- Native, GPU, file, and engine handles MUST be released on every lifecycle path.

## MUST NOT
- MUST NOT retain scene or entity graphs accidentally through global callbacks or caches.
- MUST NOT introduce pooling without measuring allocation pressure and retained-memory cost.

## SHOULD
- Allocation-heavy hot paths SHOULD be redesigned when profiling shows frame-time or GC impact.

## Exceptions
Intentional process-lifetime allocations require bounded size and documented rationale.

## Verification
Use heap snapshots, native/GPU memory tools, repeated scene cycles, soak tests, allocation profiles, and ownership review.