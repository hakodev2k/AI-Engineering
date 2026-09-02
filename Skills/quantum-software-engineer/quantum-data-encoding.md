# Quantum Data Encoding

## Purpose
Choose and validate mappings from classical or scientific data into quantum states without hiding state-preparation cost or introducing semantic distortion.

## When to use
Use for quantum machine learning, amplitude-based algorithms, signal processing, kernel methods, and any workload where external data must enter a quantum circuit.

## Inputs
Data shape, value ranges, sparsity, normalization rules, algorithm requirements, qubit budget, state-preparation budget, and readout needs.

## Context to inspect
Existing preprocessing, encoding convention, qubit ordering, circuit generator, expected invariances, data-loading assumptions, and downstream measurements.

## Core knowledge
Basis, angle, amplitude, unary, and problem-specific encodings trade qubits, depth, expressivity, and preparation cost differently. The complexity of preparing a state is part of the algorithm. Normalization and feature scaling can change problem semantics, not merely numerical conditioning.

## Procedure
1. Define which information must be preserved by the encoding.
2. Determine whether the quantum algorithm needs amplitudes, phases, basis labels, or parameterized rotations.
3. Quantify qubit count and preparation depth for candidate encodings.
4. Include normalization and padding rules explicitly.
5. Identify information lost through clipping, discretization, or normalization.
6. Validate the encoder on hand-computable examples.
7. Measure state-preparation overhead relative to the quantum kernel.
8. Check whether loading cost invalidates the expected complexity advantage.
9. Test sensitivity to feature scaling and noise.
10. Version the encoding contract with model or algorithm artifacts.

## Decision points
Use amplitude encoding only when state preparation is realistically available or its cost is included. Prefer simpler angle or basis encodings when they provide sufficient structure with lower depth.

## Common failure patterns
Ignoring loading cost, inconsistent normalization between training and inference, assuming feature count equals qubit count for all encodings, losing sign or phase information, and evaluating the quantum kernel without encoder overhead.

## Verification
Compare encoded states with expected representations, test round-trip or observable-level invariants where possible, measure preparation resources, and reproduce downstream results under fixed preprocessing.

## Expected output
A documented encoding contract, implementation, resource estimate, semantic-loss analysis, and validation tests.

## Stop conditions
Stop when required information cannot be represented faithfully, preparation cost dominates the workload, or preprocessing semantics are unresolved.