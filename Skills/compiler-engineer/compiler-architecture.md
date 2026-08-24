# Compiler Architecture

## Purpose
Design or assess an end-to-end compiler pipeline with explicit contracts between front end, middle end, back end, runtime, and tooling.

## When to use
Use for new compilers, major pipeline changes, or architectural reviews. Do not use to justify abstractions without measurable need.

## Inputs
Language/runtime requirements, target platforms, repository, performance goals, diagnostics requirements, compatibility constraints.

## Context to inspect
Existing IRs, pass manager, parser, type system, code generators, runtime ABI, build graph, tests, benchmarks, debug-info pipeline.

## Core knowledge
Compiler stages trade simplicity against optimization opportunity. IR boundaries are long-lived APIs. Determinism, diagnostics, debuggability, incremental compilation, target portability, and compile-time budgets are architectural concerns.

## Procedure
1. Define source semantics and supported targets.
2. Map parsing, semantic analysis, lowering, optimization, code generation, linking, and runtime responsibilities.
3. Identify invariants at each boundary.
4. Choose IR layers only where semantic or optimization boundaries justify them.
5. Define pass ownership and analysis invalidation.
6. Define diagnostics and source-location preservation.
7. Define ABI/debug-info integration.
8. Establish correctness, compile-time, code-size, and runtime benchmarks.
9. Document extension points and compatibility constraints.
10. Validate architecture with representative programs and failure cases.

## Decision points
Prefer fewer IRs for simplicity; add layers when they isolate semantics or unlock reusable optimizations. Prefer target-independent transforms before target-specific lowering unless hardware semantics require otherwise.

## Common failure patterns
Leaky stage boundaries, undocumented invariants, target details contaminating the front end, irreversible loss of source locations, nondeterministic passes, optimization pipelines with no compile-time budget.

## Verification
Compile conformance suites across targets; compare deterministic outputs; run performance and compile-time benchmarks; inspect diagnostics and debug stepping.

## Expected output
A justified pipeline design with stage contracts, invariants, risks, and measurable acceptance criteria.

## Stop conditions
Escalate when language semantics, target ABI, compatibility requirements, or runtime ownership are unresolved.