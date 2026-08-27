# GPU Memory Management Rules

## Purpose
Control device-memory correctness, capacity, fragmentation, transfer cost, and lifetime hazards.

## Scope
Device, host-pinned, unified, shared, pooled, and peer-accessible memory.

## MUST
- Allocation ownership and lifetime MUST be explicit across asynchronous work.
- Capacity planning MUST include peak live memory, allocator overhead, workspace, and fragmentation headroom.
- Host-device transfers MUST use correct synchronization and lifetime guarantees.
- Out-of-memory paths MUST fail predictably and preserve diagnostics.
- Long-lived services MUST expose memory usage and allocation-failure telemetry.

## MUST NOT
- MUST NOT free or reuse buffers while queued GPU work can still access them.
- MUST NOT treat unified memory as eliminating locality or migration costs.
- MUST NOT introduce unbounded caches or pools.
- MUST NOT log sensitive buffer contents merely for debugging.

## SHOULD
- Reuse allocations when profiling shows allocation overhead is material.
- Prefer bounded pools with observable eviction behavior.

## Exceptions
Unusual allocation strategies require measured benefit, capacity bounds, failure behavior, and rollback plan.

## Verification
Use memory sanitizers, peak-memory measurements, stress tests, allocator telemetry, leak checks, and review of asynchronous lifetimes.