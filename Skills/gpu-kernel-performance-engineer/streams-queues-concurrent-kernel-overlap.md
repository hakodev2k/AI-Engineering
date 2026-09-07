# Streams, Queues, and Concurrent Kernel Overlap

## Purpose
Schedule independent GPU work so kernels, copies, and host activity overlap safely instead of serializing behind unnecessary stream or queue dependencies.

## When to use
Use when timelines show idle gaps, serialized independent kernels, copy/compute phases that could overlap, or excessive synchronization between pipeline stages.

## Inputs
Execution DAG, stream/queue usage, event dependencies, transfer directions, kernel resource usage, profiler timeline, host scheduling behavior.

## Preconditions
Data dependencies and ownership must be explicit. Correctness should not rely on accidental default-stream ordering.

## Context to inspect
Inspect queue semantics, event placement, copy-engine availability, kernel concurrency limits, resource saturation, memory hazards, pageable versus pinned host memory, and CPU submission gaps.

## Core knowledge
Concurrency only helps when independent work exists and hardware resources are available. Two kernels may be logically independent yet fail to overlap because one consumes all registers, shared memory, compute, or bandwidth. Explicit events are preferable to device-wide barriers.

## Procedure
1. Draw the execution DAG and mark true data dependencies.
2. Capture a timeline and identify avoidable serialized regions.
3. Place independent operations on separate streams/queues.
4. Replace broad synchronizations with events scoped to actual dependencies.
5. Use asynchronous transfers only with memory types and lifetimes that support them.
6. Measure whether kernels and copies overlap in practice.
7. Check whether one workload monopolizes the limiting resource.
8. Tune chunk sizes when pipelining transfers and compute.
9. Ensure host submission keeps the device fed.
10. Revalidate ordering under stress and error paths.

## Decision points
Use more streams only while they increase useful overlap. Chunk work when transfer/compute stages can pipeline; avoid fragmentation when launch overhead dominates. Serialize intentionally when concurrency causes cache thrash, QoS problems, or bandwidth contention.

## Common failure patterns
Adding streams without independent work; synchronizing after every launch; assuming asynchronous copies overlap automatically; using pageable host memory; introducing use-after-free across queues; optimizing timeline overlap while total runtime worsens.

## Verification
Confirm intended overlap in profiler timelines, reduced end-to-end latency or improved throughput, correct event ordering, and stable behavior under representative load.

## Expected output
A dependency-aware concurrency plan with timeline evidence and explicit synchronization boundaries.

## Stop conditions
Escalate when framework-level scheduling hides dependencies, required overlap conflicts with memory-lifetime guarantees, or hardware resources are already fully saturated.