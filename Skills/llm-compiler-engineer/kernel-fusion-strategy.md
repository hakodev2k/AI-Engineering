# Kernel Fusion Strategy

## Purpose
Design and validate kernel fusion decisions that reduce launch overhead and memory traffic without creating register pressure, code-size explosions, or poor occupancy.

## When to use
Use when optimizing attention, MLP blocks, normalization, activation chains, quantized paths, or diagnosing excessive kernel launches.

## Inputs
- Lowered graph or tensor IR
- Target accelerator characteristics
- Shapes and dtypes
- Profiling traces
- Existing fusion rules

## Preconditions
Have baseline performance data and a correctness oracle. Know whether shapes are static, bounded dynamic, or highly variable.

## Context to inspect
Inspect producer-consumer chains, tensor sizes, reuse, reductions, broadcasts, layouts, shared memory, register usage, occupancy, launch count, and generated code.

## Core knowledge
Fusion is a locality optimization, not a universal rule. Fusing pointwise chains is usually cheap; reductions, transposes, large matmuls, and attention kernels require hardware-aware trade-offs. Excessive fusion can increase live ranges, register spills, recompilation, and tail inefficiency.

## Procedure
1. Profile the unfused execution.
2. Identify memory-bound producer-consumer boundaries.
3. Estimate eliminated intermediate traffic and launches.
4. Check shape, layout, dtype, and effect legality.
5. Estimate resource growth: registers, shared memory, code size, synchronization.
6. Implement a guarded fusion pattern.
7. Inspect generated kernel structure.
8. Benchmark small, typical, and large shapes.
9. Compare occupancy, spills, bandwidth, and latency.
10. Add profitability thresholds and fallback paths.

## Decision points
Fuse when eliminated traffic and launch overhead outweigh resource growth. Keep heavy compute kernels separate when fusion reduces occupancy or blocks tuned library kernels. Prefer epilogue fusion when it preserves optimized matmul implementations.

## Common failure patterns
- Maximizing fusion count instead of end-to-end latency.
- Ignoring register spills.
- Fusing across synchronization or effect boundaries.
- Specializing too many fused variants.
- Benchmarking one favorable shape only.

## Verification
Implemented means the fused kernel is generated. Verified means outputs match reference results and end-to-end benchmarks improve across the intended workload without unacceptable memory, compile-time, or code-cache regressions.

## Expected output
Fusion rules with legality checks, profitability criteria, fallback behavior, and benchmark evidence.

## Stop conditions
Stop when correctness cannot be proven, generated resource usage exceeds target limits, or representative latency regresses despite theoretical traffic reduction.