# Call Graph Construction

## Purpose
Construct call graphs that approximate possible caller-callee relationships for interprocedural analysis.

## When to use
Use for impact analysis, taint tracking, dead-code analysis, security scanning, effect propagation, and whole-program reasoning.

## Inputs
IR, type hierarchy, symbol resolution, dynamic-dispatch semantics, reflection/native boundaries, and dependency metadata.

## Preconditions
Define whether the graph targets sound over-approximation, practical precision, or rapid IDE feedback.

## Context to inspect
Direct calls, virtual/interface calls, callbacks, function values, reflection, dependency injection, generated code, and native interfaces.

## Core knowledge
CHA/RTA are cheap but imprecise; points-to-driven graphs improve precision at cost. Dynamic features often require conservative edges or framework summaries.

## Procedure
1. Enumerate direct calls.
2. Model dispatch rules and reachable types.
3. Add indirect-call resolution using the chosen precision level.
4. Incorporate callbacks and framework entry points.
5. Add conservative handling for opaque boundaries.
6. Remove impossible edges only with justified evidence.
7. Track provenance for every inferred edge.
8. Incrementally invalidate affected graph regions.
9. Benchmark graph size and construction time.

## Decision points
Use simpler graph algorithms for broad fast scans; use points-to/context-sensitive construction when downstream precision justifies cost.

## Common failure patterns
Missing framework callbacks, unsound reflection handling, assuming dependency injection has one target, and retaining stale edges after edits.

## Verification
Compare against runtime traces on representative tests, known dispatch cases, and manually reviewed call sites.

## Expected output
A queryable call graph with provenance, scope, precision guarantees, and performance metrics.

## Stop conditions
Stop when dynamic behavior cannot be bounded sufficiently for the stated correctness claim.