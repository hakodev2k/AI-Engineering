# Model Checking

## Purpose
Systematically explore a formal model to determine whether required properties hold and produce actionable counterexamples when they do not.

## When to use
Use for finite or finitely abstractable state spaces, especially protocols, concurrency, distributed coordination, access-control logic, and lifecycle systems. Do not treat model checking as proof of implementation correctness unless the model-to-code relation is justified.

## Inputs
Formal model, property set, environment assumptions, bounds, fairness conditions, and expected scenarios.

## Preconditions
The model parses, initializes, and represents the behavior relevant to the claims being checked.

## Context to inspect
State variables, transition relation, symmetry, abstraction boundaries, parameter ranges, tool configuration, and previous counterexamples.

## Core knowledge
Exhaustive exploration is limited by state explosion. Abstraction, symmetry reduction, partial-order reduction, bounded checking, and compositional reasoning can make verification tractable but may weaken conclusions if misapplied.

## Procedure
1. Define the exact claims and scope of verification.
2. Validate initial-state coverage.
3. Run small configurations first.
4. Confirm intentionally false properties produce counterexamples.
5. Increase bounds or parameters systematically.
6. Inspect counterexample traces from the earliest divergence.
7. Determine whether each failure is a model bug, requirement bug, or design bug.
8. Apply sound reductions or abstractions where required.
9. Re-run the full property set after every model change.
10. Record explored configurations, tool versions, and resource limits.

## Decision points
Use bounded checking for fast bug finding and exhaustive checking when the finite state space is manageable. Prefer abstraction only when the preserved property class is understood.

## Common failure patterns
Checking one tiny configuration and generalizing, trusting vacuous success, hiding unfair traces, ignoring tool truncation, and modifying the model only to silence a counterexample.

## Verification
Confirm all target properties completed without unexplored-state warnings, reproduce counterexamples, and rerun known-negative mutations.

## Expected output
Verification results, checked bounds, counterexamples, assumptions, and residual risks.

## Stop conditions
Stop when state-space limits invalidate the claimed coverage, reductions are unsound for the property, or the model omits behavior essential to the conclusion.