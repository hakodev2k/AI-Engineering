# Quantum Algorithm Selection

## Purpose
Select a quantum algorithm family only when problem structure, resource profile, and validation evidence make it a credible engineering choice.

## When to use
Use for feasibility studies, architecture decisions, or replacing an unsuitable prototype. Do not use to rationalize a quantum decision already made without evidence.

## Inputs
Problem formulation, objective, constraints, input size, precision target, classical baselines, hardware limits, runtime budget, and success metric.

## Preconditions
The problem is mathematically defined and at least one competent classical baseline exists.

## Context to inspect
Data-loading cost, oracle construction, sparsity, conditioning, symmetry, sampling needs, circuit depth, ancilla requirements, hardware connectivity, and optimization stability.

## Core knowledge
Theoretical speedup is not practical advantage. State preparation, readout, fault-tolerance overhead, sampling complexity, and classical preprocessing can dominate. Near-term methods must be judged under realistic noise and optimizer behavior.

## Procedure
1. Formalize the computational problem and required output.
2. Record strong classical baselines.
3. Enumerate relevant quantum algorithm families and assumptions.
4. Include state-preparation, oracle, ancilla, and measurement costs.
5. Estimate logical qubits, depth, shots, and classical work.
6. Check compatibility with available hardware.
7. Define small known-answer test cases.
8. Compare practical scaling and crossover assumptions.
9. Reject candidates whose hidden overhead dominates.
10. Document the selected algorithm and why alternatives were rejected.

## Decision points
Prefer exact algorithms for fault-tolerant planning; use variational or sampling methods only when near-term hardware can support meaningful instances. Use annealing only when formulation and embedding preserve the business objective.

## Common failure patterns
Choosing by popularity, ignoring state preparation, comparing asymptotic quantum complexity with weak classical code, and claiming advantage from toy problems.

## Verification
Reproduce known small cases, compare against the classical baseline, and validate resource assumptions experimentally where possible.

## Expected output
Algorithm decision record, assumptions, resource estimate, baseline comparison, validation plan, and rejected alternatives.

## Stop conditions
Stop when no candidate has a credible resource path or classical methods dominate at relevant scales.