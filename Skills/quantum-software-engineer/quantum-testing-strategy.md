# Quantum Testing Strategy

## Purpose
Build a layered testing strategy for quantum software that separates classical defects, circuit-semantic defects, stochastic behavior, compilation regressions, and hardware-specific failures.

## When to use
Use when adding quantum features, stabilizing a research codebase, introducing CI, or preventing regressions across SDK/backend upgrades.

## Inputs
Repository, algorithms, circuits, expected properties, simulator options, provider integrations, and CI budget.

## Context to inspect
Existing test pyramid, deterministic seeds, reference vectors, tolerances, shot counts, transpiler versions, backend mocks, and hardware-test policy.

## Core knowledge
Quantum tests often assert distributions, invariants, equivalence, or statistical bounds rather than exact bitstrings. Deterministic classical logic should still receive ordinary unit tests. Hardware tests should be sparse and diagnostic because queueing, calibration, and stochasticity make them unsuitable as the primary regression layer.

## Procedure
1. Separate pure classical functions from quantum execution boundaries.
2. Unit-test encodings, parameter transformations, and post-processing deterministically.
3. Test small circuits against analytic states or exact simulators.
4. Add invariant/property tests for normalization, reversibility, symmetry, or conserved quantities.
5. Use seeded shot-based tests with statistically justified tolerances.
6. Test transpiled circuits for semantic equivalence.
7. Mock provider lifecycle behavior for integration tests.
8. Keep a minimal hardware smoke suite for real-backend validation.
9. Pin or record toolchain versions used by CI.
10. Diagnose flaky tests rather than widening tolerances reflexively.

## Decision points
Use exact-state assertions when tractable; use distribution tests when measurement is intrinsic. Move tests to hardware only when hardware behavior is the subject under test.

## Common failure patterns
Exact assertions on stochastic outputs, overly broad tolerances, hardware-dependent CI, no reference cases, testing only happy paths, and conflating simulator and provider integration coverage.

## Verification
Demonstrate that tests fail for deliberate circuit, mapping, and post-processing defects; monitor flake rate; and confirm coverage of critical invariants and provider failure paths.

## Expected output
A maintainable quantum test suite with deterministic, statistical, integration, and limited hardware layers.

## Stop conditions
Stop when correctness criteria are undefined, statistical power is insufficient for the claimed assertion, or tests require uncontrolled production hardware access.