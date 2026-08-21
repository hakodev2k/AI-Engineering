# Memory, Allocation, and GC Analysis

## Purpose
Diagnose memory pressure, allocation hotspots, garbage-collection pauses, leaks, and retention patterns that degrade latency or capacity.

## When to use
Use for growing memory, OOM events, high GC CPU, long pauses, reduced container density, or allocation-correlated latency.

## Inputs
Heap metrics, allocation rates, GC telemetry, memory dumps/profiles, workload, runtime configuration, and resource limits.

## Context to inspect
Inspect heap generations, large-object behavior, native memory, caches, buffers, object lifetimes, pooling, pinned objects, finalizers, and container memory accounting.

## Core knowledge
High memory usage is not automatically a leak. Distinguish live-set growth, temporary allocation rate, fragmentation, native allocations, and intentional caches. Reducing allocation can improve both CPU and pause behavior.

## Procedure
1. Correlate memory and GC metrics with workload and latency.
2. Determine whether memory returns after load subsides.
3. Measure allocation rate and live-set trend.
4. Capture comparable heap snapshots or dumps.
5. Identify dominant types and retention paths.
6. Inspect large buffers, caches, subscriptions, static roots, and resource lifetimes.
7. Check GC frequency, pause duration, and generation behavior.
8. Change ownership, lifetime, allocation, or pooling only where evidence supports it.
9. Repeat the workload and compare allocation/live-set trends.
10. Verify latency and throughput as well as memory.

## Decision points
Use pooling for expensive/high-frequency allocations only when lifecycle complexity is justified. Do not trade bounded allocation for unbounded retention.

## Common failure patterns
Calling every high heap a leak, forcing GC as a fix, snapshotting incomparable states, ignoring native memory, overusing pooling, and optimizing allocation without measuring end-to-end impact.

## Verification
Demonstrate stable live memory, acceptable allocation/GC rates, and no regression under representative sustained load.

## Expected output
A retention or allocation diagnosis with evidence and verified remediation.

## Stop conditions
Escalate when production dumps contain sensitive data requiring special handling or runtime visibility is insufficient.