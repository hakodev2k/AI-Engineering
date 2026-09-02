# Abstract Interpretation

## Purpose
Design sound abstractions that approximate concrete program behavior while keeping analysis finite and computationally tractable.

## When to use
Use for numeric ranges, nullness, resource states, typestate, buffer reasoning, termination approximations, and scalable semantic bug finding.

## Inputs
Concrete semantics, target property, desired soundness level, resource budget, and representative programs.

## Preconditions
Define what concrete behaviors must be preserved and what loss of precision is acceptable.

## Context to inspect
CFG/IR, operations requiring abstraction, loops, recursion, calls, heap behavior, and existing domains.

## Core knowledge
Abstract domains require abstraction/concretization intuition, partial orders, joins, transfer functions, fixed points, and often widening/narrowing. Product or relational domains improve precision at cost.

## Procedure
1. State the concrete property and soundness claim.
2. Choose the minimal abstract domain that can express it.
3. Define ordering, bottom/top, and joins.
4. Define sound abstract transfer functions.
5. Specify widening and narrowing where loops require them.
6. Model unsupported operations conservatively.
7. Add provenance for imprecise transitions.
8. Evaluate precision on realistic code.
9. Measure convergence and memory.
10. Document assumptions that limit the soundness claim.

## Decision points
Use non-relational domains for scale and relational domains when correlations are essential. Apply widening thresholds or delayed widening only with evidence that they improve useful precision.

## Common failure patterns
Unsound transfer functions, accidental concretization, non-terminating iteration, excessive top states, and claiming soundness beyond modeled language features.

## Verification
Prove or test local transfer soundness, use adversarial cases, compare with concrete executions on bounded inputs, and regression-test known precision failures.

## Expected output
An abstract domain and analysis with explicit soundness scope, precision characteristics, and convergence behavior.

## Stop conditions
Stop when concrete semantics are unknown, a required operation cannot be conservatively modeled, or resource growth violates analysis budgets.