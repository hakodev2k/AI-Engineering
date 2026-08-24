# Optimization Pass Design

## Purpose
Design compiler optimizations that are semantics-preserving, measurable, maintainable, and appropriately placed in the pipeline.

## When to use
Use for new optimization passes, pass rewrites, profitability tuning, or miscompilation investigations.

## Inputs
Optimization opportunity, IR semantics, target/runtime constraints, benchmarks, compile-time budget.

## Context to inspect
Pass pipeline, canonical forms, analyses, side-effect model, alias rules, existing combines, optimization remarks, regression tests.

## Core knowledge
Legality and profitability are separate. Every transform needs a proof obligation based on IR semantics; performance benefit must be measured against compile time and code size.

## Procedure
1. Define the pattern and expected benefit.
2. State legality conditions explicitly.
3. Identify required analyses and invalidation.
4. Check whether canonicalization should precede a dedicated pass.
5. Implement deterministic matching and rewriting.
6. Preserve metadata/debug information appropriately.
7. Add positive and near-miss negative tests.
8. Add miscompilation-oriented edge cases.
9. Benchmark runtime, code size, and compile time.
10. Reassess pipeline placement and interactions.

## Decision points
Prefer local combines for cheap canonical patterns; dedicated/global passes for transformations requiring expensive analysis. Disable marginal transforms when compile-time or code-size cost dominates.

## Common failure patterns
Profitability encoded as legality, undefined-behavior mistakes, stale analyses, phase-order dependency, optimization oscillation, benchmark overfitting.

## Verification
IR-level tests, differential execution, sanitizer/conformance suites, benchmark suites, compile-time measurements.

## Expected output
A justified optimization with explicit legality, profitability, tests, and measured impact.

## Stop conditions
Stop if semantic legality cannot be proven or performance benefit is not reproducible.