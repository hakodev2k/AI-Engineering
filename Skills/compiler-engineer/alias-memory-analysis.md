# Alias and Memory Analysis

## Purpose
Reason conservatively about memory locations and side effects so optimizations can reorder, eliminate, or combine memory operations safely.

## When to use
Use for load/store optimization, vectorization, scheduling, escape analysis, or memory-related miscompilations.

## Inputs
IR memory model, pointer/reference semantics, call effects, target memory rules, failing optimization case.

## Context to inspect
Alias analysis stack, provenance rules, address spaces, volatile/atomic semantics, call summaries, lifetime markers, escape information.

## Core knowledge
Alias analysis must be conservative: false aliases cost performance; missed aliases cause miscompilation. Volatile, atomics, concurrency, provenance, and foreign calls constrain transformations.

## Procedure
1. Classify memory objects and address derivations.
2. Define may-alias/no-alias/must-alias queries required.
3. Model calls and unknown code conservatively.
4. Respect volatile, atomic, and ordering semantics.
5. Use provenance/lifetime facts only when guaranteed by IR semantics.
6. Layer cheap analyses before expensive refinements.
7. Add aliasing and near-aliasing tests.
8. Differential-test consuming optimizations.

## Decision points
Prefer conservative unknown results over speculative no-alias. Add precision only where profiles/benchmarks show material optimization loss.

## Common failure patterns
Assuming distinct syntax means distinct storage, ignoring integer-pointer casts, mishandling overlapping ranges, treating readonly as no-alias, ignoring concurrency.

## Verification
Run memory stress tests, sanitizer suites, differential execution, and benchmarks demonstrating precision benefit.

## Expected output
A conservative memory model/analysis with explicit assumptions and consumer tests.

## Stop conditions
Escalate when language/IR pointer provenance or concurrency semantics are undefined.