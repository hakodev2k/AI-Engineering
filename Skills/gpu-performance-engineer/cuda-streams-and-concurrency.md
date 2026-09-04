# CUDA Streams and Concurrency

## Purpose
Design and tune GPU concurrency so independent work, transfers, communication, and kernels overlap safely instead of being unintentionally serialized.

## When to use
Use when system traces show idle gaps, serialized independent kernels, blocked transfers, poor overlap, or concurrency regressions under production load.

## Inputs
- CUDA timeline and dependency graph
- Stream/event usage
- Workload concurrency and request model
- Kernel resource usage
- Transfer and communication phases

## Context to inspect
Inspect default-stream semantics, host synchronization, events, stream priorities, per-request stream assignment, library handles, memory lifetimes, and resource contention.

## Core knowledge
Concurrency only helps when work is independent and hardware resources remain available. More streams can increase contention, memory pressure, scheduling overhead, and nondeterminism. Correct dependency encoding is mandatory.

## Procedure
1. Map true data and ordering dependencies.
2. Identify independent phases currently serialized.
3. Locate device-wide or host-side synchronization.
4. Replace broad synchronization with targeted events where safe.
5. Assign streams according to dependency and request structure.
6. Test overlap of transfers, communication, and compute.
7. Measure whether concurrent kernels compete for the same limiting resources.
8. Sweep practical stream counts under production-like concurrency.
9. Verify memory ownership and lifetime across asynchronous operations.
10. Re-profile the critical path and end-to-end percentiles.

## Decision points
Use multiple streams when independent work leaves complementary or unused resources. Prefer batching when request-level concurrency creates excessive launch overhead. Serialize deliberately when concurrent kernels reduce throughput through contention.

## Common failure patterns
- Accidental synchronization through blocking APIs
- Unsafe buffer reuse before asynchronous work completes
- Assuming more streams always improve utilization
- Ignoring default-stream behavior
- Measuring throughput gains while tail latency worsens

## Verification
Verify dependency correctness with stress tests, demonstrate intended overlap in the timeline, and confirm latency, throughput, and memory behavior under representative concurrency.

## Expected output
A documented stream/event design with dependency rationale, concurrency measurements, and before/after timeline evidence.

## Stop conditions
Stop if safe dependencies cannot be established, concurrency causes unstable memory use, or tail-latency/regression costs exceed throughput gains.