# Quantum Chemistry with VQE

## Purpose
Build and validate VQE workflows for molecular electronic-structure experiments with controlled approximations and resource estimates.

## When to use
Use for chemistry-focused quantum experiments where Hamiltonian construction and reference energies are well defined.

## Inputs
Molecular geometry, basis set, active space, fermion-to-qubit mapping, ansatz, optimizer, backend.

## Context to inspect
Frozen-core assumptions, active orbitals, spin/particle symmetries, reference-state preparation, Hamiltonian term count, and classical chemistry baseline.

## Core knowledge
Modeling choices before the quantum circuit can dominate error. Active-space truncation, mapping, tapering, ansatz structure, and measurement grouping all affect accuracy and cost.

## Procedure
1. Define target observable and chemical-accuracy requirement.
2. Generate and validate the molecular Hamiltonian classically.
3. Document basis, active space, and approximations.
4. Select mapping and exploit valid symmetries.
5. Prepare a physically meaningful reference state.
6. Choose a chemistry-aware ansatz with bounded depth.
7. Group observables and estimate shot cost.
8. Run noiseless simulation first.
9. Add realistic noise or hardware execution with mitigation.
10. Compare energy and other observables to classical references.

## Decision points
Use compact adaptive or problem-informed ansatzes when standard coupled-cluster circuits are too deep. Expand active space only when the accuracy gain justifies resources.

## Common failure patterns
Comparing different Hamiltonians, hiding truncation error, mixing units, and attributing modeling error to hardware noise.

## Verification
Reproduce reference energies on small systems and separate chemistry-model, algorithmic, sampling, and hardware errors.

## Expected output
A reproducible VQE study with error budget and resource profile.

## Stop conditions
Stop when approximation error already exceeds the target or the selected ansatz is infeasible on available hardware.