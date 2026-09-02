# Quantum Optimization

## Purpose
Formulate optimization problems for quantum and hybrid solvers while preserving constraints, objective semantics, and credible benchmarking.

## When to use
Use for combinatorial optimization, QAOA-style workflows, annealing-inspired formulations, or when mapping business/scientific objectives to Ising/QUBO representations.

## Inputs
Objective, variables, constraints, feasible ranges, penalty policy, classical baseline, and hardware budget.

## Context to inspect
Problem sparsity, graph structure, constraint hardness, encoding choice, coefficient scaling, and solver limitations.

## Core knowledge
Encoding can dominate problem difficulty. Penalty terms must enforce feasibility without overwhelming objective resolution. Quantum formulations do not remove NP-hardness and must be evaluated against strong classical heuristics.

## Procedure
1. Define objective and feasibility independently.
2. Choose binary, spin, or alternate encoding.
3. Derive constraint penalties analytically.
4. Scale coefficients to backend precision.
5. Validate the formulation exhaustively on tiny instances.
6. Establish classical exact and heuristic baselines.
7. Select a circuit or solver family appropriate to connectivity and size.
8. Measure feasibility rate separately from objective quality.
9. Analyze sensitivity to penalties and initialization.
10. Report end-to-end runtime and sample cost.

## Decision points
Use penalty encodings when overhead is controlled; prefer constraint-preserving mixers or classical preprocessing when penalties create poor landscapes.

## Common failure patterns
Weak baselines, invalid penalty strengths, reporting best sample only, ignoring infeasible samples, and hiding preprocessing cost.

## Verification
Confirm formulation equivalence on small instances, feasibility, objective agreement, and statistically meaningful comparison against classical baselines.

## Expected output
A validated optimization encoding, solver plan, baseline comparison, and resource estimate.

## Stop conditions
Stop when encoding overhead destroys tractability, constraints cannot be represented faithfully, or there is no credible evaluation baseline.