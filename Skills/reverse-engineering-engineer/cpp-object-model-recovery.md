# C++ Object Model Recovery

## Purpose
Recover C++ classes, inheritance, virtual dispatch, RTTI, constructors, destructors, and exception-related object behavior from binaries.

## When to use
Use when a target contains C++ compiler artifacts or indirect calls appear to originate from object vtables.

## Inputs
Binary, compiler/ABI clues, vtable candidates, RTTI, mangled names, constructors/destructors, call sites.

## Preconditions
Identify likely compiler family and platform ABI because object layout and metadata differ.

## Context to inspect
Vptr writes, vtables, typeinfo, adjustor thunks, this-pointer adjustments, allocation/deallocation, constructor chains, virtual bases, exception tables, and mangled symbols.

## Core knowledge
C++ source abstractions are transformed aggressively. Multiple inheritance, virtual inheritance, covariant returns, COM-like interfaces, and stripped RTTI require evidence from layout and call behavior.

## Procedure
1. Locate candidate vtables from read-only pointer arrays and xrefs.
2. Find vptr stores in constructors/destructors.
3. Recover virtual method slots and associated call sites.
4. Identify `this` adjustments and secondary vtables.
5. Use RTTI/mangled names when available but validate against code.
6. Map base/derived construction and destruction order.
7. Recover fields around known vptr offsets.
8. Build class hierarchy hypotheses and apply types.
9. Validate virtual dispatch and object sizes across several paths.

## Decision points
Use RTTI as high-value metadata, not infallible truth. Where RTTI is absent, prefer conservative interface groupings until constructor and pointer-adjustment evidence supports inheritance.

## Common failure patterns
Assuming one vtable per class; missing secondary bases; confusing function-pointer tables with vtables; overlooking deleting destructors; applying MSVC rules to Itanium ABI binaries.

## Verification
Hierarchy should explain vptr initialization, method slot use, pointer adjustments, allocation sizes, and destructor chains.

## Expected output
A documented class/interface model with recovered methods, layouts, hierarchy, and confidence.

## Stop conditions
Stop when compiler-specific metadata cannot be identified and available evidence cannot distinguish composition from inheritance.