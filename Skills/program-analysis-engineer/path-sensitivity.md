# Path Sensitivity

## Purpose
Preserve relevant branch conditions so an analysis distinguishes feasible from infeasible program states without exploding computational cost.

## When to use
Use when branch correlation materially affects nullness, security, resource-state, or correctness findings.

## Inputs
CFG, branch predicates, analysis domain, solver capability, and performance budget.

## Preconditions
Identify which predicates meaningfully affect the target property.

## Context to inspect
Conditional branches, guards, assertions, switch patterns, exception paths, loops, and merged states.

## Core knowledge
Full path sensitivity is rarely scalable. Predicate abstraction, trace partitioning, selective splitting, and solver-backed feasibility checks provide controlled precision.

## Procedure
1. Measure false findings caused by path merging.
2. Identify high-value predicates.
3. Define split and merge policy.
4. Normalize predicates where possible.
5. Track constraints with each abstract state.
6. Prune demonstrably infeasible states.
7. Bound partitions per program point.
8. Merge states when budgets are exceeded using a documented strategy.
9. Preserve provenance explaining why a path remains feasible.
10. Benchmark precision and cost.

## Decision points
Use selective path sensitivity for security and correctness hotspots; avoid globally splitting on every condition. Use SMT checks only where their cost buys meaningful precision.

## Common failure patterns
Unbounded state splitting, inconsistent predicate normalization, treating solver timeout as infeasible, and merging states in ways that silently lose the stated guarantee.

## Verification
Test correlated-branch examples, infeasible paths, loop predicates, and benchmark precision changes against a path-insensitive baseline.

## Expected output
A bounded path-sensitive strategy with measurable precision gains and explicit fallback behavior.

## Stop conditions
Stop when path state exceeds resource limits or the solver/model cannot represent required predicates reliably.