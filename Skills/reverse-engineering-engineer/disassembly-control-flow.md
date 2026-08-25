# Disassembly and Control Flow

## Purpose
Recover trustworthy instruction boundaries, functions, branches, and control-flow structure from native machine code.

## When to use
Use when source is unavailable and behavior must be understood from compiled native code.

## Inputs
Binary, architecture/ISA, ABI, loader mapping, symbols if available, disassembler output.

## Preconditions
Confirm the correct instruction set, execution mode, endianness, and load addresses.

## Context to inspect
Entry points, code sections, exception/unwind metadata, relocations, symbols, cross-references, jump tables, indirect branches, alignment, and embedded data.

## Core knowledge
Disassembly is inference. Variable-length ISAs, mixed code/data, indirect control flow, tail calls, thunks, hand-written assembly, and obfuscation can invalidate linear assumptions. Calling conventions and compiler idioms help recover boundaries.

## Procedure
1. Seed analysis from trusted entry points and symbols.
2. Follow reachable direct control flow recursively.
3. Identify prologues, epilogues, tail calls, thunks, and non-returning functions.
4. Resolve jump tables and indirect branches using data-flow evidence.
5. Separate code from embedded constants and tables.
6. Build function-level CFGs and cross-reference maps.
7. Annotate uncertain boundaries instead of forcing classifications.
8. Compare suspicious regions with raw bytes and alternate disassembly modes.
9. Propagate corrected function signatures and calling conventions.

## Decision points
Prefer recursive traversal for ordinary compiler output; use linear sweep only as supporting evidence. For indirect flow, combine static value analysis with controlled runtime traces when necessary.

## Common failure patterns
Wrong architecture mode; treating data as instructions; missing tail calls; assuming every call returns; ignoring exception edges; accepting auto-analysis without validation.

## Verification
Check stack balance, branch targets, xrefs, and debugger traces for representative paths. Re-disassemble uncertain regions with an independent engine.

## Expected output
A defensible set of function boundaries, CFGs, call relationships, and annotated uncertainties suitable for higher-level semantic recovery.

## Stop conditions
Stop and reassess when control-flow recovery depends on unresolved self-modifying code, runtime decryption, or missing architecture information.