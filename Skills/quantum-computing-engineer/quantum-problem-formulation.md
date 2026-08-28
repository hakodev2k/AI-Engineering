# Quantum Problem Formulation

## Purpose
Translate a business, scientific, or engineering problem into a quantum-computing formulation with explicit assumptions, objective functions, constraints, and a credible classical baseline.

## When to use
Use before choosing a quantum algorithm, SDK, or hardware backend. Do not use to justify quantum usage when the problem has no plausible quantum structure.

## Inputs
Problem statement, data shape, constraints, accuracy target, latency/cost limits, classical baseline, target hardware access.

## Context to inspect
Existing formulations, numerical scales, sparsity/graph structure, oracle assumptions, data-loading cost, and downstream acceptance criteria.

## Core knowledge
Quantum advantage depends on end-to-end complexity, including encoding, circuit depth, shots, error rates, optimization loops, and classical preprocessing. A mathematically valid formulation can still be operationally useless.

## Procedure
1. Restate the objective and measurable success criteria.
2. Identify decision variables, constraints, and required outputs.
3. Build or confirm a classical baseline.
4. Identify candidate quantum representations and algorithms.
5. Account for state preparation, oracle, and measurement overhead.
6. Estimate qubits, depth, shots, and hybrid-loop cost.
7. Compare expected value against classical alternatives.
8. Document assumptions and rejection criteria.

## Decision points
Choose quantum only when structure and resource estimates justify experimentation. Prefer hybrid methods when only a subproblem maps well.

## Common failure patterns
Ignoring data-loading cost, assuming asymptotic speedup implies practical advantage, missing classical baselines, and hiding unrealistic oracle assumptions.

## Verification
Confirm the formulation reproduces small known instances, resource estimates are explicit, and the baseline comparison is measurable.

## Expected output
A defensible formulation, candidate algorithms, assumptions, resource envelope, and go/no-go recommendation.

## Stop conditions
Stop when requirements are ambiguous, resource estimates exceed available hardware materially, or no credible baseline comparison exists.