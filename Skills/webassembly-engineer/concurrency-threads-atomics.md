# Concurrency, Threads, and Atomics

## Purpose
Design correct concurrent Wasm workloads using shared memory, workers/threads, and atomic synchronization.

## When to use
Use when parallelism is required for measured throughput/latency goals or when debugging races/deadlocks in threaded Wasm.

## Inputs
Concurrency requirements, runtime/browser support, memory model, thread library, shared state, profiles, and failing traces.

## Context to inspect
Inspect shared-memory declarations, maximum memory, atomics usage, worker/thread creation, locks, wait/notify operations, host synchronization, and isolation headers in browsers.

## Core knowledge
Shared Wasm memory requires atomic synchronization for data races. Host and guest concurrency models interact. Parallelism adds scheduling, contention, memory, and portability costs. Runtime support varies.

## Procedure
1. Confirm parallelism is justified by measurement.
2. Define ownership of mutable state.
3. Minimize shared writable data.
4. Establish synchronization and memory-ordering rules.
5. Bound worker/thread counts.
6. Avoid blocking host event loops.
7. Instrument lock contention and queueing.
8. Reproduce races under stress and varied scheduling.
9. Test cancellation and shutdown.
10. Compare parallel speedup against overhead.

## Decision points
Prefer message passing when isolation and simplicity dominate; shared memory when data volume/latency makes copying prohibitive. Use coarse synchronization for simplicity until contention proves it inadequate.

## Common failure patterns
Non-atomic access to shared state; unbounded workers; deadlocks across host callbacks; false sharing; assuming native thread APIs map identically to every Wasm target.

## Verification
Run stress/race-oriented tests, repeated scheduling variants, deadlock timeouts, and performance scaling measurements.

## Expected output
A documented concurrency model with bounded parallelism, explicit synchronization, and measured scalability.

## Stop conditions
Stop if target runtimes lack required thread/atomic support, race safety cannot be demonstrated, or parallelism harms the host availability envelope.