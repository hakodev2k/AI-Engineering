# Quantum Software Testing

## Purpose
Build a test strategy for quantum software that separates classical defects, circuit-construction defects, stochastic behavior, compiler changes, and hardware noise.

## When to use
Use for SDK/library development, algorithm implementation, refactoring, CI, and production integration.

## Inputs
Source code, circuit builders, reference states, invariants, backends, tolerances, and regression history.

## Preconditions
Critical functions and expected mathematical behavior are identified.

## Context to inspect
Deterministic classical utilities, parameterized circuits, simulator modes, transpilation, random seeds, hardware integration, and statistical assertions.

## Core knowledge
Quantum outputs are distributions, so exact sample equality is usually wrong. Tests should use invariants, exact simulators where practical, equivalence checks, and statistical tolerances chosen from expected variance.

## Procedure
1. Unit-test deterministic preprocessing and decoding normally.
2. Validate circuit dimensions, parameters, and register conventions.
3. Test known states and reversible identities in exact simulation.
4. Assert normalization and conserved quantities.
5. Use property-based tests for equivalent transformations.
6. Test transpiled circuits against logical semantics.
7. Use statistically justified tolerances for sampled outputs.
8. Separate simulator CI from slower hardware smoke tests.
9. Pin or record compiler/backend versions for regressions.
10. Add a regression test for every reproduced defect.

## Decision points
Use exact state/unitary assertions for small circuits; use distribution-distance or observable-based checks for larger sampled circuits.

## Common failure patterns
Fixed-count equality, flaky shot-based tests, hardware tests in every CI path, unbounded tolerances, and testing only successful execution.

## Verification
Run tests repeatedly across seeds and supported backends and confirm failure rates remain within designed statistical bounds.

## Expected output
Layered test suite, tolerance rationale, backend matrix, regression coverage, and reproducible failures.

## Stop conditions
Stop when expected behavior cannot be specified or statistical thresholds cannot distinguish defects from normal variance.