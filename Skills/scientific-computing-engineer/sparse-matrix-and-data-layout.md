# Sparse Matrix and Data Layout

## Purpose
Choose sparse representations and memory layouts that preserve algorithmic correctness while improving locality, storage efficiency, and solver performance.

## When to use
Use for large sparse operators, graphs, finite-element assemblies, iterative solvers, or when memory bandwidth and allocation dominate runtime.

## Inputs
Sparsity pattern, matrix operations, dimensions, assembly behavior, solver requirements, hardware, and memory budget.

## Context to inspect
CSR/CSC/block formats, index widths, ordering, duplicate entries, zero handling, matrix assembly, cache behavior, and accelerator-library constraints.

## Core knowledge
Sparse format choice depends on access pattern, structural regularity, mutation frequency, and target hardware. Storage savings can be offset by indirection, poor locality, or conversion overhead.

## Procedure
1. Measure matrix size, density, block structure, and operation mix.
2. Identify assembly versus solve/update phases.
3. Select candidate sparse formats.
4. Choose index precision consistent with maximum problem size.
5. Define duplicate and structural-zero semantics.
6. Consider ordering for locality and factorization fill.
7. Benchmark core operations on representative patterns.
8. Measure conversion and assembly cost, not only solve cost.
9. Validate compatibility with chosen solver libraries.
10. Document format invariants and ownership rules.

## Decision points
Use CSR for row-oriented sparse operations; CSC for column-oriented workflows; block formats when repeated dense structure is real and stable. Keep mutable assembly formats separate from optimized compute formats when beneficial.

## Common failure patterns
Using one format for every phase, unnecessary 64-bit indices, repeated format conversions, unsorted duplicates, and optimizing synthetic sparsity patterns that do not match production.

## Verification
Compare numerical results across formats, measure memory and end-to-end time, and test largest supported dimensions.

## Expected output
A data-layout decision with measured memory/performance characteristics and documented invariants.

## Stop conditions
Stop when actual sparsity patterns or operation profiles are unavailable and format choice would be speculative.