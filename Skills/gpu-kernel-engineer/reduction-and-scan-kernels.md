# Reduction and Scan Kernels

## Purpose
Design efficient parallel reductions and prefix scans with correct synchronization, stable numerical behavior, and scalable work decomposition.

## When to use
Use for sums, maxima, norms, histograms, prefix sums, compaction offsets, and other associative aggregation patterns.

## Inputs
Operation semantics, data type, input size distribution, numerical requirements, target GPU, and performance baseline.

## Context to inspect
Associativity, identity element, precision requirements, subgroup primitives, shared-memory use, global synchronization boundaries, and output ordering.

## Core knowledge
Parallel reductions restructure operation order and may change floating-point results. Efficient designs usually combine per-thread accumulation, subgroup reduction, block aggregation, and one or more global stages. Scans require careful treatment of inclusive/exclusive semantics and block-prefix propagation.

## Procedure
1. Define the operator, identity, and numerical tolerance.
2. Decide whether operation reordering is semantically acceptable.
3. Partition input so each thread performs useful sequential work.
4. Reduce within subgroups using safe lane primitives when available.
5. Aggregate subgroup results with shared memory or another appropriate mechanism.
6. For scans, define local scan and block-prefix propagation explicitly.
7. Minimize global synchronization by using staged kernels or supported cooperative primitives.
8. Handle non-power-of-two and small inputs correctly.
9. Benchmark against library and baseline implementations.
10. Validate determinism and numerical error requirements.

## Decision points
Use vendor/library primitives when they meet requirements; custom kernels are justified for fusion, unusual operators, layouts, or latency constraints. Choose compensated or higher-precision accumulation when error dominates throughput concerns.

## Common failure patterns
Assuming floating-point associativity; unsafe warp-tail logic; unnecessary global atomics; excessive synchronization; and ignoring small-input overhead.

## Verification
Compare against a trusted reference across random, adversarial, small, large, and odd-sized inputs; measure throughput and numerical error.

## Expected output
A correct reduction/scan design with numerical and performance evidence.

## Stop conditions
Stop when operator semantics are not associative enough for the intended transformation or required determinism is unresolved.