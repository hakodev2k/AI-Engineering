# GPU Compiler, PTX, and Machine-Code Analysis

## Purpose
Use compiler diagnostics and generated intermediate/machine code to explain performance or correctness behavior that source inspection cannot resolve.

## When to use
Use for register spills, unexpected instructions, failed vectorization, architecture-specific regressions, or compiler-sensitive kernels.

## Inputs
Source, compiler version/flags, target architecture, PTX/intermediate representation, disassembly, profiler evidence, benchmark.

## Preconditions
Reproduce the issue with a minimal relevant kernel and preserve a correctness baseline.

## Context to inspect
Inspect optimization flags, architecture targets, inlining, register counts, local-memory accesses, instruction selection, memory spaces, predicates, barriers, tensor/matrix instructions, and fast-math transformations.

## Core knowledge
Intermediate code is not final hardware execution. Backend compilation, scheduling, register allocation, and architecture affect generated machine code. Source-level elegance does not guarantee efficient instructions; disassembly should answer a measured question.

## Procedure
1. Identify a profiler symptom requiring lower-level explanation.
2. Record compiler/toolchain and target flags.
3. Capture compiler resource diagnostics.
4. Inspect intermediate code for memory spaces and transformations.
5. Inspect final machine code around hot paths.
6. Correlate instructions with profiler counters and source.
7. Test a narrowly scoped source or flag change.
8. Compare resource use and generated code.
9. Benchmark end to end.
10. Document architecture/toolchain dependencies.

## Decision points
Inspect machine code only after profiling points to instruction/resource issues. Use architecture-specific intrinsics when measurable gains justify portability and maintenance costs.

## Common failure patterns
Treating PTX as final code, forcing register caps that create spills, enabling fast math without numerical review, comparing disassembly from different targets, and hand-tuning code that the compiler already optimizes better.

## Verification
Verify correctness, resource diagnostics, expected instruction changes, profiler counters, and stable benchmark gains across supported toolchains/hardware.

## Expected output
A source-to-machine-code causal explanation and a verified, maintainable optimization when justified.

## Stop conditions
Stop when the compiler artifact does not correspond to the measured binary, symbols/toolchain information is missing, or architecture-specific changes violate portability requirements.