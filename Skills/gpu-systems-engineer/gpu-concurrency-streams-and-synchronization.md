# GPU Concurrency, Streams, and Synchronization

## Purpose
Structure asynchronous GPU work to overlap useful operations while preserving precise dependency semantics.

## When to use
Use for idle gaps, unnecessary serialization, multi-stream pipelines, copy/compute overlap, or synchronization bugs.

## Inputs
Execution timeline, stream/event usage, dependency graph, host threads, copy paths, kernel launch sequence.

## Preconditions
Define data ownership and happens-before requirements before removing synchronization.

## Context to inspect
Inspect default-stream semantics, events, host waits, device barriers, allocator behavior, library stream ownership, copy engines, graph capture, and implicit synchronization APIs.

## Core knowledge
GPU APIs are commonly asynchronous. Correctness requires explicit dependencies, not global synchronization. Concurrency is constrained by resources, copy engines, kernel occupancy, dependencies, and library behavior. More streams can increase contention and complexity.

## Procedure
1. Draw the true data dependency DAG.
2. Capture a timeline and locate idle/serialized regions.
3. Identify global waits and implicit synchronization.
4. Replace global barriers with events or narrower dependencies where safe.
5. Assign independent work to streams intentionally.
6. Use asynchronous transfers only with compatible memory and lifetime guarantees.
7. Check allocator and library calls for hidden synchronization.
8. Bound in-flight work to avoid memory growth.
9. Stress race-prone ordering with repeated tests.
10. Re-profile overlap and end-to-end latency.

## Decision points
Use multiple streams only for independent work with available hardware resources. Prefer simple dependency chains when overlap gains are marginal. Choose host synchronization only at externally observable completion boundaries.

## Common failure patterns
Use-after-free of asynchronous buffers, assuming launch order across streams, default-stream surprises, excessive events, hidden allocator sync, oversubscription, and race bugs masked by debug synchronization.

## Verification
Verify race-free outputs, timeline dependencies, overlap, bounded memory, deterministic required semantics, and performance under representative concurrency.

## Expected output
A documented dependency model, synchronization changes, tests, and measured overlap improvement.

## Stop conditions
Stop when ownership/lifetime cannot be proven, external libraries have undocumented stream semantics, or removing synchronization changes required ordering.