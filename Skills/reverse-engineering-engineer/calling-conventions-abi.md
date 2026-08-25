# Calling Conventions and ABI Recovery

## Purpose
Recover function interfaces, argument locations, return values, stack ownership, register preservation, and binary interface assumptions.

## When to use
Use when reconstructing function signatures, interfacing with unknown libraries, understanding cross-module calls, or correcting decompiler output.

## Inputs
Disassembly, architecture, platform ABI documentation, call sites, symbols/debug metadata when available.

## Preconditions
Know the target architecture and distinguish platform ABI rules from compiler-specific conventions.

## Context to inspect
Callers, callees, prologues/epilogues, register use, stack offsets, variadic patterns, structure returns, exception/unwind metadata, vtables, and imported API prototypes.

## Core knowledge
An ABI defines more than argument registers: alignment, aggregate layout, return conventions, preserved registers, TLS, exceptions, name mangling, and interoperability matter. Optimized functions may omit canonical frames.

## Procedure
1. Identify the baseline platform ABI.
2. Inspect several callers and the callee before assigning a signature.
3. Track argument definitions to uses and return definitions to consumers.
4. Determine stack cleanup and preserved registers.
5. Infer scalar, pointer, aggregate, floating-point, and variadic arguments.
6. Detect hidden parameters such as `this`, context, or structure-return pointers.
7. Apply prototypes to improve decompilation and repeat until call sites agree.
8. Record deviations that suggest custom conventions or generated stubs.

## Decision points
Trust documented imported APIs strongly; treat inferred internal prototypes as hypotheses. Prefer a conservative unknown type over an over-specific type unsupported by use sites.

## Common failure patterns
Inferring from one call site; confusing values surviving a call with arguments; missing hidden parameters; assuming frame pointers; ignoring vector registers and alignment.

## Verification
A recovered signature should explain all observed call sites, preserve stack/register invariants, and improve rather than degrade decompiler consistency.

## Expected output
Annotated function prototypes and ABI notes with confidence and evidence.

## Stop conditions
Stop if insufficient call-site evidence exists or runtime-generated calling stubs make a static signature unreliable; gather traces instead.