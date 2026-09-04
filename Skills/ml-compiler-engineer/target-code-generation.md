# Target Code Generation

## Purpose
Lower optimized ML IR into correct and efficient target-specific code for CPUs, GPUs, NPUs, or custom accelerators.

## When to use
Use when adding a backend, implementing instruction selection, fixing backend miscompilations, or improving generated code quality.

## Inputs
Lowered IR, target ISA/backend APIs, ABI, calling convention, memory spaces, supported dtypes, hardware constraints.

## Context to inspect
Inspect instruction selection, register/address spaces, synchronization, launch configuration, ABI boundaries, constants, alignment, and backend diagnostics.

## Core knowledge
Code generation must preserve IR semantics while respecting target constraints. Performance depends on instruction choice, scheduling, memory behavior, occupancy, and ABI overhead.

## Procedure
1. Define the legal input IR for the backend.
2. Map operations and types to target constructs.
3. Encode memory spaces, addressing, and alignment.
4. Select instructions/intrinsics based on target capabilities.
5. Emit synchronization and barriers only where required.
6. Respect ABI and calling conventions.
7. Generate launch or execution metadata.
8. Preserve source/IR locations for diagnostics.
9. Inspect generated target IR or assembly.
10. Test unsupported cases fail explicitly.
11. Benchmark representative kernels and end-to-end models.

## Decision points
Use native target intrinsics for stable high-value patterns; retain generic lowering for portability. Specialize only when capability checks and fallback paths are robust.

## Common failure patterns
ABI mismatches, incorrect address spaces, missing barriers, unsupported dtype assumptions, register spills, invalid launch dimensions, and silent fallback to slow code.

## Verification
Run differential tests, backend validation tools, assembly inspection, sanitizer/debug modes where available, and target benchmarks.

## Expected output
A validated backend lowering path or codegen fix with correctness evidence, generated-code inspection, and performance results.

## Stop conditions
Stop if target ABI is unknown, hardware capability cannot be detected safely, or required semantics cannot be represented by the backend.