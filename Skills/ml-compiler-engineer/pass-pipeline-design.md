# Pass Pipeline Design

## Purpose
Design deterministic, maintainable compiler pass pipelines whose transformations have explicit preconditions, postconditions, and ordering rationale.

## When to use
Use when introducing optimization passes, reordering pipelines, investigating phase-ordering bugs, or stabilizing backend compilation.

## Inputs
IR levels, pass inventory, invariants, target constraints, compile-time budget, optimization goals, failing examples.

## Context to inspect
Inspect pass dependencies, canonicalization points, analysis invalidation, legality transitions, fixed-point loops, diagnostics, and target-specific branches.

## Core knowledge
Pass ordering is part of compiler behavior. Each pass should consume documented invariants and produce documented invariants. Repeated canonicalization can help convergence but can also inflate compile time or hide poor phase boundaries.

## Procedure
1. List pipeline stages and semantic level at each boundary.
2. Document preconditions and postconditions for every major pass.
3. Identify ordering dependencies and make them explicit.
4. Separate canonicalization, analysis, optimization, legalization, and lowering responsibilities.
5. Minimize unnecessary repeated passes.
6. Bound iterative/fixed-point transformations.
7. Preserve analysis only when transformations prove it remains valid.
8. Add IR verification between risky stage boundaries.
9. Capture before/after IR for representative workloads.
10. Measure compile-time and runtime impact of pipeline changes.
11. Add regression tests for known phase-ordering failures.

## Decision points
Place target-independent simplification before target lowering when semantics permit. Delay target-specific rewrites until enough hardware information exists. Use fixed-point iteration only when convergence is provable and bounded.

## Common failure patterns
Undocumented pass coupling, accidental dependence on canonicalization, unbounded rewrite loops, redundant analyses, late discovery of illegal IR, and performance changes caused by opaque ordering.

## Verification
Run verifier-enabled pipelines, compare IR snapshots, execute correctness suites, measure compile time, and benchmark runtime against a stable baseline.

## Expected output
A pipeline design or change with explicit stage contracts, ordering rationale, diagnostics, and correctness/performance evidence.

## Stop conditions
Stop if pass invariants are unknown, iteration cannot be bounded, or a proposed reorder changes semantics without an approved specification.