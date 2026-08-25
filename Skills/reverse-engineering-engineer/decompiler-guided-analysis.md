# Decompiler-Guided Analysis

## Purpose
Use decompiler output as a productivity aid while systematically correcting types, signatures, variables, and control flow so conclusions remain grounded in machine code.

## When to use
Use for medium-to-large native binaries where raw assembly alone would be inefficient.

## Inputs
Binary, disassembly, decompiler output, ABI knowledge, symbols or related source when available.

## Preconditions
Treat pseudocode as a reconstruction, never as original source.

## Context to inspect
Underlying instructions, xrefs, call sites, inferred types, stack variables, globals, switch recovery, exception flow, optimizer artifacts, and decompiler warnings.

## Core knowledge
Decompiler quality depends heavily on correct function boundaries, prototypes, calling conventions, and types. Optimization destroys source-level constructs and may merge variables or eliminate branches.

## Procedure
1. Validate function boundaries and calling convention.
2. Compare key pseudocode statements with underlying instructions.
3. Correct imported and known library prototypes first.
4. Infer data types from use patterns, widths, offsets, and call contracts.
5. Rename functions and variables by observed semantics, not guesses.
6. Recover structures and enums incrementally.
7. Re-run analysis after high-confidence type corrections.
8. Trace critical conditions and side effects back to assembly.
9. Mark unresolved expressions and optimizer artifacts explicitly.

## Decision points
Use pseudocode for navigation and semantic compression; switch to assembly for flags, integer widths, aliasing, atomics, unusual control flow, security-sensitive checks, or apparent decompiler contradictions.

## Common failure patterns
Copying pseudocode as truth; assigning speculative names that bias later analysis; missing signedness; ignoring undefined behavior/compiler transformations; overlooking hidden side effects.

## Verification
Critical claims must be reproducible from instructions, data references, or runtime observations. Confirm corrected types explain multiple use sites.

## Expected output
Readable, annotated pseudocode backed by validated low-level evidence and explicit confidence boundaries.

## Stop conditions
Stop relying on the decompiler when it reports irreducible failures, unsupported instructions, incorrect stack modeling, or semantics inconsistent with runtime evidence.