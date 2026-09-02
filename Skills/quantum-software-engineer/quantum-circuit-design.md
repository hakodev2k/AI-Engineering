# Quantum Circuit Design

## Purpose
Design quantum circuits that implement required transformations with clear semantics, manageable depth, and portability across simulators and hardware backends.

## When to use
Use when implementing a quantum algorithm, decomposing high-level operators into gates, reducing depth, or reviewing circuit structure.

## Inputs
Algorithm specification, target gate set, connectivity constraints, qubit budget, precision requirements, and expected outputs.

## Preconditions
The intended unitary or state transformation must be defined and testable on small cases.

## Context to inspect
Framework conventions, native gates, transpilation behavior, backend coupling map, dynamic-circuit support, and measurement limitations.

## Core knowledge
Circuit quality depends on semantic correctness first, then resource efficiency. Gate count, two-qubit gate count, circuit depth, ancilla usage, and connectivity all affect execution quality. Equivalent unitaries can have materially different noise exposure.

## Procedure
1. Express the intended transformation mathematically.
2. Identify reusable subcircuits and ancilla requirements.
3. Select a logical gate decomposition independent of hardware.
4. Verify the decomposition on small inputs.
5. Minimize unnecessary inverses, swaps, and repeated preparation.
6. Separate logical design from hardware mapping.
7. Inspect critical paths and two-qubit gate concentration.
8. Add measurements only where required.
9. Compare alternative decompositions against resource budgets.
10. Validate the final transpiled circuit as well as the logical circuit.

## Decision points
Prefer lower two-qubit gate count when hardware noise dominates; prefer lower depth when coherence time is limiting. Use ancillas only when their cost is justified by depth or synthesis improvements.

## Common failure patterns
Optimizing before proving correctness, assuming transpilation preserves favorable structure, introducing excessive swaps, measuring too early, and relying on simulator-only gates unavailable on hardware.

## Verification
Check unitary equivalence or representative state evolution, compare logical and transpiled outputs, measure depth and entangling-gate count, and run regression tests on small deterministic cases.

## Expected output
A validated circuit implementation with documented resource costs, backend assumptions, and trade-offs.

## Stop conditions
Stop when the target transformation is underspecified, backend constraints make the design infeasible, or optimization changes semantics without a proof or reliable equivalence check.