# Nullness Analysis

## Purpose
Detect potential null dereferences and prove non-null states where justified without overwhelming developers with conservative noise.

## When to use
Use for nullable-reference enforcement, migration of legacy code, API contract checking, and bug finding in pointer/reference-heavy systems.

## Inputs
Type annotations, CFG, assignments, calls, assertions, contracts, and framework/library models.

## Preconditions
Define language null semantics and how unknown external APIs are modeled.

## Context to inspect
Initialization, conditionals, field access, aliases, constructors, callbacks, exceptions, generics, optional values, and generated code.

## Core knowledge
Nullness usually forms a small abstract domain such as null/non-null/maybe/unknown. Flow sensitivity and branch refinement provide substantial precision; heap mutation and aliases complicate field facts.

## Procedure
1. Define nullness states and annotation semantics.
2. Seed facts from literals, types, contracts, and constructors.
3. Refine facts on null checks and assertions.
4. Propagate assignments and return values.
5. Invalidate heap facts after possible mutation.
6. Model common library contracts.
7. Handle exceptional and asynchronous paths.
8. Report dereferences only when a feasible maybe/null state reaches them.
9. Preserve evidence showing the source of uncertainty.
10. Track false-positive causes and improve models selectively.

## Decision points
Trust annotations only according to configured contract confidence. Prefer conservative invalidation over unsound field stability, but add immutability/ownership reasoning when precision matters.

## Common failure patterns
Trusting incorrect annotations blindly, retaining stale field facts across calls, missing constructor initialization paths, and treating unknown as definitely null.

## Verification
Use positive/negative fixtures, annotation contradictions, alias mutations, and real defect regressions.

## Expected output
Traceable nullness findings and proven non-null facts with stated assumptions.

## Stop conditions
Stop when external contracts are too unreliable for the intended guarantee or unsupported language features dominate results.