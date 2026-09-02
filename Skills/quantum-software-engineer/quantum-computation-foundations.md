# Quantum Computation Foundations

## Purpose
Provide a rigorous execution framework for reasoning about qubits, state vectors, operators, measurement, entanglement, and circuit semantics when designing or reviewing quantum software.

## When to use
Use when translating a computational problem into a quantum formulation, reviewing algorithm correctness, diagnosing unexpected circuit behavior, or onboarding to a new quantum codebase. Do not use as a substitute for platform-specific execution knowledge when hardware behavior is the primary issue.

## Inputs
Problem statement, circuit or algorithm description, target framework, expected mathematical result, and any implementation constraints.

## Preconditions
The problem domain and intended output must be clear enough to define what correctness means.

## Context to inspect
Existing circuit conventions, qubit ordering, endianness, state preparation assumptions, measurement mapping, simulator configuration, and backend constraints.

## Core knowledge
Understand Hilbert spaces, tensor products, unitary evolution, computational basis states, projective measurement, global versus relative phase, entanglement, no-cloning, reversibility, and probability amplitudes. Treat qubit ordering and basis conventions as correctness-critical implementation details.

## Procedure
1. Define the classical problem and desired quantum output.
2. Identify the quantum state representation and basis conventions.
3. Write the intended state transitions mathematically before coding.
4. Verify each gate or operator preserves required properties.
5. Check tensor-product ordering and control-target orientation.
6. Identify where entanglement is created and why it is needed.
7. Define measurement semantics and post-processing.
8. Compare a small instance against a hand-computable result.
9. Simulate intermediate states where practical.
10. Document assumptions that affect portability across frameworks.

## Decision points
Use state-vector reasoning for small circuits and conceptual validation; use density matrices when noise or mixed states matter. Prefer explicit mathematical derivation over trial-and-error circuit editing for nontrivial logic.

## Common failure patterns
Confusing amplitudes with probabilities, ignoring phase, incorrect qubit ordering, assuming measurement is deterministic, treating entanglement as correlation only, and importing classical intuition into reversible computation without validation.

## Verification
Confirm normalization, expected basis probabilities, reversible behavior before measurement, agreement with analytically solvable examples, and consistency between mathematical notation and code indexing.

## Expected output
A correct quantum formulation, documented conventions, validated circuit semantics, and identified assumptions or limitations.

## Stop conditions
Stop and escalate when the mathematical objective is undefined, requirements contradict quantum constraints, or the chosen representation cannot express the intended behavior reliably.