# Quantum Testing and Verification

## Purpose
Create layered tests that verify classical wrappers, circuit semantics, probabilistic outputs, and hardware-facing behavior.

## When to use
Use for every reusable quantum component and before changing compiler, SDK, or backend settings.

## Inputs
Circuit/function contract, reference cases, expected invariants, simulator and hardware targets.

## Context to inspect
Qubit ordering, global phase relevance, stochastic tolerance, seeds, serialization, transpilation, and measurement mapping.

## Core knowledge
Quantum tests require invariants and statistical assertions rather than brittle exact sample counts. Small exact cases are essential reference points.

## Procedure
1. Define deterministic contract tests for classical code.
2. Build small circuits with analytically known outputs.
3. Test basis states and edge cases.
4. Compare unitaries/statevectors up to allowed equivalence where feasible.
5. Add property tests for normalization, reversibility, symmetry, or conserved quantities.
6. Define statistical bounds for sampled outputs.
7. Test transpiled circuits for semantic equivalence.
8. Add integration tests for provider job lifecycle.
9. Separate simulator correctness from hardware quality tests.

## Decision points
Use exact assertions for deterministic simulator states and confidence-based assertions for sampled distributions.

## Common failure patterns
Asserting exact noisy counts, ignoring qubit order, testing only happy paths, and conflating hardware drift with software regression.

## Verification
Run the suite across supported SDK/compiler versions and confirm controlled failures are detected.

## Expected output
A layered regression suite with statistical tolerances and backend-aware boundaries.

## Stop conditions
Stop when expected behavior is undefined or test tolerances cannot be justified.