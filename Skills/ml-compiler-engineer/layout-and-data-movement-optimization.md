# Layout and Data Movement Optimization

## Purpose
Reduce expensive tensor transposes, copies, packing, and device transfers by reasoning about layout through the compiler pipeline.

## When to use
Use when profiles show bandwidth or transpose overhead, when integrating layout-sensitive kernels, or when a backend requires specific memory formats.

## Inputs
IR with layout information, kernel requirements, hardware memory hierarchy, profile traces, tensor shapes, aliasing constraints.

## Context to inspect
Inspect producer/consumer layouts, strides, contiguity, views versus copies, device boundaries, fusion regions, kernel contracts, and layout propagation passes.

## Core knowledge
Data movement frequently dominates arithmetic cost. Layout decisions are global trade-offs: optimizing one operator can introduce conversions elsewhere. Views are cheap only when downstream consumers can honor their strides and aliasing semantics.

## Procedure
1. Profile and quantify layout conversions and copies.
2. Trace tensor layouts across producer-consumer chains.
3. Identify mandatory versus compiler-induced conversions.
4. Propagate profitable layouts through compatible operations.
5. Compare alternative layout assignments across larger subgraphs.
6. Avoid materialization for reshape/transpose views when legal.
7. Fuse conversion with adjacent compute when supported.
8. Check alignment, vectorization, and accelerator-specific constraints.
9. Preserve aliasing and mutation semantics.
10. Benchmark end-to-end, not only individual kernels.
11. Add regression tests for layout legality and performance-sensitive cases.

## Decision points
Choose backend-preferred layouts when savings exceed conversion costs. Preserve framework-native layouts when interoperability dominates. Materialize views only when required by consumers or when doing so enables larger gains.

## Common failure patterns
Local layout optimization that increases global copies, incorrect stride assumptions, hidden host-device transfers, materializing cheap views, and layout rewrites that break aliasing.

## Verification
Inspect generated IR/code for conversion count, profile transferred bytes and latency, run correctness tests with non-contiguous tensors, and compare end-to-end benchmarks.

## Expected output
A layout strategy or optimization with measured reduction in data movement and preserved semantics.

## Stop conditions
Stop if aliasing semantics are unclear, target layout requirements conflict irreconcilably, or performance evidence does not justify added complexity.