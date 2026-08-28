# Quantum Resource Estimation

## Purpose
Estimate logical and physical resources required for quantum algorithms, including qubits, gates, depth, shots, runtime, and fault-tolerance overhead.

## When to use
Use during feasibility analysis, architecture comparison, and roadmap planning.

## Inputs
Algorithm/circuit, input size, target error, hardware assumptions, code/decoder assumptions, operation timings.

## Context to inspect
Dominant gate families, T-count/T-depth or equivalent expensive operations, parallelism, logical error target, state-preparation and measurement costs.

## Core knowledge
Resource estimates must state assumptions and distinguish logical from physical resources. Fault-tolerant overhead can dominate useful computation.

## Procedure
1. Define workload scale and success probability.
2. Count logical qubits and operation classes.
3. Estimate circuit depth and parallelizable structure.
4. Include repetitions/shots and classical control loops.
5. For fault tolerance, choose code and target logical error.
6. Estimate code distance and physical qubits.
7. Include non-Clifford resource factories and routing.
8. Convert operations to runtime using hardware timing assumptions.
9. Run sensitivity analysis over key assumptions.

## Decision points
Use range estimates when hardware parameters are uncertain. Separate near-term and fault-tolerant scenarios.

## Common failure patterns
Reporting only logical qubits, ignoring state preparation, omitting magic-state overhead, and presenting one optimistic number.

## Verification
Recompute using independent tools or hand checks for representative cases and validate scaling trends.

## Expected output
A transparent resource estimate with assumptions, ranges, and dominant bottlenecks.

## Stop conditions
Stop when algorithm details or hardware assumptions are too incomplete for a decision-grade estimate.