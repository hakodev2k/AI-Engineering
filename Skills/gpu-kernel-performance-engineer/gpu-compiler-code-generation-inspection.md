# GPU Compiler and Code Generation Inspection

## Purpose
Use compiler reports and generated GPU instructions to verify that source-level intent becomes efficient machine code and to diagnose optimization blockers hidden by high-level syntax.

## When to use
Use when performance changes across compiler versions or flags, expected vector/matrix instructions are absent, register use is surprising, or source-level optimization does not affect runtime.

## Inputs
Kernel source, compiler flags, optimization reports, intermediate representation, assembly/SASS/ISA output, resource usage, target architecture, benchmark results.

## Preconditions
Keep compiler version and target architecture explicit. Maintain a correct baseline before experimenting with aggressive flags or source rewrites.

## Context to inspect
Inspect inlining, unrolling, predication, memory instructions, vectorization, matrix instructions, conversion instructions, register allocation, spills, address arithmetic, synchronization, and dead-code elimination.

## Core knowledge
GPU compilers transform source aggressively, so source complexity is not a reliable proxy for instruction cost. Generated code must be interpreted alongside profiler evidence; fewer instructions are not always faster if latency, occupancy, or memory behavior worsens.

## Procedure
1. Record compiler version, flags, architecture target, and baseline runtime.
2. Generate optimization/resource reports and low-level code.
3. Locate the hot source region using profiler correlation when available.
4. Verify expected instruction classes are emitted.
5. Identify unexpected spills, conversions, wide address arithmetic, branches, or missed constant folding.
6. Change one source construct or compiler option at a time.
7. Recompile and diff resource counts and generated instructions.
8. Benchmark under identical conditions.
9. Test multiple representative architectures if the binary is portable.
10. Pin or document compiler assumptions that materially affect performance.

## Decision points
Prefer source changes that remain readable and stable across compilers. Use architecture-specific intrinsics when they unlock material gains and portability policy permits. Avoid undocumented flags in production unless their behavior is understood and tested.

## Common failure patterns
Counting instructions without measuring latency; enabling fast-math globally; relying on accidental compiler behavior; ignoring target-architecture flags; misreading spill or local-memory reports; optimizing debug builds.

## Verification
Confirm generated code changes as intended, resource usage remains acceptable, runtime improves, numerical behavior passes, and results are stable across supported compiler/device combinations.

## Expected output
A code-generation diagnosis with relevant instruction/resource evidence and a measured source or build change.

## Stop conditions
Escalate when compiler output appears incorrect, behavior changes across supported toolchains without a safe workaround, or required optimization depends on unsupported compiler internals.