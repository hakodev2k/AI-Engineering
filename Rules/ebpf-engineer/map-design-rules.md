# eBPF Map Design

## Purpose
Protect correctness, memory use, concurrency behavior, and lifecycle of shared eBPF state.

## Scope
All map types, keys, values, pinning, iteration, eviction, synchronization, and userspace access.

## MUST
- Map type MUST match access pattern, concurrency semantics, cardinality, and eviction requirements.
- Key/value ABI MUST be versioned or compatibility-protected when shared across releases.
- Maximum entries and value sizes MUST have an explicit memory-budget rationale.
- Concurrent updates MUST use synchronization semantics appropriate to the map and data structure.
- Pinned maps MUST have explicit ownership and cleanup policy.

## MUST NOT
- MUST NOT use unbounded logical cardinality without capacity and eviction behavior.
- MUST NOT mutate shared layouts incompatibly during rolling deployment.
- MUST NOT assume per-CPU values are globally coherent without aggregation semantics.

## SHOULD
- Prefer per-CPU maps for hot counters when aggregation is acceptable.
- Separate high-cardinality diagnostic state from essential control state.

## Exceptions
Exceptions require measured memory/CPU impact, compatibility plan, failure behavior, and production approval when risk is material.

## Verification
Calculate worst-case memory, load-test cardinality, test concurrent access and upgrade compatibility, and inspect pinned-object cleanup.