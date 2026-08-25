# Data Structure Recovery

## Purpose
Reconstruct structs, classes, arrays, enums, object relationships, and memory layouts from compiled code.

## When to use
Use when unknown memory objects dominate program semantics or when better types are needed to improve decompilation.

## Inputs
Disassembly/decompilation, memory traces, field offsets, allocation sizes, constructors/destructors, symbols when available.

## Preconditions
Establish pointer width, ABI alignment, endianness, and relevant object model.

## Context to inspect
Repeated base+offset accesses, allocation sizes, initialization patterns, copy loops, vtables, RTTI, serialization code, bounds checks, and API contracts.

## Core knowledge
Field width, alignment, padding, inheritance, unions, bitfields, flexible arrays, and compiler optimizations complicate layout recovery. A single offset may have different interpretations under unions or aliasing.

## Procedure
1. Group accesses by candidate object base.
2. Record offset, width, read/write direction, and use semantics.
3. Infer minimum object size from allocations and maximum accesses.
4. Identify pointer-like, scalar, flag, length, and nested-object fields.
5. Correlate initialization and destruction behavior.
6. Detect arrays from stride patterns and loops.
7. Recover vtables/RTTI or serialization schemas where present.
8. Build conservative type definitions and apply them broadly.
9. Refine only when multiple independent observations agree.

## Decision points
Model uncertain overlap as union/unknown bytes rather than forcing fields. Distinguish inheritance from composition using constructor adjustment, vptr placement, and pointer arithmetic.

## Common failure patterns
Overfitting one function; ignoring padding; wrong signedness; treating transient stack layouts as stable objects; assuming C++ layout rules across compilers.

## Verification
Recovered types should explain allocation sizes, all observed offsets, call-site expectations, and representative runtime memory without overlap contradictions.

## Expected output
Reusable type definitions with field evidence and confidence annotations.

## Stop conditions
Stop refinement when evidence is insufficient to distinguish plausible layouts or when runtime instrumentation is required to validate aliasing.