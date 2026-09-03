# Memory Footprint Optimization

## Purpose
Reduce inference memory consumption and fragmentation so models fit target accelerators, sustain higher concurrency, and avoid out-of-memory failures.

## When to use
Use when deployments are memory-bound, OOM under burst load, or require better model density.

## Inputs
Weight sizes, runtime memory reports, allocator metrics, tensor shapes, activation peaks, KV-cache usage, precision settings, and concurrency targets.

## Context to inspect
Inspect static weights, temporary buffers, activations, caches, allocator fragmentation, graph-workspace reservations, duplicated model copies, and host-pinned memory.

## Core knowledge
Peak memory rather than average memory determines feasibility. Fragmentation, temporary workspaces, and duplicated buffers can consume large hidden capacity. Memory reduction must not introduce excessive recomputation or transfer overhead.

## Procedure
1. Establish peak memory by stage and workload class.
2. Separate persistent from transient allocations.
3. Quantify weights, KV cache, activations, workspaces, and fragmentation.
4. Remove unnecessary tensor copies and retained references.
5. Evaluate lower precision where quality allows.
6. Tune allocator and cache block sizes.
7. Test activation/workspace reuse supported by the runtime.
8. Evaluate CPU/offload only with transfer-cost measurements.
9. Stress-test long contexts and maximum concurrency.
10. Confirm memory returns after cancellation and model reloads.

## Decision points
Prefer precision reduction and allocation reuse before offloading. Use offload when memory capacity matters more than transfer latency. Reduce concurrency when reliability is more valuable than density.

## Common failure patterns
Measuring idle memory, ignoring fragmentation, optimizing weights while KV cache dominates, hiding OOM with retries, and introducing PCIe transfer bottlenecks.

## Verification
Verified means peak and steady-state memory improve under representative stress tests without latency, correctness, or stability regressions beyond agreed limits.

## Expected output
Memory breakdown, optimized configuration, peak-memory evidence, and safe concurrency limits.

## Stop conditions
Escalate on suspected memory corruption, nondeterministic allocator failures, or required quality-impacting precision changes without approval.