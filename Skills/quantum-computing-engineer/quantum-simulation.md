# Quantum Simulation

## Purpose
Use statevector, density-matrix, tensor-network, stabilizer, and sampling simulators appropriately for correctness, scaling, and noise studies.

## When to use
Use before hardware execution, for debugging, and for controlled comparisons.

## Inputs
Circuit family, qubit count, entanglement structure, noise needs, memory/compute limits, expected outputs.

## Context to inspect
Simulator method, numerical precision, parallelism, truncation settings, seed control, and noise support.

## Core knowledge
Simulation complexity depends on circuit structure, not only qubit count. Approximate methods need explicit error controls.

## Procedure
1. Define the simulation question: correctness, noise, scaling, or sampling.
2. Choose the least expensive valid simulator method.
3. Estimate memory and compute before large runs.
4. Validate small instances against an exact method.
5. Set deterministic seeds and numerical precision.
6. Record approximation/truncation parameters.
7. Compare simulator outputs across methods for selected checkpoints.
8. Profile runtime and memory as size increases.

## Decision points
Use statevector for exact pure-state studies within memory limits; density matrices for explicit mixed-state noise; tensor networks for suitable low-entanglement structure.

## Common failure patterns
Using exact simulation beyond resource limits, unreported approximation thresholds, and assuming simulator success predicts hardware success.

## Verification
Cross-check small cases, monitor norm/probability consistency, and quantify approximation error where applicable.

## Expected output
A reproducible simulation plan and validated results.

## Stop conditions
Stop when estimated memory/compute exceeds limits or approximation error cannot be bounded.