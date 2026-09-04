# Vectorization and Tensorization

## Purpose
Map scalar or generic tensor computations onto SIMD/vector units and accelerator tensor/matrix instructions while preserving legality and numerical behavior.

## When to use
Use when optimizing compute-bound kernels, enabling new ISA features, or investigating poor hardware utilization.

## Inputs
Loop/tensor IR, target ISA, alignment guarantees, shapes, dtypes, reduction semantics, profile data.

## Context to inspect
Inspect iteration spaces, dependencies, memory strides, alignment, tail handling, reductions, masking, fast-math flags, and target instruction constraints.

## Core knowledge
Vectorization requires dependence legality and profitable access patterns. Tensorization additionally requires matching higher-level compute fragments to hardware-supported matrix/tensor instructions with compatible tile shapes and dtypes.

## Procedure
1. Identify hot compute regions and arithmetic intensity.
2. Analyze loop-carried dependencies and memory access patterns.
3. Choose vector/tensor dimensions with contiguous or coalesced access when possible.
4. Select widths or tile shapes supported by the target.
5. Handle remainders through masking, peeling, or scalar fallbacks.
6. Preserve exact reduction order unless relaxed numerics are explicitly allowed.
7. Insert layout transformations only when their cost is justified.
8. Lower recognized patterns to target intrinsics/instructions.
9. Inspect generated assembly or backend IR.
10. Benchmark multiple representative shapes.
11. Add legality and numerical regression tests.

## Decision points
Use wider vectors only when alignment, register pressure, and tails remain favorable. Tensorize when problem dimensions and precision align with accelerator instructions; retain generic vector paths for unsupported cases.

## Common failure patterns
Unprofitable gather/scatter vectorization, excessive tail overhead, register spills, illegal reordering of reductions, misalignment assumptions, and tensorization requiring costly layout conversions.

## Verification
Check generated target instructions, run differential numerical tests, measure utilization and throughput, and confirm edge shapes use correct fallbacks.

## Expected output
A legal vectorization/tensorization transformation with target evidence and measured performance gains.

## Stop conditions
Stop if dependence analysis cannot prove legality, target precision changes exceed accepted tolerance, or data-layout costs erase the compute benefit.