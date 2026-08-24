# Async and Concurrency

## Purpose
Build responsive backend workloads that use concurrency safely without blocking, races, or resource exhaustion.

## When to use
Use for I/O-heavy request paths, parallel work, background processing, shared-state bugs, or throughput tuning.

## Inputs
Code path, runtime model, dependency limits, latency metrics, concurrency requirements, cancellation behavior.

## Context to inspect
Thread/task usage, blocking calls, connection pools, locks, queues, cancellation propagation, timeouts, and shared mutable state.

## Core knowledge
Async I/O, structured concurrency, cancellation, backpressure, synchronization, bounded parallelism, thread safety, and pool exhaustion.

## Procedure
1. Classify work as I/O-bound or CPU-bound.
2. Trace blocking and asynchronous boundaries.
3. Propagate cancellation and deadlines.
4. Eliminate sync-over-async and unnecessary thread creation.
5. Bound fan-out according to downstream capacity.
6. Minimize shared mutable state and lock scope.
7. Test races, cancellation, saturation, and shutdown.
8. Measure throughput and tail latency.

## Decision points
Use sequential execution when ordering or downstream capacity dominates; parallelize independent work only when measured benefit exceeds coordination cost.

## Common failure patterns
Unbounded task creation, swallowed cancellation, blocking waits, lock contention, unsafe shared collections, and parallelizing calls into a constrained dependency.

## Verification
Use stress tests, concurrency-focused tests, runtime/thread metrics, connection-pool metrics, and latency comparisons.

## Expected output
A bounded, cancellation-aware concurrency design with evidence of correctness and capacity.

## Stop conditions
Stop when downstream concurrency limits are unknown or safe reproduction requires uncontrolled production load.