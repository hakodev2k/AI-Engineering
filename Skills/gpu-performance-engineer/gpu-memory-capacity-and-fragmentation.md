# GPU Memory Capacity and Fragmentation

## Purpose
Diagnose and control GPU memory pressure, fragmentation, allocation overhead, and out-of-memory risk while preserving performance and workload correctness.

## When to use
Use when workloads approach device capacity, allocations cause latency spikes, long-lived services fragment memory, or larger batches/models fail despite apparently sufficient nominal capacity.

## Inputs
- Allocation traces or framework memory statistics
- Peak and steady-state device memory use
- Tensor/buffer lifetimes and sizes
- Allocator configuration
- OOM logs and reproduction steps

## Context to inspect
Inspect persistent weights/state, activations, temporary workspaces, caches, allocator pools, fragmentation, duplicate buffers, stream-ordered lifetimes, and memory reserved versus actually used.

## Core knowledge
Capacity problems are not only about total bytes. Allocation timing, lifetime overlap, fragmentation, caching allocators, workspace selection, and asynchronous execution determine effective headroom. Memory-saving changes may trade compute or latency for capacity.

## Procedure
1. Reproduce peak-memory behavior with representative shapes.
2. Separate allocated, reserved, cached, and free memory metrics.
3. Identify peak-lifetime regions and largest allocations.
4. Find unnecessary duplicates and long-lived temporary buffers.
5. Check allocator fragmentation and pooling behavior.
6. Evaluate buffer reuse or lifetime shortening where dependency-safe.
7. Compare checkpointing/recomputation, lower precision, sharding, or smaller workspaces when capacity is structural.
8. Stress repeated execution to expose fragmentation growth.
9. Measure performance impact of each mitigation.
10. Preserve explicit safety headroom for production variance.

## Decision points
Prefer lifetime reduction and reuse before reducing batch size. Use recomputation when compute overhead is acceptable. Use sharding when persistent state dominates. Tune allocator behavior only with evidence that fragmentation, not live data, is the issue.

## Common failure patterns
- Treating reserved memory as a leak
- Emptying caches repeatedly and increasing allocation overhead
- Eliminating headroom to maximize batch size
- Ignoring temporary library workspaces
- Fixing OOM with smaller batches without understanding the peak

## Verification
Verify repeated long-running execution without OOM, bounded reserved-memory behavior, expected peak usage, and acceptable latency/throughput after mitigation.

## Expected output
A memory-pressure diagnosis with peak-lifetime evidence, root cause, mitigation, performance trade-offs, and required operational headroom.

## Stop conditions
Stop when the workload fundamentally exceeds hardware capacity and requires model, sharding, or infrastructure decisions outside approved scope.