# Fusion and Kernel Partitioning

## Purpose
Design and tune graph partitioning and operation fusion so compiled workloads reduce launch overhead and memory traffic without creating oversized or inefficient kernels.

## When to use
Use when optimizing execution graphs, introducing a fusion backend, investigating excessive kernel launches, or fixing regressions caused by over-fusion.

## Inputs
Compiler IR, dependency graph, backend fusion capabilities, profile data, memory constraints, target architecture.

## Context to inspect
Inspect producer-consumer chains, reductions, broadcasts, side effects, aliasing, synchronization boundaries, shared-memory/register pressure, code-size growth, and fallback boundaries.

## Core knowledge
Fusion is constrained by legality and profitability. Legal fusion preserves dependencies and effects; profitable fusion balances saved memory traffic and launches against resource pressure, duplicated computation, compilation cost, and reduced scheduling freedom.

## Procedure
1. Profile launch count, bandwidth pressure, and expensive intermediates.
2. Build fusion legality rules from dependencies, effects, aliasing, and backend support.
3. Identify candidate producer-consumer regions.
4. Estimate benefits from eliminating intermediates and launches.
5. Estimate costs from register/shared-memory pressure, code size, duplication, and occupancy loss.
6. Partition regions using explicit profitability heuristics.
7. Preserve barriers around unsupported or effectful operations.
8. Generate fused kernels and inspect resource usage.
9. Benchmark fused versus unfused variants.
10. Add regression cases for both under-fusion and over-fusion.

## Decision points
Fuse elementwise chains aggressively when resource cost is low; be conservative around large reductions, divergent control flow, expensive recomputation, or backend limits. Split kernels when occupancy or compile time degrades materially.

## Common failure patterns
Over-fusion, fusion across hidden effects, duplicated expensive operations, giant kernels, backend codegen blowups, and heuristics tuned to one model only.

## Verification
Run correctness tests, compare kernel counts and memory traffic, inspect occupancy/resource metrics, and benchmark representative shapes and models.

## Expected output
A validated partition/fusion policy or targeted rewrite with measured end-to-end gains and documented legality constraints.

## Stop conditions
Stop if dependency/effect semantics are ambiguous, backend resource limits cannot be measured, or fusion wins only on microbenchmarks while regressing end-to-end performance.