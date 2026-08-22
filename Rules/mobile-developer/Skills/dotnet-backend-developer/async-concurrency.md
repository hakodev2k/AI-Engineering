# Async and Concurrency

## Purpose
Build non-blocking .NET backend workflows with bounded concurrency, correct cancellation, and predictable failure propagation.

## When to use
I/O-heavy APIs, parallel fan-out, background processing, throughput bottlenecks, thread-pool starvation, or race-condition reviews.

## Inputs
Call graph, workload type, concurrency limits, cancellation requirements, dependency limits, traces.

## Context to inspect
`async`/`await` flow, blocking calls, `Task.Run`, `WhenAll`, semaphores/channels, shared state, cancellation tokens, timeouts.

## Core knowledge
Async improves scalability for waits, not CPU work; cancellation is cooperative; unbounded fan-out shifts failure downstream; Task exceptions must be observed; shared mutable state needs synchronization.

## Procedure
1. Classify work as I/O-bound or CPU-bound.
2. Propagate async end-to-end.
3. Remove `.Result`, `.Wait()`, and unnecessary `Task.Run` from server request paths.
4. Propagate cancellation.
5. Bound parallelism by downstream capacity.
6. Define timeout and partial-failure behavior.
7. Protect shared state with simple proven primitives.
8. Load-test concurrency-sensitive paths.

## Decision points
Use sequential processing when ordering/capacity matters; `Task.WhenAll` for small bounded independent sets; channels/queues for sustained producer-consumer workloads.

## Common failure patterns
Sync-over-async, unbounded `WhenAll`, lost cancellation, fire-and-forget tasks, locks held across awaits, concurrent DbContext use.

## Verification
Stress/load tests, thread-pool metrics, cancellation tests, failure injection.

## Expected output
Bounded, cancellable async workflows with explicit failure semantics.

## Stop conditions
Escalate custom lock-free algorithms or hard real-time guarantees.