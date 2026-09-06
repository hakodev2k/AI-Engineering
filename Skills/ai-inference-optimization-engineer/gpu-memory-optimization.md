# GPU Memory Optimization

## Purpose
Reduce accelerator memory pressure and fragmentation so inference servers can support larger models, longer contexts, or higher concurrency without instability.

## When to use
Use when OOM events, low batch capacity, allocator fragmentation, or excessive memory reserve limits serving efficiency.

## Inputs
Model memory profile, runtime allocator behavior, request-length distribution, concurrency targets, precision, cache configuration, and hardware memory capacity.

## Context to inspect
Inspect parameter memory, temporary activations, KV cache, runtime workspaces, CUDA graphs or equivalent captures, allocator fragmentation, pinned host memory, and memory duplication across workers.

## Core knowledge
Peak memory, not average memory, determines OOM risk. Reserved memory can differ significantly from actively used memory. Fragmentation and temporary workspaces can make theoretical capacity misleading. Memory optimization must preserve headroom for bursty request shapes.

## Procedure
1. Build a component-level memory budget.
2. Measure idle, steady-state, and peak memory under representative load.
3. Identify duplicated weights, oversized workspaces, and temporary allocations.
4. Reduce model/cache precision where validated.
5. Tune allocator and block/page sizing when supported.
6. Reuse static buffers or graph-captured memory where safe.
7. Bound request admission by estimated sequence memory.
8. Test fragmentation with heterogeneous request lengths.
9. Reserve explicit operational headroom.
10. Run prolonged saturation tests to detect leaks or unreclaimed state.

## Decision points
Trade memory for latency only when the SLO permits recomputation or transfer. Prefer deterministic admission limits over relying on OOM recovery. Use host or remote offload only when transfer latency is acceptable.

## Common failure patterns
Capacity planning from parameter size alone, running at nearly 100% memory, ignoring fragmentation, failing to release canceled-sequence state, and treating allocator reserve as a leak without evidence.

## Verification
Confirm no OOM under tested peak workload, stable memory over long runs, expected capacity improvement, and unchanged output quality.

## Expected output
A memory budget, optimized runtime configuration, and safe concurrency limits.

## Stop conditions
Stop when memory behavior cannot be observed reliably, optimization requires unsupported runtime changes, or headroom falls below the operational safety margin.