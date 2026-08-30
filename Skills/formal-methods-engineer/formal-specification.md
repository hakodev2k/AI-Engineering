# Formal Specification

## Purpose
Create precise, reviewable specifications of system behavior before implementation or verification. This skill turns ambiguous prose into explicit state, invariants, assumptions, and allowed transitions.

## When to use
Use for safety-, security-, protocol-, concurrency-, or correctness-critical behavior; before model checking or theorem proving; and when requirements contain hidden ambiguity. Do not formalize trivial behavior when tests and contracts provide sufficient assurance.

## Inputs
Requirements, architecture diagrams, interfaces, domain rules, failure semantics, existing code, known defects, and acceptance criteria.

## Preconditions
Identify stakeholders who can resolve domain ambiguity and the intended assurance level.

## Context to inspect
Existing specifications, terminology, state machines, API contracts, data constraints, concurrency model, threat model, and operational assumptions.

## Core knowledge
A useful formal specification separates environment assumptions from system guarantees, distinguishes safety from liveness, defines observable state, and avoids accidental implementation detail. The notation must match the problem: state-based methods, temporal logic, process algebra, refinement types, or proof assistants are alternatives, not universal defaults.

## Procedure
1. Define the verification question and system boundary.
2. Extract actors, state variables, inputs, outputs, and environment actions.
3. Normalize terminology and resolve contradictory requirements.
4. State assumptions explicitly.
5. Define initial states and legal transitions.
6. Encode domain invariants and forbidden states.
7. Add liveness or progress properties only where required.
8. Model failures, retries, cancellation, and concurrency where material.
9. Review examples and counterexamples with domain stakeholders.
10. Check the specification for satisfiability and vacuity.
11. Trace each important requirement to a formal property.
12. Version the specification with the implementation contract.

## Decision points
Prefer a lightweight executable specification when rapid iteration matters; use a proof-oriented language when mathematical proof obligations dominate. Model only detail required to answer the verification question.

## Common failure patterns
Over-modeling implementation details; omitted environment assumptions; inconsistent units or identities; vacuous properties; conflating safety and liveness; and treating the formal model as correct merely because a tool accepts it.

## Verification
Check syntax, satisfiability, reachable states, requirement traceability, stakeholder review, and representative positive/negative scenarios. Confirm each claimed property is actually asserted and non-vacuous.

## Expected output
A versioned specification, assumptions, property set, traceability notes, and unresolved questions.

## Stop conditions
Stop and escalate when critical semantics are unresolved, environment assumptions cannot be justified, or formalization exposes contradictory requirements.