# Concurrency Race Analysis

## Purpose
Identify unsafe concurrent memory accesses and synchronization defects while modeling happens-before relationships and shared-state access realistically.

## When to use
Use for race detection, lock-discipline checks, unsafe publication, concurrent collections, and thread-safety analysis.

## Inputs
IR, thread/task entry points, shared-memory model, synchronization primitives, call graph, alias analysis, and framework models.

## Preconditions
Define the target language memory model and the concurrency constructs considered authoritative.

## Context to inspect
Threads, tasks, locks, atomics, volatile operations, channels, callbacks, thread pools, async boundaries, shared fields, and ownership transfer.

## Core knowledge
A data race requires conflicting accesses that may occur concurrently without sufficient ordering. May-happen-in-parallel and lockset analyses scale differently from precise happens-before reasoning. Alias precision strongly affects results.

## Procedure
1. Identify concurrency entry points and shared objects.
2. Classify read/write accesses.
3. Build ordering and synchronization relations.
4. Determine accesses that may execute in parallel.
5. Resolve aliases for candidate locations.
6. Exclude correctly ordered or consistently protected pairs.
7. Model atomics and memory-order semantics explicitly.
8. Rank remaining races by feasibility and impact.
9. Attach call, lock, and access provenance.
10. Regression-test known thread-safety patterns.

## Decision points
Use lockset-style checks for scalable screening and stronger happens-before/context reasoning for high-value findings. Treat framework abstractions through validated models rather than guessing their synchronization behavior.

## Common failure patterns
Assuming async means parallel, ignoring publication semantics, missing aliases, treating all atomics as full barriers, and reporting accesses that cannot overlap.

## Verification
Run race fixtures, compare with dynamic race detectors where available, and manually validate synchronization traces for material findings.

## Expected output
Race candidates with shared location, conflicting accesses, synchronization evidence, feasibility, and confidence.

## Stop conditions
Stop when concurrency semantics are unknown or alias/thread modeling cannot support the claimed result.