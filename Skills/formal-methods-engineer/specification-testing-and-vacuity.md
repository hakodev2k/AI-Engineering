# Specification Testing and Vacuity

## Purpose
Test formal specifications themselves so successful verification reflects meaningful requirements rather than contradictory assumptions, unreachable antecedents, or properties that hold vacuously.

## When to use
Use before trusting any model-checking or proof result, after major specification changes, and whenever properties unexpectedly pass with little effort.

## Inputs
Specification, properties, assumptions, example traces, counterexamples, and expected valid/invalid scenarios.

## Preconditions
The specification must be executable, checkable, or otherwise evaluable by the selected formal toolchain.

## Context to inspect
Initial states, guards, environment constraints, fairness assumptions, antecedents, unreachable states, disabled transitions, and property coverage.

## Core knowledge
Formal verification can prove a malformed specification. Vacuity occurs when a property is technically true for irrelevant reasons, such as an antecedent never becoming true. Mutation and coverage techniques are essential defenses.

## Procedure
1. Build a set of expected positive and negative scenarios.
2. Confirm the model admits all intended positive scenarios.
3. Confirm it rejects known-invalid scenarios.
4. Negate key properties and expect counterexamples.
5. Mutate predicates, guards, and transition effects deliberately.
6. Check whether property antecedents and important states are reachable.
7. Inspect dead code, dead transitions, and over-constrained assumptions.
8. Remove or relax assumptions one at a time to test sensitivity.
9. Review unexpected success as critically as failure.
10. Track specification tests alongside formal properties.

## Decision points
Use generated mutation testing for large property suites; use hand-crafted scenario traces for domain semantics that automation cannot infer.

## Common failure patterns
Contradictory assumptions, unreachable antecedents, properties too weak to catch injected bugs, over-constrained environments, and treating parser/type-check success as semantic validation.

## Verification
Require known-bad mutations to fail, antecedents to be reachable, expected traces to execute, and vacuity checks to pass where supported.

## Expected output
A specification test suite, mutation results, vacuity findings, and corrected assumptions/properties.

## Stop conditions
Stop assurance claims when key properties cannot be made non-vacuous or expected behaviors are unreachable.