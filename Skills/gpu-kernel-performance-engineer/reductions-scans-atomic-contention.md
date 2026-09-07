# Reductions, Scans, and Atomic Contention

## Purpose
Implement and optimize collective aggregation patterns such as reductions, prefix scans, histograms, and concurrent accumulations without creating unnecessary serialization or numerical instability.

## When to use
Use when a kernel performs sums, extrema, counters, histograms, prefix operations, or many-thread updates to shared destinations.

## Inputs
Operation semantics, associativity requirements, data size, contention pattern, precision requirements, target architecture, profiler atomic and synchronization metrics.

## Preconditions
Determine whether the operation is associative/commutative in exact or floating-point arithmetic and whether deterministic results are required.

## Context to inspect
Inspect subgroup shuffle primitives, shared-memory trees, hierarchical reduction, global atomics, contention hotspots, output cardinality, block size, precision, and launch count.

## Core knowledge
Hierarchical aggregation usually reduces global contention: combine values within lanes/subgroups and blocks before issuing fewer global updates. Floating-point reassociation changes rounding. Atomic throughput varies significantly by operation, type, address distribution, and architecture.

## Procedure
1. Define required numerical and determinism semantics.
2. Measure baseline atomic or collective cost.
3. Determine contention per destination.
4. Aggregate at the narrowest useful scope: lane, subgroup, then block/workgroup.
5. Use shared memory only when it beats shuffle/register exchange for the pattern.
6. Reduce global atomics by emitting partial results.
7. Select tree, scan, or segmented algorithm appropriate to data shape.
8. Handle tails and inactive lanes explicitly.
9. Benchmark varying input sizes and contention distributions.
10. Compare numerical error and reproducibility with the baseline.

## Decision points
Use atomics directly when contention is low and simplicity wins. Use hierarchical reduction when many lanes target few outputs. Choose deterministic staged reductions when reproducibility is a product requirement despite extra cost.

## Common failure patterns
One global atomic per element; assuming floating-point addition is associative; barriers inside every reduction step; shared-memory reduction where warp shuffles suffice; optimizing uniform contention while production is skewed.

## Verification
Confirm correctness for empty, small, tail, and large inputs; measure atomic transactions and runtime; validate numerical tolerances and deterministic behavior where required.

## Expected output
A contention-aware collective design with correctness semantics and measured performance evidence.

## Stop conditions
Escalate when required determinism conflicts with throughput targets, atomic support is missing for the type, or the aggregation algorithm must change at a higher architectural layer.