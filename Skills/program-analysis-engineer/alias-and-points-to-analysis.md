# Alias and Points-to Analysis

## Purpose
Estimate which references may identify the same memory locations so downstream analyses can reason about mutation, side effects, escape, and data propagation.

## When to use
Use for nullness, taint, race detection, optimization, effect analysis, escape analysis, and interprocedural reasoning over heap-manipulating code.

## Inputs
IR, allocation sites, pointer/reference operations, calls, object model, and precision budget.

## Preconditions
Define the language memory model and whether the analysis must be sound across reflection, native code, dynamic dispatch, and unsafe features.

## Context to inspect
Allocations, field accesses, assignments, calls, closures, globals, arrays, casts, reflection, and native boundaries.

## Core knowledge
Flow, context, field, and heap sensitivity trade precision for cost. Andersen-style inclusion constraints are precise but expensive; Steensgaard-style unification scales better with lower precision. Unknown calls require conservative summaries.

## Procedure
1. Define abstract memory locations.
2. Choose flow/context/field sensitivity.
3. Generate constraints from allocations and reference operations.
4. Model calls and returns.
5. Summarize libraries and opaque boundaries.
6. Solve to a fixed point.
7. Expose may-alias and points-to queries.
8. Cache results with explicit invalidation.
9. Measure solution size and query latency.
10. Evaluate precision on downstream findings.

## Decision points
Increase sensitivity only when alias imprecision materially harms downstream value. Use summaries for libraries rather than repeatedly analyzing stable dependencies.

## Common failure patterns
Unsound native/reflection handling, conflating must-alias with may-alias, explosive context sensitivity, stale summaries, and ignoring allocation-site merging effects.

## Verification
Test canonical alias patterns, compare with runtime instrumentation on bounded examples, and validate downstream false-positive reductions.

## Expected output
A documented alias model with query APIs, precision guarantees, and scalability measurements.

## Stop conditions
Stop when required dynamic features cannot be modeled within the stated soundness scope or memory/time exceeds agreed budgets.