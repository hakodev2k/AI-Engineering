# Qubit and Gate Modeling

## Purpose
Translate a mathematical quantum computation into a correct qubit/register model with explicit basis, gate semantics, ancilla usage, and measurement behavior.

## When to use
Use when designing circuits, reviewing algorithm implementations, or debugging unexpected state evolution. Do not use as a substitute for hardware calibration analysis.

## Inputs
Algorithm equations, basis conventions, register sizes, expected states, precision requirements, and target gate set.

## Preconditions
Input/output encodings and required observables are defined.

## Context to inspect
Endianness, qubit ordering, native gates, controlled operations, global versus relative phase, ancilla lifecycle, reset behavior, and measurement mapping.

## Core knowledge
Equivalent mathematical operators can compile very differently. Gate order, basis conventions, phase, entanglement, reversibility, and measurement collapse must be explicit. Ancillas should be uncomputed when residual entanglement can corrupt results.

## Procedure
1. Define logical registers and basis ordering.
2. Map input values to quantum states.
3. Derive required unitary/non-unitary steps.
4. Express each step with supported gates or decompositions.
5. Track phase-sensitive operations and controls.
6. Allocate and document ancillas.
7. Uncompute temporary state where required.
8. Define measurement bases and classical bit mapping.
9. Simulate small instances with statevector or exact methods.
10. Compare amplitudes/probabilities with analytical expectations.

## Decision points
Use amplitude, basis, angle, or other encodings based on preparation/readout cost and algorithm assumptions. Prefer native gates when portability is not more important than fidelity.

## Common failure patterns
Reversed bit ordering, hidden phase errors, dirty ancillas, measuring in the wrong basis, and assuming SDK register order matches mathematical notation.

## Verification
Check known states, invariants, normalization, reversibility where expected, and measurement distributions across representative inputs.

## Expected output
Documented register map, gate-level model, measurement contract, test cases, and validated expected distributions.

## Stop conditions
Stop when encoding conventions are ambiguous or the proposed operator cannot be implemented within target resources.