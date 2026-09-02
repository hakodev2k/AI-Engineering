# Memory and Bandwidth Optimization

## Purpose
Reduce peak memory, allocation churn, tensor-copy overhead, and memory-bandwidth pressure so edge inference remains stable and fast within constrained devices.

## When to use
Use when devices OOM, swap, stall, thermal-throttle due to excessive traffic, or show latency dominated by memory movement rather than arithmetic.

## Inputs
Memory traces, runtime profiler output, model graph, tensor shapes, allocator settings, hardware memory hierarchy, preprocessing pipeline, and concurrency requirements.

## Preconditions
Capture a reproducible workload and distinguish steady-state memory from startup/compilation peaks.

## Context to inspect
Activation lifetimes, tensor copies, input buffering, image/audio conversion, batch size, allocator reuse, runtime arenas, zero-copy APIs, and accelerator memory boundaries.

## Core knowledge
Edge workloads are often memory-bound. Peak activation memory can exceed weight storage; copies across camera, CPU, GPU/NPU, and application buffers can dominate latency. Reuse, in-place operations, tiling, static allocation, and graph fusion can help but may increase complexity or constrain shapes.

## Procedure
1. Measure peak resident memory and allocation timeline.
2. Attribute memory to weights, activations, buffers, runtime, and application code.
3. Identify redundant copies and layout conversions.
4. Reuse buffers where lifetimes do not overlap.
5. Configure runtime memory arenas or static planning when supported.
6. Reduce input resolution, batch size, or intermediate precision only with quality validation.
7. Evaluate zero-copy or shared-memory paths across device boundaries.
8. Fuse preprocessing or graph operations when it reduces traffic measurably.
9. Test concurrent workloads and memory fragmentation over long runs.
10. Preserve headroom for updates, telemetry, and OS services.

## Decision points
Prefer structural reductions before custom allocators. Use zero-copy when ownership and lifetime semantics are safe. Choose tiling when working-set reduction outweighs additional control overhead.

## Common failure patterns
Optimizing model weights while ignoring activations, unbounded frame queues, hidden format conversions, memory pools sized only for average load, and benchmarks that exclude camera or preprocessing buffers.

## Verification
Profile peak and sustained memory, page faults, copy counts, bandwidth utilization, and end-to-end latency under worst-case concurrency.

## Expected output
A measured memory budget with optimized buffer lifetimes, reduced copies, and documented headroom.

## Stop conditions
Stop if optimization requires unsafe ownership semantics, breaks numerical correctness, or still leaves insufficient memory for system-level worst cases.