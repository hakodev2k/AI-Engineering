# Memory Leak Investigation

## Purpose
Find retained objects and lifecycle leaks causing crashes, degradation, or excessive memory growth.

## When to use
OOMs, repeated-screen memory growth, image-heavy failures, long-session degradation.

## Inputs
Heap snapshots, traces, reproduction flow, device constraints.

## Context to inspect
Lifecycle owners, listeners, closures, caches, images, native resources, static/global references.

## Core knowledge
A leak is unintended retention, not merely high allocation. Compare object lifetime to intended ownership and inspect retention paths.

## Procedure
1. Establish reproducible memory-growth scenario.
2. Capture baseline after stabilization.
3. Repeat suspect lifecycle transitions.
4. Force/observe collection where tooling permits.
5. Compare heaps and retained sizes.
6. Trace roots retaining suspect objects.
7. Fix ownership, listener cleanup, cache bounds, or resource disposal.
8. Repeat the exact experiment.
9. Check for regressions on constrained devices.

## Decision points
Use bounded caching when recomputation cost justifies memory; otherwise release aggressively.

## Common failure patterns
Calling GC as a fix, confusing temporary peaks with leaks, ignoring native/image memory, unbounded singleton caches.

## Verification
Heap evidence shows objects released and memory reaches stable plateau.

## Expected output
Retention root cause, fix, and before/after evidence.

## Stop conditions
Escalate suspected framework/runtime leaks after minimal reproduction confirms them.