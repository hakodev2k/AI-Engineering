# Acceptance Criteria Design

## Purpose
Define observable boundaries of acceptable product behavior without prescribing unnecessary implementation detail.

## When to use
Use for backlog refinement, ambiguous business rules, defects, integrations, and behavior with important edge cases.

## Inputs
Requirement, user outcome, business rules, examples, existing behavior, interfaces, and quality constraints.

## Context to inspect
Inspect domain terminology, current contracts, permissions, validation, error behavior, edge cases, and relevant non-functional requirements.

## Core knowledge
Acceptance criteria should clarify behavior, not duplicate test scripts or architecture. Examples and Given-When-Then can expose ambiguity, but format is secondary to shared understanding.

## Procedure
1. State the intended user or business outcome.
2. Identify normal behavior and key rules.
3. Enumerate meaningful boundaries and exceptions.
4. Clarify permissions and invalid states.
5. Include observable error behavior where relevant.
6. Add non-functional acceptance only when material to the item.
7. Use concrete examples for ambiguous calculations or state transitions.
8. Review criteria with engineering and QA.
9. Remove implementation prescriptions unless they are true constraints.
10. Update criteria when discovery changes the requirement.

## Decision points
Use examples for complex rules; use concise bullets for straightforward behavior. Separate global quality standards from story-specific criteria.

## Common failure patterns
Vague terms such as fast or user-friendly, criteria written after implementation, excessive UI detail, missing negative cases, and hidden assumptions.

## Verification
Confirm criteria are testable, mutually understood, traceable to the outcome, and sufficient to distinguish accepted from rejected behavior.

## Expected output
Clear, testable acceptance criteria with relevant examples and edge conditions.

## Stop conditions
Stop when business rules conflict, required policy interpretation is missing, or stakeholders cannot agree on observable behavior.