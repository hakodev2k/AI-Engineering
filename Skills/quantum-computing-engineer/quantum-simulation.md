# Quantum Simulation

## Purpose
Design quantum-simulation workloads for physical systems with explicit model validity, encoding, Trotterization or alternative evolution methods, observables, and error budgets.

## When to use
Use for chemistry, materials, spin systems, or dynamical simulation feasibility and implementation.

## Inputs
Hamiltonian/model, initial state, observables, time horizon, precision target, symmetry information, hardware resources.

## Preconditions
The physical model and expected reference behavior are defined for tractable cases.

## Context to inspect
Encoding choice, term locality, commutation, state preparation, evolution method, measurement grouping, symmetry reduction, and classical reference solvers.

## Core knowledge
Simulation error combines model error, discretization/algorithm error, sampling error, and hardware noise. Encoding and state preparation can dominate the circuit.

## Procedure
1. Validate the physical Hamiltonian/model.
2. Choose an encoding and exploit conserved quantities.
3. Define initial-state preparation.
4. Select evolution or eigensolver method.
5. Estimate depth, qubits, and measurement cost.
6. Set separate algorithmic and statistical error budgets.
7. Validate small systems against exact/classical references.
8. Sweep time step or approximation order.
9. Test under realistic noise.
10. Report observables with uncertainty.

## Decision points
Choose product formulas for simplicity and local structure; use more advanced simulation methods when asymptotic benefits survive implementation overhead.

## Common failure patterns
Conflating hardware noise with Trotter error, poor state preparation, ignoring symmetry, and validating only aggregate energy.

## Verification
Check conserved quantities, convergence with approximation parameters, and agreement with reference observables.

## Expected output
Model mapping, circuit strategy, resource estimate, error budget, and validation evidence.

## Stop conditions
Stop when model assumptions are unresolved or required resources exceed the target platform.