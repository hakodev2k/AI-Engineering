# Quantum Optimization

## Purpose
Formulate and test optimization problems for gate-model or annealing-style quantum approaches while preserving business constraints and classical comparability.

## When to use
Use for combinatorial optimization feasibility, QAOA/annealing prototypes, and formulation reviews.

## Inputs
Decision variables, objective, constraints, instance sizes, classical solver baseline, hardware limits.

## Preconditions
The original optimization problem and acceptance metrics are stable.

## Context to inspect
QUBO/Ising mapping, penalty scaling, graph density, embedding overhead, feasible-solution decoding, and classical preprocessing.

## Core knowledge
A mathematically valid mapping can still be operationally poor if penalties distort the landscape or embedding/depth explodes.

## Procedure
1. Establish a strong classical baseline.
2. Formalize variables, objective, and hard constraints.
3. Map to QUBO/Ising or circuit objective.
4. Calibrate penalties using problem bounds.
5. Estimate qubits, connectivity, depth, and shots.
6. Define feasible-solution decoding and repair rules.
7. Test small instances with known optima.
8. Compare approximation quality and runtime/cost.
9. Stress larger and adversarial instances.
10. Document crossover assumptions and limitations.

## Decision points
Use annealing for mappings naturally compatible with available connectivity; use gate-model methods when circuit structure and control justify them.

## Common failure patterns
Weak classical baselines, invalid penalty weights, counting infeasible samples as success, and ignoring embedding overhead.

## Verification
Compare feasibility rate, objective gap, variance, and total execution cost against classical methods.

## Expected output
Formulation, mapping, resource estimate, baseline comparison, and validated results.

## Stop conditions
Stop when mapping overhead dominates or solution quality is consistently inferior at relevant scales.