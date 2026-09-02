# Memory Determinism Rules

## Purpose
Prevent memory behavior from introducing unbounded latency or operational instability.

## Scope
Allocation, deallocation, heaps, stacks, pools, fragmentation, paging, and memory ownership.

## MUST
- Deadline-critical paths MUST use memory mechanisms with bounded allocation and release behavior.
- Stack and pool capacities MUST be sized from evidence and include explicit exhaustion behavior.
- Systems where paging can violate deadlines MUST lock or otherwise control critical memory residency.
- Memory exhaustion MUST fail predictably without corrupting state.

## MUST NOT
- MUST NOT introduce uncontrolled heap allocation, garbage-collection pauses, or page faults into hard real-time paths without proven bounds.
- MUST NOT rely on undefined behavior after pool or stack exhaustion.

## SHOULD
- Prefer preallocation and bounded pools for high-criticality workloads.

## Exceptions
Dynamic allocation requires measured bounds, fragmentation analysis, failure handling, and approval proportional to criticality.

## Verification
Inspect allocation sites, stack high-water marks, pool telemetry, stress tests, runtime configuration, and memory-latency traces.