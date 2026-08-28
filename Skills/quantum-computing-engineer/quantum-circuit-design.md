# Quantum Circuit Design

## Purpose
Design quantum circuits that implement intended transformations while respecting qubit count, connectivity, depth, noise, and measurement constraints.

## When to use
Use when translating an algorithmic step into gates or reviewing a circuit for correctness and executability. Do not optimize gate count before functional behavior is established.

## Inputs
Algorithm specification, target backend, gate set, connectivity map, precision target, test instances.

## Preconditions
The problem formulation and expected output semantics are defined.

## Context to inspect
Existing circuit conventions, endianness, register layout, ancilla usage, controlled operations, decomposition rules, and backend limits.

## Core knowledge
Equivalent unitary behavior can have very different physical cost. Circuit depth, two-qubit gates, routing, ancillas, and measurement placement dominate practical fidelity.

## Procedure
1. Define the logical transformation and qubit/register semantics.
2. Build the smallest correct reference circuit.
3. Validate basis-state and small-state behavior in simulation.
4. Identify expensive multi-qubit operations.
5. Match circuit structure to hardware connectivity and native gates.
6. Minimize unnecessary swaps, resets, and barriers.
7. Bound ancilla use and ensure cleanup when required.
8. Add measurements only where information is needed.
9. Compare transpiled depth and error exposure across alternatives.
10. Document assumptions and expected observables.

## Decision points
Prefer shallower circuits on noisy hardware even when they use more single-qubit gates. Use ancillas when they materially reduce depth or simplify reversibility.

## Common failure patterns
Incorrect qubit ordering, uncomputed ancillas, hidden global-phase assumptions, excessive controlled operations, and optimization that changes semantics.

## Verification
Compare simulator outputs against analytical or classical references and inspect transpiled gate counts, depth, and connectivity compliance.

## Expected output
A correct circuit design with resource profile and backend compatibility evidence.

## Stop conditions
Stop when required gates cannot be represented faithfully, connectivity makes depth infeasible, or expected behavior cannot be verified on small instances.