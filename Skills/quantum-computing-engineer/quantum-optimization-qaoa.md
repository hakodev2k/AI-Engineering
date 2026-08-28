# Quantum Optimization with QAOA

## Purpose
Formulate and evaluate constrained combinatorial optimization problems using QAOA or related alternating-operator methods.

## When to use
Use when a discrete optimization problem maps naturally to Ising/QUBO structure and a classical baseline is available.

## Inputs
Objective, constraints, graph/QUBO representation, penalty strategy, backend, depth and shot budget.

## Context to inspect
Variable encoding, coefficient scaling, penalty magnitudes, feasible-space size, mixer suitability, and baseline approximation quality.

## Core knowledge
Penalty encoding can distort landscapes; mixer design and parameter transfer can matter more than simply increasing QAOA depth.

## Procedure
1. Derive the QUBO/Ising objective and verify it classically.
2. Encode constraints with explicit penalty rationale or feasible-space mixers.
3. Normalize coefficient scales to backend precision.
4. Choose initial depth and parameterization conservatively.
5. Validate energies for known bitstrings.
6. Optimize with bounded evaluations and multiple initializations.
7. Sample candidate solutions and decode feasibility.
8. Compare approximation quality and runtime/cost to classical heuristics.
9. Increase depth only when evidence supports it.

## Decision points
Prefer constraint-preserving mixers when penalty tuning is unstable. Prefer classical heuristics when quantum depth or sampling overwhelms any quality benefit.

## Common failure patterns
Incorrect Ising signs, penalties that dominate useful structure, evaluating only energy not feasibility, and claiming advantage from tiny instances.

## Verification
Confirm encoded energies, feasibility rates, approximation ratios, and repeatability across seeds/backends.

## Expected output
A validated optimization formulation and empirical comparison.

## Stop conditions
Stop when encoding is invalid, feasible samples are negligible, or resource growth is not justified by solution quality.