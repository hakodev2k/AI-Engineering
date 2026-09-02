# Hamiltonian Simulation

## Purpose
Translate physical or mathematical Hamiltonians into executable quantum simulations with controlled approximation error, resource cost, and observable validation.

## When to use
Use for quantum chemistry, materials, many-body systems, dynamics, phase estimation preparation, or algorithm components based on time evolution under a Hamiltonian.

## Inputs
Hamiltonian, basis or operator representation, simulation time, target observables, error tolerance, initial state, backend resources, and available simulation method.

## Context to inspect
Operator decomposition, coefficient magnitudes, commutation structure, state preparation, symmetry constraints, Trotter order/steps, product formulas, qubitization or LCU assumptions, and measurement strategy.

## Core knowledge
Hamiltonian simulation introduces approximation error from representation, truncation, synthesis, and numerical method in addition to hardware error. Product formulas, qubitization, linear-combination-of-unitaries methods, and problem-specific techniques have different asymptotic and practical trade-offs. Observable accuracy, not circuit fidelity alone, should drive engineering decisions.

## Procedure
1. Define the physical quantity or algorithmic result to estimate.
2. Validate units, basis, and operator conventions.
3. Simplify the Hamiltonian using known symmetries where safe.
4. Choose an encoding and operator decomposition.
5. Establish an error budget across model truncation, algorithmic approximation, synthesis, sampling, and hardware noise.
6. Select a simulation method suited to system size and required precision.
7. Validate tiny systems against exact diagonalization or trusted classical integration.
8. Sweep step size or approximation order to demonstrate convergence.
9. Estimate depth, ancillas, non-Clifford cost, and measurement burden.
10. Exploit commuting groups or structure only after proving semantic equivalence.
11. Compare observables against classical references within the tractable regime.
12. Document the regime where classical validation stops being available.

## Decision points
Use product formulas for moderate precision and exploitable structure; consider more advanced methods when asymptotic precision dominates and fault-tolerant resources are plausible. Prefer symmetry reduction when it lowers resources without changing the target sector.

## Common failure patterns
Reporting only Trotter step count without error analysis, mixing basis conventions, ignoring model truncation, using unvalidated state preparation, optimizing circuit depth while changing observables, and claiming physical accuracy from hardware execution alone.

## Verification
Check Hermiticity, compare small cases to exact classical results, demonstrate convergence versus approximation parameters, validate conserved quantities, and report the complete error budget.

## Expected output
A validated simulation design, operator mapping, approximation strategy, convergence evidence, resource estimate, and observable-level error analysis.

## Stop conditions
Stop when the Hamiltonian or basis is ambiguous, required precision exceeds available resources, or validation evidence contradicts the chosen approximation method.