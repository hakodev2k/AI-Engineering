# Scientific Testing Strategy

## Purpose
Create a layered testing strategy that protects scientific correctness, numerical behavior, interfaces, and regression-sensitive results.

## When to use
Use when establishing quality gates, adding numerical algorithms, refactoring scientific code, or investigating repeated regressions.

## Inputs
Scientific requirements, algorithms, known solutions, APIs, failure history, platforms, and accepted numerical tolerances.

## Context to inspect
Unit tests, property tests, regression baselines, integration tests, benchmark suites, golden files, and CI environments.

## Core knowledge
Scientific tests must cover mathematical properties and error bounds, not only code paths. Exact-output golden tests can be brittle when valid floating-point variation exists.

## Procedure
1. Map critical scientific claims to testable properties.
2. Add unit tests for pure mathematical components.
3. Add invariants and property-based tests where applicable.
4. Use analytical or manufactured solutions for solver tests.
5. Add integration tests for complete workflows.
6. Define tolerance policies by quantity and scale.
7. Maintain regression cases for previously found failures.
8. Run tests across relevant precision/platform variants.
9. Separate correctness tests from performance benchmarks.
10. Review test gaps after incidents and model changes.

## Decision points
Use exact comparison for discrete outputs; use justified tolerance-based comparison for floating-point results. Prefer invariant tests over large opaque golden datasets where possible.

## Common failure patterns
Arbitrary tolerances, tests derived from the same implementation being tested, excessive mocking, missing edge regimes, and updating baselines without investigating changes.

## Verification
Introduce controlled faults to confirm important tests fail, run clean CI across supported environments, and trace critical requirements to tests.

## Expected output
A test matrix with numerical acceptance rules, regression coverage, reference cases, and CI execution guidance.

## Stop conditions
Escalate when no independent expected behavior can be defined for critical scientific calculations.