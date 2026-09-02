# Kernel Fusion and Pipeline Optimization

## Purpose
Reduce launch overhead and intermediate memory traffic by combining compatible GPU operations without creating an oversized, resource-heavy kernel.

## When to use
Use when profiler timelines show many small kernels, repeated reads/writes of intermediates, or launch latency dominating execution.

## Inputs
Kernel sequence, dependency graph, tensor shapes, intermediate sizes, launch timings, resource usage, and correctness constraints.

## Context to inspect
Producer-consumer locality, synchronization boundaries, data reuse, register pressure, shared-memory use, branch complexity, and whether operations have compatible parallel decompositions.

## Core knowledge
Fusion trades fewer launches and memory round trips for larger kernels, higher register pressure, more complex control flow, and potentially worse occupancy. Fusion is valuable only when total pipeline cost decreases.

## Procedure
1. Measure per-kernel time, launch gaps, and intermediate memory traffic.
2. Identify adjacent operations with direct data dependencies.
3. Determine whether their thread mappings and synchronization scopes are compatible.
4. Estimate eliminated reads/writes and launches.
5. Prototype fused execution while preserving boundary semantics.
6. Measure register growth, occupancy, instruction count, and cache behavior.
7. Split fusion groups when resource pressure outweighs traffic savings.
8. Compare fused and unfused paths across small and large workloads.
9. Retain a fallback when shape-dependent performance reverses the trade-off.

## Decision points
Fuse when intermediate traffic or launch latency is material and resource growth is controlled. Keep kernels separate when independent scheduling, reuse by multiple consumers, or occupancy matters more.

## Common failure patterns
Fusing everything; hiding poor algorithm choice behind fusion; increasing register spills; introducing divergent control flow; and benchmarking only one tensor shape.

## Verification
Confirm identical outputs, lower end-to-end latency, reduced memory traffic or launches, and no regressions across representative workloads.

## Expected output
A justified fusion plan with measured pipeline-level benefit.

## Stop conditions
Stop when fusion changes synchronization semantics, increases numerical error beyond tolerance, or cannot be evaluated with representative workloads.