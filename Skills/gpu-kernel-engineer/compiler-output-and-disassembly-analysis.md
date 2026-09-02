# Compiler Output and Disassembly Analysis

## Purpose
Use compiler reports and generated GPU assembly/ISA to verify that source-level intent becomes efficient machine execution.

## When to use
Use when source changes have unexpected performance, vectorization or matrix instructions are missing, register usage is surprising, or compiler upgrades change behavior.

## Inputs
Kernel source, compiler flags, intermediate representation where available, generated assembly/ISA, resource reports, and profiler data.

## Context to inspect
Instruction mix, register allocation, spills, predication, memory instructions, instruction width, matrix instructions, barriers, address arithmetic, and optimization diagnostics.

## Core knowledge
High-level GPU code can compile very differently from its appearance. Compiler transformations may remove, duplicate, unroll, vectorize, scalarize, or spill work. Disassembly should be interpreted together with performance counters and architecture semantics, not used as an isolated optimization target.

## Procedure
1. Capture the exact compiler version, target architecture, and flags.
2. Generate optimization reports and device assembly/ISA.
3. Locate the hot source region in generated code.
4. Check whether expected memory, arithmetic, subgroup, or matrix instructions appear.
5. Inspect register count, spill instructions, branch structure, and barriers.
6. Compare instruction sequences before and after a source change.
7. Form a hypothesis about the observed performance effect.
8. Validate the hypothesis with profiler counters and timing.
9. Avoid source tricks that depend on unstable undocumented compiler behavior unless guarded and justified.
10. Record compiler-version sensitivity for production builds.

## Decision points
Prefer readable source when generated code is already efficient. Use lower-level intrinsics or architecture-specific code only when compiler output proves a material gap and maintenance cost is acceptable.

## Common failure patterns
Counting instructions without considering latency/throughput; assuming fewer instructions are always faster; forcing inline assembly prematurely; missing spills; and comparing binaries built with different flags.

## Verification
Confirm generated code, resource usage, runtime, and numerical results on the supported compiler/toolchain matrix.

## Expected output
A source-to-machine-code explanation and a justified optimization or no-change decision.

## Stop conditions
Stop when ISA semantics are undocumented for a required claim or binary generation cannot be reproduced from the project toolchain.