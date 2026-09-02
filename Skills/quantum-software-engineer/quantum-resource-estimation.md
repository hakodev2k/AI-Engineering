# Quantum Resource Estimation

## Purpose
Estimate logical and physical resources required to execute a quantum workload under explicit architectural assumptions.

## When to use
Use during feasibility studies, algorithm comparison, fault-tolerant planning, and roadmap decisions.

## Inputs
Algorithm circuit or operation counts, logical qubits, target success probability, error-correction assumptions, hardware cycle times, and gate synthesis model.

## Context to inspect
T-count/T-depth, measurements, ancillas, parallelism, code distance, distillation factories, routing, decoder latency, and architecture-specific constraints.

## Core knowledge
Meaningful estimates must include both space and time. Logical gate counts alone are insufficient. Non-Clifford synthesis, error correction, state distillation, routing, and scheduling can dominate total spacetime volume.

## Procedure
1. Freeze the algorithm version and accuracy target.
2. Count logical qubits and operation classes.
3. Identify parallelizable versus serial critical paths.
4. Estimate logical error budget per operation.
5. Select code and physical error assumptions.
6. Calculate code distance and logical cycle costs.
7. Include synthesis and magic-state overhead.
8. Account for routing, ancillas, measurements, and classical feedback.
9. Produce low/base/high scenarios.
10. Identify the parameters with greatest sensitivity.
11. Compare alternative algorithms using identical assumptions.

## Decision points
Use detailed architecture-specific estimates for investment decisions; use coarse estimates only for early algorithm screening.

## Common failure patterns
Reporting one optimistic number, ignoring runtime, excluding factories, mixing assumptions across architectures, and comparing estimates produced with different accuracy targets.

## Verification
Recompute with independent tooling or formulas, reconcile operation counts, and run sensitivity checks over error rate, code distance, and synthesis precision.

## Expected output
A transparent resource model with logical qubits, physical qubits, runtime, operation counts, confidence range, and assumptions.

## Stop conditions
Stop when algorithm structure is unstable, required hardware assumptions are unavailable, or estimates are too assumption-sensitive to support the intended decision.