# Debug Information

## Purpose
Generate trustworthy source-level debug information so optimized programs remain inspectable with platform debuggers and profilers.

## When to use
Use for new language constructs, backend transforms, debug stepping bugs, missing variables, or target ports.

## Inputs
Source spans, IR transformations, debug format, target ABI/object format, debugger behavior.

## Context to inspect
Location metadata, lexical scopes, variable locations, inlining records, line tables, DWARF/CodeView emission, optimization handling.

## Core knowledge
Optimization changes value location and source correspondence. Debug metadata must degrade gracefully rather than claim false locations. Inlining and variable lifetime require explicit tracking.

## Procedure
1. Define user-visible source entities and scopes.
2. Preserve source locations through lowering.
3. Track variable/value locations across transformations.
4. Emit line, scope, type, and inlining records.
5. Mark optimized-out values honestly.
6. Validate format/object integration.
7. Test breakpoints, stepping, stack traces, and variable inspection.
8. Repeat at multiple optimization levels.

## Decision points
Prefer accurate partial information over complete but misleading information. Retain metadata through transforms only when semantics remain valid.

## Common failure patterns
Stale locations after code motion, incorrect lexical scopes, broken inline stacks, variables appearing live after death, line tables pointing to synthetic instructions.

## Verification
Debugger integration tests, binary metadata inspection, optimized/unoptimized comparisons, profiler symbolization tests.

## Expected output
Accurate debug behavior with known limitations documented and tested.

## Stop conditions
Stop if source semantics or target debug-format capabilities cannot represent the requested behavior reliably.