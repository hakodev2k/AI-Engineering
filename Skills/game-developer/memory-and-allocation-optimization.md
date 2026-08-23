# Memory and Allocation Optimization

## Purpose
Control runtime memory, allocation churn, garbage collection, fragmentation, and asset residency to prevent stutter and crashes.

## When to use
Use for GC spikes, out-of-memory failures, mobile/console memory limits, streaming issues, or high-frequency allocations.

## Inputs
Memory budgets, profiler snapshots, allocation traces, asset sizes, object lifecycles, platform limits, and reproduction scenarios.

## Context to inspect
Inspect managed/native heaps, transient allocations, pools, textures/meshes/audio, caches, scene unload behavior, references preventing release, and streaming.

## Core knowledge
Memory optimization is lifecycle management. Pooling trades lower allocation churn for retained memory and reset complexity. Large assets often dominate footprint more than code objects. Fragmentation and native allocations may matter independently of managed GC.

## Procedure
1. Establish memory budgets and peak scenarios.
2. Capture baseline snapshots and allocation timelines.
3. Separate persistent, streaming, cached, and transient memory.
4. Find unexpected retention and hot allocation sites.
5. Remove unnecessary allocations from high-frequency paths.
6. Pool only objects with demonstrated churn and predictable reset semantics.
7. Right-size asset residency and caches.
8. Validate unload/release behavior.
9. Stress transitions and long sessions.
10. Re-measure peak and steady-state memory.

## Decision points
Prefer allocation elimination before pooling small objects. Pool expensive frequently recreated objects when retained capacity fits budget. Stream large content when latency and storage bandwidth permit.

## Common failure patterns
Pooling everything, pools that grow forever, stale references, caches without eviction, hidden string/LINQ allocations in hot paths, and testing only fresh sessions.

## Verification
Compare snapshots, GC frequency, peak memory, long-session growth, scene transition cleanup, and platform memory warnings.

## Expected output
Measured memory usage within budget with controlled allocation and release behavior.

## Stop conditions
Stop when platform memory limits or asset ownership are unknown, or a suspected leak cannot be reproduced with available diagnostics.