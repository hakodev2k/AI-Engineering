# GPU Synchronization and Memory Ordering

## Purpose
Design correct and efficient synchronization between GPU threads, workgroups, kernels, and host code while minimizing unnecessary barriers and ordering constraints.

## When to use
Use when implementing cooperative algorithms, shared-memory exchanges, producer-consumer stages, inter-kernel dependencies, or debugging race conditions and nondeterministic output.

## Inputs
Kernel code, synchronization primitives, memory spaces, stream/queue relationships, data dependency graph, race reports, profiler timeline, target programming model.

## Preconditions
The ownership and visibility requirements for each shared value must be explicit. Do not optimize away synchronization before correctness is proven.

## Context to inspect
Inspect block/workgroup barriers, warp/subgroup synchronization, atomics, fences, stream events, kernel ordering guarantees, host-device synchronization, shared/global memory scope, and whether all participating threads reach collective barriers safely.

## Core knowledge
Synchronization has both execution-order and memory-visibility semantics. A barrier stronger than required can serialize work; a weaker primitive can create races. Device APIs differ in scope and memory-order guarantees, so assumptions must match the active programming model and architecture.

## Procedure
1. Draw the producer-consumer dependency graph for shared data.
2. Mark which threads or kernels can access each value concurrently.
3. Identify the minimum synchronization scope required for correctness.
4. Use subgroup/warp-level primitives only when participation assumptions are valid.
5. Use block/workgroup barriers for cooperative shared-memory phases.
6. Use atomics when updates are concurrent and reducible without a full barrier.
7. Use stream/queue events for cross-kernel dependencies instead of broad device synchronization.
8. Remove redundant barriers one at a time and re-run race/correctness tests.
9. Profile barrier stalls and lost overlap.
10. Document any architecture- or API-specific memory-order assumption.

## Decision points
Prefer narrower synchronization scope when semantics allow. Use atomics instead of barriers for isolated shared updates, but avoid high-contention atomics when hierarchical aggregation is cheaper. Choose deterministic ordering only when required by correctness or reproducibility goals.

## Common failure patterns
Assuming a barrier also synchronizes unrelated blocks; using device-wide synchronization after every kernel; placing barriers on divergent paths; depending on undocumented warp lockstep; replacing races with volatile qualifiers; forgetting host-device visibility boundaries.

## Verification
Run race-detection tooling where available, stress variable scheduling and input sizes, compare deterministic/tolerance-based results, and confirm reduced synchronization time without new data hazards.

## Expected output
A documented synchronization design with the minimum correct scopes and profiler-backed evidence of acceptable overhead.

## Stop conditions
Escalate when correctness depends on unsupported global synchronization, memory-model semantics are ambiguous, or removing synchronization requires redesign of the algorithm.