# Execution Scheduling

## Purpose
Order and overlap LLM operations to reduce critical-path latency while respecting dependencies, memory pressure, device streams, collectives, and runtime constraints.

## When to use
Use when optimizing pipeline overlap, asynchronous copies, multi-stream execution, prefill/decode scheduling, or diagnosing idle device periods.

## Inputs
- Dependency graph
- Kernel timing/profile data
- Memory-lifetime information
- Stream/event semantics
- Device and runtime constraints

## Preconditions
Have explicit dependency and effect information. Do not reorder stateful, aliasing, RNG, or collective operations without proven legality.

## Context to inspect
Inspect data dependencies, control dependencies, stream assignments, host-device transfers, collectives, workspace reuse, synchronization, and runtime queue behavior.

## Core knowledge
Scheduling trades parallelism against memory and synchronization. Overlap is useful only when independent work and hardware resources exist. Reordering can extend live ranges, increase peak memory, contend for shared resources, or violate state semantics.

## Procedure
1. Build a dependency DAG including effects and resource constraints.
2. Identify critical-path operations.
3. Find legal independent work for overlap.
4. Model stream/event synchronization explicitly.
5. Estimate memory-lifetime impact of reordering.
6. Prioritize latency-sensitive decode or critical-path work when appropriate.
7. Insert synchronization only where required.
8. Validate interaction with memory reuse and collectives.
9. Profile device utilization and idle gaps.
10. Compare end-to-end latency, throughput, and peak memory.

## Decision points
Use multiple streams when kernels or transfers can overlap without severe contention. Keep execution serialized when overlap increases memory or resource interference more than it reduces idle time.

## Common failure patterns
- Reordering across hidden effects.
- Adding streams without reducing idle time.
- Extending tensor lifetimes enough to cause OOM.
- Missing event dependencies.
- Optimizing kernel overlap while increasing queueing latency.

## Verification
Implemented means the schedule executes. Verified means dependency tests pass, races are absent, memory remains within limits, and traces show the intended overlap with improved target metrics.

## Expected output
A legal schedule, synchronization plan, fallback behavior, and trace-based performance evidence.

## Stop conditions
Stop when dependency/effect information is incomplete, runtime synchronization semantics are unknown, or overlap introduces nondeterministic correctness failures.