# Compiler Idiom Recognition

## Purpose
Recognize compiler-generated patterns so analysis focuses on source-level semantics rather than repeatedly reverse engineering standard lowering strategies.

## When to use
Use when optimized machine code obscures loops, switches, arithmetic, object lifetime, runtime checks, or library operations.

## Inputs
Disassembly, compiler/platform clues, optimization level hints, known library implementations, multiple call sites.

## Preconditions
Treat compiler attribution as probabilistic unless build metadata or symbols confirm it.

## Context to inspect
Prologues, stack cookies, switch tables, memcpy/memset patterns, integer division transforms, vectorization, tail calls, inlining, exception handling, TLS, runtime helper calls, and security instrumentation.

## Core knowledge
Compilers transform equivalent source differently by version, flags, target CPU, LTO, and profile guidance. Idioms are evidence for semantics, not exact original syntax.

## Procedure
1. Identify compiler/runtime clues from metadata and imports.
2. Classify suspicious instruction sequences by common lowering patterns.
3. Separate runtime scaffolding from application logic.
4. Recognize strength reduction, constant multiplication/division, vector loops, and branchless selection.
5. Identify switch dispatch and bounds-check patterns.
6. Map security/runtime helpers to their semantic purpose.
7. Compare against small locally compiled reference examples when permitted.
8. Annotate the semantic operation while preserving uncertainty about source syntax.

## Decision points
Use pattern recognition to accelerate analysis, but return to instruction-level reasoning when integer width, overflow, flags, or security checks matter.

## Common failure patterns
Assuming exact source reconstruction; misidentifying hand-written assembly; ignoring compiler version differences; treating optimized undefined behavior as intended logic.

## Verification
The proposed idiom must account for inputs, outputs, side effects, and control flow. Validate with independent references or runtime tests for critical cases.

## Expected output
Semantic annotations that remove compiler noise and improve downstream pseudocode accuracy.

## Stop conditions
Stop assigning an idiom when multiple transformations fit equally well and the distinction matters to the investigation.