# Compiler Stack Architecture

## Purpose
Design and review ML compiler stacks that transform model programs into efficient executable artifacts across frontends, intermediate representations, optimization pipelines, runtimes, and hardware backends.

## When to use
Use when introducing a new compiler layer, integrating a framework or accelerator, diagnosing cross-layer performance issues, or reviewing compiler architecture.

## Inputs
Model/framework requirements, target hardware, existing IRs, runtime contracts, performance goals, supported operators, deployment constraints.

## Context to inspect
Inspect frontend import paths, graph capture, IR boundaries, legalization stages, optimization passes, code generation, runtime ABI, caching, shape assumptions, and backend capabilities.

## Core knowledge
A Senior ML Compiler Engineer must reason about abstraction boundaries, canonicalization, lowering legality, target-specific optimization, runtime ownership, shape polymorphism, and debuggability. Keep target-independent optimization separate from backend-specific lowering where possible.

## Procedure
1. Map the end-to-end compilation path from source model to executable.
2. Identify each IR and the invariants it guarantees.
3. Document where shapes, dtypes, layouts, devices, and effects become explicit.
4. Identify target-independent versus target-specific passes.
5. Define legalization responsibilities between layers.
6. Verify runtime ABI and memory ownership boundaries.
7. Identify fallback paths and unsupported operators.
8. Check observability: dumps, pass tracing, reproducers, diagnostics.
9. Review compile-time, binary-size, and runtime trade-offs.
10. Validate extension points for new operators and hardware.
11. Record architectural decisions and incompatible assumptions.

## Decision points
Choose fewer IR layers for simplicity when requirements are narrow; choose explicit staged IRs when multiple frontends/backends require stable contracts. Prefer canonical forms before expensive optimization.

## Common failure patterns
Leaky abstractions, duplicated lowering logic, target details appearing too early, unstable IR contracts, hidden runtime assumptions, opaque fallback behavior, and optimization passes depending on undocumented ordering.

## Verification
Compile representative models for every supported backend, inspect IR transitions, run correctness tests, compare performance against baselines, and verify unsupported cases fail with actionable diagnostics.

## Expected output
An architecture assessment or design with explicit layer responsibilities, invariants, lowering path, extension points, trade-offs, risks, and verification evidence.

## Stop conditions
Stop if target requirements are unknown, ABI ownership is ambiguous, or architectural changes require incompatible IR/runtime contracts without stakeholder approval.